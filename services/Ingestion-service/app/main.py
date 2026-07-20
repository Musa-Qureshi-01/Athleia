"""FastAPI Application Entrypoint for Altheia Industrial Document Intelligence Service.
"""

from contextlib import asynccontextmanager
import time
import uuid
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import api_v1_router
from app.core.config import settings
from app.core.logging import logger, setup_logging
from app.db.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for async startup and shutdown."""
    setup_logging(debug=settings.DEBUG)
    logger.info("service_startup_init", project=settings.PROJECT_NAME, env=settings.ENVIRONMENT)
    await init_db()
    yield
    logger.info("service_shutdown_complete")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Core ingestion, classification, normalization, and knowledge extraction service for Athleia.ai",
    lifespan=lifespan
)

# Enable CORS for internal platform services
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_trace_request_id(request: Request, call_next):
    """Middleware attaching request_id to context and tracking duration_ms."""
    request_id = request.headers.get("X-Request-ID") or f"req_{uuid.uuid4().hex[:8]}"
    request.state.request_id = request_id

    start_time = time.time()
    response = await call_next(request)
    duration_ms = int((time.time() - start_time) * 1000)

    response.headers["X-Request-ID"] = request_id
    response.headers["X-Response-Time-MS"] = str(duration_ms)
    return response


# Register API Router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs_url": "/docs",
        "health_url": f"{settings.API_V1_STR}/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
