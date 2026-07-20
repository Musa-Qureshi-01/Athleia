"""Environment configuration for Athleia Retrieval / Semantic Search Service.
"""

from typing import Set
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Altheia Retrieval & Semantic Search Service"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./retrieval_service.db"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: str) -> str:
        """Converts standard postgresql:// to postgresql+asyncpg:// and normalizes sslmode for asyncpg."""
        if v and v.startswith("postgresql://"):
            v = v.replace("postgresql://", "postgresql+asyncpg://", 1)
        if v and "sslmode=" in v:
            v = v.replace("sslmode=", "ssl=")
        return v

    # Vector & Search Defaults
    EMBEDDING_MODEL_NAME: str = "BAAI/bge-small-en-v1.5"
    EMBEDDING_DIMENSION: int = 384
    DEFAULT_TOP_K: int = 10
    DEFAULT_RRF_K: int = 60  # Reciprocal Rank Fusion constant

    # Multitenancy Default
    DEFAULT_TENANT_ID: str = "default_tenant"

    model_config = SettingsConfigDict(
        env_file=("../data/.env", "../../data/.env", "data/.env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
