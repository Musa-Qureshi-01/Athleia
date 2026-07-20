from fastapi import APIRouter
from app.core.config import settings
from app.core.metrics import metrics_tracker

router = APIRouter(tags=["System Health & Metrics"])

@router.get("/health", summary="Service Health Check")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "port": settings.PORT
    }

@router.get("/metrics", summary="AI Observability & Token Metrics")
async def get_metrics():
    return metrics_tracker.to_dict()
