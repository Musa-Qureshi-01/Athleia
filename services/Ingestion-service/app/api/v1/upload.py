"""Document Upload & Lifecycle Management API Router.
"""

import uuid
from typing import Optional
from fastapi import APIRouter, Depends, File, HTTPException, Header, Request, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import logger
from app.db.database import get_db
from app.db.models import DocumentRecord, DocumentVersionRecord, ProcessingJobRecord
from app.domain.models import NormalizedDocument, ProcessingState
from app.domain.taxonomy import DocumentCategory, DocumentSubtype
from app.schemas.response import APIErrorDetails, APIErrorResponse, APISuccessResponse
from app.schemas.upload import DocumentStatusData, UploadResponseData
from app.services.classifier import DocumentClassifier
from app.services.router import pipeline_router
from app.services.storage import StorageManager
from app.services.validation import DuplicateDocumentError, ValidationError, ValidationService

router = APIRouter()


Optional_Tenant_ID = Optional[str]


@router.post("/documents/upload", status_code=status.HTTP_202_ACCEPTED, response_model=APISuccessResponse[UploadResponseData])
async def upload_document(
    request: Request,
    file: UploadFile = File(...),
    x_tenant_id: Optional_Tenant_ID = Header(None, alias="X-Tenant-ID"),
    db: AsyncSession = Depends(get_db)
):
    """Secure document upload endpoint (FR-001, FR-002, FR-014).

    Validates format, MIME magic bytes, size limits, duplicate SHA-256 collision,
    persists raw storage file, registers document records, and returns task token.
    """
    request_id = getattr(request.state, "request_id", f"req_{uuid.uuid4().hex[:8]}")
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID

    try:
        # Read content stream
        content = await file.read()
        filename = file.filename or "unnamed_document"
        mime_type = file.content_type or "application/octet-stream"
        file_size = len(content)

        # 1. Validation Layer Checks
        subtype = ValidationService.validate_file_meta(filename, mime_type, file_size)
        ValidationService.validate_magic_bytes(mime_type, content)

        # Compute SHA-256 Hash
        file_hash = ValidationService.compute_sha256(content)

        # 2. Duplicate Detection
        await ValidationService.check_duplicate(db, tenant_id, file_hash)

        # 3. Storage Manager Persistence
        storage_path = await StorageManager.save_raw_file(tenant_id, file_hash, filename, content)

        # 4. Document Classification Engine
        classification = DocumentClassifier.classify(filename, mime_type, content)
        category = classification.category
        subtype = classification.subtype

        # 5. Register Document, Version, and Processing Job
        doc_id = str(uuid.uuid4())
        logical_doc_id = f"doc_log_{uuid.uuid4().hex[:8]}"
        task_id = f"task_{uuid.uuid4().hex[:12]}"

        # 6. Execute Pipeline Router for Knowledge Normalization
        normalized_doc = await pipeline_router.execute(
            document_id=doc_id,
            logical_document_id=logical_doc_id,
            filename=filename,
            file_hash=file_hash,
            mime_type=mime_type,
            size_bytes=file_size,
            category=category,
            subtype=subtype,
            content=content
        )

        doc_record = DocumentRecord(
            id=doc_id,
            logical_document_id=logical_doc_id,
            tenant_id=tenant_id,
            version="1.0",
            filename=filename,
            file_hash=file_hash,
            mime_type=mime_type,
            size_bytes=file_size,
            category=category.value,
            subtype=subtype.value,
            status=ProcessingState.COMPLETED.value,
            storage_path=storage_path,
            metadata_json=normalized_doc.model_dump()
        )

        version_record = DocumentVersionRecord(
            logical_document_id=logical_doc_id,
            version="1.0",
            document_id=doc_id,
            file_hash=file_hash,
            storage_path=storage_path,
        )

        job_record = ProcessingJobRecord(
            task_id=task_id,
            document_id=doc_id,
            tenant_id=tenant_id,
            state=ProcessingState.COMPLETED.value,
            current_stage="Completed",
            trace_logs=[{
                "stage": "Ingestion",
                "status": "Validated, Classified, and Normalized",
                "strategy": classification.strategy,
                "timestamp": request_id
            }]
        )

        db.add(doc_record)
        db.add(version_record)
        db.add(job_record)
        await db.flush()

        logger.info(
            "document_uploaded_successfully",
            document_id=doc_id,
            logical_id=logical_doc_id,
            file_hash=file_hash,
            size_bytes=file_size,
            tenant_id=tenant_id
        )

        response_data = UploadResponseData(
            document_id=doc_id,
            logical_document_id=logical_doc_id,
            version="1.0",
            filename=filename,
            file_hash=file_hash,
            size_bytes=file_size,
            mime_type=mime_type,
            processing_state=ProcessingState.QUEUED.value,
            task_id=task_id
        )

        return APISuccessResponse(
            status="success",
            message="Document accepted for processing.",
            data=response_data,
            request_id=request_id
        )

    except ValidationError as ve:
        logger.warn("upload_validation_failed", code=ve.code, message=ve.message)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "error": {
                    "category": "VALIDATION_ERROR",
                    "code": ve.code,
                    "message": ve.message,
                    "details": ve.details
                },
                "request_id": request_id
            }
        )
    except DuplicateDocumentError as de:
        logger.info("upload_duplicate_detected", existing_doc_id=de.existing_doc_id, file_hash=de.file_hash)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "status": "error",
                "error": {
                    "category": "RESOURCE_ERROR",
                    "code": "DUPLICATE_DOCUMENT",
                    "message": f"Document with identical content hash ({de.file_hash[:8]}...) already exists.",
                    "details": {"existing_document_id": de.existing_doc_id, "file_hash": de.file_hash}
                },
                "request_id": request_id
            }
        )


