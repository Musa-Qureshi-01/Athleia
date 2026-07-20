"""Document Indexing API Endpoints for Athleia Retrieval Service.
"""

import uuid
from fastapi import APIRouter, Depends, Header, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.database import get_db
from app.schemas.response import APISuccessResponse
from app.schemas.search import IndexDocumentRequest
from app.services.index_manager import index_manager

router = APIRouter()


@router.post("/index", response_model=APISuccessResponse[dict], status_code=status.HTTP_201_CREATED)
async def index_document(
    request: Request,
    payload: IndexDocumentRequest,
    db: AsyncSession = Depends(get_db),
    x_tenant_id: str | None = Header(None)
):
    """Indexes NormalizedDocument chunks into Dense Vector and Sparse BM25 stores."""
    request_id = getattr(request.state, "request_id", f"req_{uuid.uuid4().hex[:8]}")
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID

    res = await index_manager.index_document(db, payload, tenant_id=tenant_id)

    return APISuccessResponse(
        status="success",
        message=f"Document {payload.document_id} successfully indexed across Vector & BM25 stores.",
        data=res,
        request_id=request_id
    )


@router.delete("/index/{document_id}", response_model=APISuccessResponse[dict])
async def purge_document_index(
    document_id: str,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Purges all index records for a given document_id."""
    request_id = getattr(request.state, "request_id", f"req_{uuid.uuid4().hex[:8]}")

    await index_manager.delete_document_indexes(db, document_id)

    return APISuccessResponse(
        status="success",
        message=f"Indexes for document {document_id} purged successfully.",
        data={"document_id": document_id, "status": "PURGED"},
        request_id=request_id
    )
