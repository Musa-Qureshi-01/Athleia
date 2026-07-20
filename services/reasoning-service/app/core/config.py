"""Environment configuration for Athleia Reasoning Service.
"""

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Altheia Industrial AI Reasoning Service"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./reasoning_service.db"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: str) -> str:
        if v and v.startswith("postgresql://"):
            v = v.replace("postgresql://", "postgresql+asyncpg://", 1)
        if v and "sslmode=" in v:
            v = v.replace("sslmode=", "ssl=")
        return v

    # Service Connections
    RETRIEVAL_SERVICE_URL: str = "http://127.0.0.1:8001"
    INGESTION_SERVICE_URL: str = "http://127.0.0.1:8000"

    # Multi-Provider LLM Settings (GEMINI, BEDROCK_ANTHROPIC, GROQ, OPENROUTER, OLLAMA, DETERMINISTIC)
    LLM_PROVIDER: str = "DETERMINISTIC"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "anthropic/claude-3.5-sonnet"
    BEDROCK_MODEL_ID: str = "anthropic.claude-3-5-sonnet-20240620-v1:0"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.1"

    # Reasoning & Grounding Configuration
    MIN_GROUNDING_CONFIDENCE: float = 0.70  # Minimum confidence score to output grounded answers
    MAX_EVIDENCE_CHUNKS: int = 5

    # External Tool Safety Controls (Disabled by default per requirements)
    ENABLE_EXTERNAL_TOOLS: bool = False
    ENABLE_WEB_SEARCH: bool = False

    # Default Multitenancy
    DEFAULT_TENANT_ID: str = "default_tenant"

    model_config = SettingsConfigDict(
        env_file=("../data/.env", "../../data/.env", "data/.env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