@router.get("/documents/{document_id}", response_model=APISuccessResponse[DocumentStatusData])
async def get_document_status(
    document_id: str,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Retrieves document record and processing status (FR-013)."""
    request_id = getattr(request.state, "request_id", f"req_{uuid.uuid4().hex[:8]}")
    stmt = select(DocumentRecord).where(DocumentRecord.id == document_id)
    result = await db.execute(stmt)
    doc = result.scalars().first()

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "status": "error",
                "error": {
                    "category": "RESOURCE_ERROR",
                    "code": "DOCUMENT_NOT_FOUND",
                    "message": f"Document ID {document_id} was not found."
                },
                "request_id": request_id
            }
        )

    data = DocumentStatusData(
        document_id=doc.id,
        logical_document_id=doc.logical_document_id,
        version=doc.version,
        filename=doc.filename,
        category=doc.category,
        subtype=doc.subtype,
        status=doc.status,
        created_at=doc.created_at.isoformat() + "Z"
    )

    return APISuccessResponse(
        status="success",
        message="Document record retrieved.",
        data=data,
        request_id=request_id
    )


@router.get("/documents/{document_id}/normalized", response_model=APISuccessResponse[NormalizedDocument])
async def get_normalized_document(
    document_id: str,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Retrieves canonical normalized document model (FR-012)."""
    request_id = getattr(request.state, "request_id", f"req_{uuid.uuid4().hex[:8]}")
    stmt = select(DocumentRecord).where(DocumentRecord.id == document_id)
    result = await db.execute(stmt)
    doc = result.scalars().first()

    if not doc or not doc.metadata_json:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "status": "error",
                "error": {
                    "category": "RESOURCE_ERROR",
                    "code": "NORMALIZED_DOCUMENT_NOT_FOUND",
                    "message": f"Normalized document for ID {document_id} was not found."
                },
                "request_id": request_id
            }
        )

    normalized_model = NormalizedDocument.model_validate(doc.metadata_json)
    return APISuccessResponse(
        status="success",
        message="Normalized document representation retrieved.",
        data=normalized_model,
        request_id=request_id
    )

