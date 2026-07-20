"""Health and Diagnostics endpoints for Compliance Intelligence Service.
"""

from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health")
@router.get("/__gateway/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "version": settings.VERSION,
        "port": settings.SERVICE_PORT,
        "rule_engine": "active",
        "llm_provider": settings.DEFAULT_LLM_PROVIDER,
        "database": "online",
    }
