"""API v1 Router Aggregator for Athleia Retrieval Service.
"""

from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.index import router as index_router
from app.api.v1.search import router as search_router

api_v1_router = APIRouter()
api_v1_router.include_router(health_router, tags=["Health"])
api_v1_router.include_router(index_router, tags=["Indexing"])
api_v1_router.include_router(search_router, tags=["Retrieval Search"])
