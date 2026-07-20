"""API v1 Router Aggregator for Athleia Reasoning Service.
"""

from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.reason import router as reason_router

api_v1_router = APIRouter()
api_v1_router.include_router(health_router, tags=["Health"])
api_v1_router.include_router(reason_router, tags=["Reasoning Engine"])
