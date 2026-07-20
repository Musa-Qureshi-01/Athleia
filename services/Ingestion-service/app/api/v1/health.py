"""Health & Readiness Endpoint for Industrial Document Intelligence Service.
"""

import os
from fastapi import APIRouter, Depends, Request
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.database import get_db
from app.schemas.response import APISuccessResponse

router = APIRouter()


@router.get("/health", response_model=APISuccessResponse[dict])
async def health_check(request: Request, db: AsyncSession = Depends(get_db)):
    """Health readiness check inspecting service status, database connection, and storage base path."""
    request_id = getattr(request.state, "request_id", "req_health")

    db_status = "healthy"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    storage_writable = os.access(settings.STORAGE_BASE_DIR, os.W_OK) if os.path.exists(settings.STORAGE_BASE_DIR) else True

    health_data = {
        "service": settings.PROJECT_NAME,
        "status": "UP" if db_status == "healthy" else "DEGRADED",
        "environment": settings.ENVIRONMENT,
        "database": db_status,
        "storage_writable": storage_writable,
    }

    return APISuccessResponse(
        status="success",
        message="Service health report generated.",
        data=health_data,
        request_id=request_id
    )
