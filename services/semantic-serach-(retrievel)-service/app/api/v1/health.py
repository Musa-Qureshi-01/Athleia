"""Health & Monitoring Endpoint for Athleia Retrieval Service.
"""

from fastapi import APIRouter, Depends, Request
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.database import get_db
from app.schemas.response import APISuccessResponse

router = APIRouter()


@router.get("/health", response_model=APISuccessResponse[dict])
async def health_check(request: Request, db: AsyncSession = Depends(get_db)):
    """Health readiness check inspecting service status and database connection."""
    request_id = getattr(request.state, "request_id", "req_health")

    db_status = "healthy"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    health_data = {
        "service": settings.PROJECT_NAME,
        "status": "UP" if db_status == "healthy" else "DEGRADED",
        "environment": settings.ENVIRONMENT,
        "database": db_status,
        "embedding_model": settings.EMBEDDING_MODEL_NAME,
    }

    return APISuccessResponse(
        status="success",
        message="Retrieval Service health report generated.",
        data=health_data,
        request_id=request_id
    )
