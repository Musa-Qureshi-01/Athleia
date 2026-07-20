"""FastAPI Router for Knowledge Management endpoints (/api/v1/knowledge).
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query, Response, status
from pydantic import BaseModel, Field

from app.adapters.markdown.markdown_adapter import markdown_adapter
from app.adapters.okf.okf_adapter import okf_adapter
from app.core.errors import InvalidStateTransitionError, PackageNotFoundError, ValidationError
from app.domain.enums import PackageLifecycleState
from app.domain.lifecycle_service import lifecycle_service
from app.events.event_dispatcher import event_dispatcher
from app.repositories.sqlalchemy_repository import repository
from app.storage.blob_storage import blob_storage
from app.validation.package_validator import package_validator
from app.validation.relationship_validator import relationship_validator

router = APIRouter(tags=["Knowledge Packages"])


class ImportMarkdownRequest(BaseModel):
    raw_markdown: str = Field(..., description="Raw Markdown text with YAML frontmatter")
    title: str = Field("Imported Document", description="Default document title")
    domain: str = Field("Industrial Operations", description="Knowledge Domain")


class LifecycleTransitionRequest(BaseModel):
    target_state: PackageLifecycleState = Field(..., description="Target lifecycle state (VALIDATED, PUBLISHED, DEPRECATED, ARCHIVED)")
    performed_by: str = Field("admin_user", description="User ID or Service invoking state change")


class SearchKnowledgeRequest(BaseModel):
    domain: Optional[str] = None
    state: Optional[PackageLifecycleState] = None
    tag: Optional[str] = None
    query: Optional[str] = None
    limit: int = 50


@router.post("/import", status_code=status.HTTP_201_CREATED)
async def import_knowledge_package(payload: Dict[str, Any], adapter: str = Query("okf", description="Format adapter (okf, markdown)")):
    """Imports knowledge package using specified format adapter (OKF v1.0 by default)."""
    try:
        if adapter.lower() == "okf":
            package = okf_adapter.import_from_dict(payload)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported format adapter '{adapter}'.")

        # Validate
        package_validator.validate(package)
        relationship_validator.validate(package)

        # Save to PostgreSQL Repository
        saved = await repository.save_package(package, performed_by="import_pipeline")

        # Store Blob Zip Archive
        zip_bytes = okf_adapter.export_to_zip(saved)
        blob_storage.save_bundle(saved.package_urn, saved.version, zip_bytes)

        # Emit Event
        await event_dispatcher.emit_knowledge_created(saved.package_urn, saved.version, saved.domain, len(saved.documents))

        return {
            "status": "success",
            "message": "Knowledge package imported and validated successfully.",
            "package_urn": saved.package_urn,
            "version": saved.version,
            "state": saved.state.value,
            "document_count": len(saved.documents),
        }
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail={"message": str(ve), "errors": ve.errors})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/import/markdown", status_code=status.HTTP_201_CREATED)
async def import_markdown_document(req: ImportMarkdownRequest):
    """Imports raw Markdown document with YAML frontmatter into Knowledge Package."""
    try:
        package = markdown_adapter.import_from_markdown(req.raw_markdown, title=req.title, domain=req.domain)
        package_validator.validate(package)
        saved = await repository.save_package(package, performed_by="markdown_importer")
        return {
            "status": "success",
            "package_urn": saved.package_urn,
            "version": saved.version,
            "document_count": len(saved.documents),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/export")
async def export_knowledge_package(package_urn: str = Query(..., description="Package URN"), format: str = Query("okf_json", description="Export format: okf_json or okf_zip")):
    """Exports registered knowledge package as canonical OKF JSON or Zip Bundle."""
    package = await repository.get_package(package_urn)
    if not package:
        raise HTTPException(status_code=404, detail=f"Knowledge package '{package_urn}' not found.")

    if format.lower() == "okf_zip":
        zip_bytes = okf_adapter.export_to_zip(package)
        filename = f"{package.package_urn.replace(':', '_')}.zip"
        return Response(
            content=zip_bytes,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    return okf_adapter.export_to_dict(package)


@router.get("/packages/detail")
async def get_package(package_urn: str = Query(..., description="Package URN")):
    """Retrieves single knowledge package details."""
    package = await repository.get_package(package_urn)
    if not package:
        raise HTTPException(status_code=404, detail=f"Knowledge package '{package_urn}' not found.")

    return okf_adapter.export_to_dict(package)


@router.post("/search")
async def search_knowledge(req: SearchKnowledgeRequest):
    """Searches knowledge packages by domain, lifecycle state, metadata tags, or keyword query."""
    state_filter = req.state.value if req.state else None
    packages = await repository.search_metadata(
        domain=req.domain,
        state=state_filter,
        tag=req.tag,
        query=req.query,
        limit=req.limit
    )

    return {
        "count": len(packages),
        "packages": [okf_adapter.export_to_dict(p) for p in packages]
    }


@router.post("/packages/lifecycle")
async def transition_lifecycle(package_urn: str = Query(..., description="Package URN"), req: LifecycleTransitionRequest = None):
    """Transitions package state through state machine (DRAFT -> VALIDATED -> PUBLISHED -> ARCHIVED)."""
    package = await repository.get_package(package_urn)
    if not package:
        raise HTTPException(status_code=404, detail=f"Knowledge package '{package_urn}' not found.")

    try:
        updated = lifecycle_service.transition(package, req.target_state)
        saved = await repository.save_package(updated, performed_by=req.performed_by)

        if req.target_state == PackageLifecycleState.PUBLISHED:
            await event_dispatcher.emit_knowledge_published(saved.package_urn, saved.version, saved.tenant_id)
        elif req.target_state == PackageLifecycleState.ARCHIVED:
            await event_dispatcher.emit_knowledge_archived(saved.package_urn, saved.version)

        return {
            "status": "success",
            "package_urn": saved.package_urn,
            "previous_state": package.state.value,
            "new_state": saved.state.value,
        }
    except InvalidStateTransitionError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/packages/audit")
async def get_package_audit_logs(package_urn: str = Query(..., description="Package URN")):
    """Retrieves immutable audit trail history for package URN."""
    logs = await repository.get_audit_logs(package_urn)
    return {
        "package_urn": package_urn,
        "audit_trail": logs
    }
