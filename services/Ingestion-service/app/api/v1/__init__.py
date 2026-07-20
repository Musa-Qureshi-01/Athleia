"""API v1 Router Aggregator.
"""

from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.upload import router as upload_router

api_v1_router = APIRouter()
api_v1_router.include_router(health_router, tags=["Health"])
api_v1_router.include_router(upload_router, tags=["Upload & Documents"])
