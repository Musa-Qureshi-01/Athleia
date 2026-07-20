"""Environment configuration for Athleia Knowledge Service.
"""

import os
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Athleia Knowledge Service"
    API_V1_STR: str = "/api/v1/knowledge"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database (PostgreSQL with asyncpg fallback to aiosqlite for local testing)
    DATABASE_URL: str = "sqlite+aiosqlite:///./knowledge_service.db"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: str) -> str:
        """Converts standard postgresql:// to postgresql+asyncpg:// and normalizes sslmode for asyncpg."""
        if v and v.startswith("postgresql://"):
            v = v.replace("postgresql://", "postgresql+asyncpg://", 1)
        if v and "sslmode=" in v:
            v = v.replace("sslmode=", "ssl=")
        return v

    # Storage Path for OKF Package Bundles
    STORAGE_DIR: str = "./storage/packages"

    # Multitenancy Default
    DEFAULT_TENANT_ID: str = "default_tenant"

    model_config = SettingsConfigDict(
        env_file=("../data/.env", "../../data/.env", "data/.env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
