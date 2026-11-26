import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from shared.auth.config import settings
from shared.auth.db import init_auth_db
from shared.auth.organizational.router import auth_router, users_router
from shared.auth.evolution.router import evolution_router
from shared.auth.forms_router import forms_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("auth.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Axios Dual Auth Service (WorkOS)...")
    await init_auth_db()
    logger.info(f"Dual Auth Service running on port {settings.PORT}.")
    yield
    logger.info("Axios Dual Auth Service shutting down.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url="/api/v1/auth/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Organizational Routers
app.include_router(auth_router)
app.include_router(users_router)

# Register Evolution Router
app.include_router(evolution_router)

# Register Public Form Inquiries Router (Isolated from Core Services)
app.include_router(forms_router)


@app.get("/health", tags=["Health"])
@app.get("/api/v1/auth/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "port": settings.PORT,
        "auth_providers": {
            "organizational": "WorkOS (SSO, AuthKit, Directory Sync, RBAC)",
            "evolution": "WorkOS (Isolated Demo Sandbox)",
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("shared.auth.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
