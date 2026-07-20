"""FastAPI Application Entrypoint for Compliance Intelligence Service (Port 8006).
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.compliance_router import router as compliance_router
from app.api.v1.health_router import router as health_router
from app.core.config import settings
from app.core.logging import logger
from app.repositories.sqlalchemy_repository import repository


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("service_starting", service=settings.SERVICE_NAME, port=settings.SERVICE_PORT)
    await repository.init_db()
    logger.info("database_initialized")
    yield
    logger.info("service_stopping", service=settings.SERVICE_NAME)


app = FastAPI(
    title="Athleia Compliance Intelligence Service",
    description="Autonomous Event-Driven Compliance Monitoring, Policy Validation, and Regulatory Governance Engine",
    version=settings.VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(compliance_router, prefix="/api/v1/compliance")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.SERVICE_PORT, reload=True)
