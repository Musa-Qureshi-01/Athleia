from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import logger
from app.repositories.assistant_repository import repository
import app.tools  # Trigger tool registration

from app.api.v1.chat_router import router as chat_router
from app.api.v1.conversation_router import router as conversation_router
from app.api.v1.feedback_router import router as feedback_router
from app.api.v1.model_router import router as model_router
from app.api.v1.tool_router import router as tool_router
from app.api.v1.preference_router import router as preference_router
from app.api.v1.health_router import router as health_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.PROJECT_NAME} (Port {settings.PORT})...")
    await repository.init_db()
    logger.info("Database tables initialized successfully.")
    yield
    logger.info("Shutting down Athleia Assistant Service...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
prefix = settings.API_V1_STR
app.include_router(chat_router, prefix=prefix)
app.include_router(conversation_router, prefix=prefix)
app.include_router(feedback_router, prefix=prefix)
app.include_router(model_router, prefix=prefix)
app.include_router(tool_router, prefix=prefix)
app.include_router(preference_router, prefix=prefix)
app.include_router(health_router, prefix=prefix)

@app.get("/")
async def root():
    return {
        "message": "Athleia Assistant Service is running",
        "docs": f"{settings.API_V1_STR}/docs",
        "health": f"{settings.API_V1_STR}/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=settings.DEBUG)
