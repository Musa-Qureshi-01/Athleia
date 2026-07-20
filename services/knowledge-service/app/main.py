"""FastAPI Main Entrypoint for Athleia Enterprise Knowledge Service.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.packages_router import router as knowledge_router
from app.core.config import settings
from app.core.logging import logger, setup_logging
from app.repositories.sqlalchemy_repository import repository


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    logger.info("service_starting", service="knowledge-service", port=8005)
    await repository.init_db()
    logger.info("database_initialized", service="knowledge-service")
    yield
    logger.info("service_stopping", service="knowledge-service")


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/api/v1/knowledge/openapi.json",
    docs_url="/api/v1/knowledge/docs",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(knowledge_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Health"])
@app.get("/__gateway/health", tags=["Health"])
async def health_check():
    """Health check endpoint for API Gateway poller."""
    return {
        "status": "healthy",
        "service": "knowledge-service",
        "version": "1.0.0",
        "database": "online",
        "format_adapters": ["okf_v1.0", "markdown_frontmatter", "canonical_json"],
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8005, reload=True)
