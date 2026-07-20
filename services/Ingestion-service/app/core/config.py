"""Environment configuration for Industrial Document Intelligence Service.
"""

import os
from typing import List, Set
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Altheia Industrial Document Intelligence Service"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database: Default points to Neon PostgreSQL or local SQLite fallback
    DATABASE_URL: str = "sqlite+aiosqlite:///./ingestion_service.db"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: str) -> str:
        """Converts standard postgresql:// to postgresql+asyncpg:// and normalizes sslmode for asyncpg."""
        if v and v.startswith("postgresql://"):
            v = v.replace("postgresql://", "postgresql+asyncpg://", 1)
        if v and "sslmode=" in v:
            v = v.replace("sslmode=", "ssl=")
        return v

    # Storage Configuration (Local or S3)
    STORAGE_BACKEND: str = "local"  # "local" or "s3"
    STORAGE_BASE_DIR: str = "./storage/raw"
    AWS_S3_BUCKET_NAME: str = "athleia-ingestion-bucket-256461399444-eu-north-1-an"
    AWS_REGION: str = "eu-north-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    MAX_UPLOAD_SIZE_BYTES: int = 52_428_800  # 50 MB limit

    # Allowed MIME Types for ingress security validation barrier
    ALLOWED_MIME_TYPES: Set[str] = {
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        "text/csv",
        "text/markdown",
        "image/png",
        "image/jpeg",
        "image/tiff",
        "image/bmp",
        "image/webp",
    }

    # Security & Multitenancy Defaults
    DEFAULT_TENANT_ID: str = "default_tenant"

    model_config = SettingsConfigDict(
        env_file=("../data/.env", "../../data/.env", "data/.env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
