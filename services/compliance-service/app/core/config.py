"""Pydantic Settings and Configuration for Compliance Intelligence Service (Port 8006).
"""

from typing import List, Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SERVICE_NAME: str = "compliance-service"
    SERVICE_PORT: int = 8006
    VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database Settings (PostgreSQL default, resilient SQLite fallback for tests)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/athleia_compliance"
    TEST_DATABASE_URL: str = "sqlite+aiosqlite:///:memory:"

    # Service Discovery Endpoints
    GATEWAY_URL: str = "http://localhost:8000"
    INGESTION_SERVICE_URL: str = "http://localhost:8003"
    RETRIEVAL_SERVICE_URL: str = "http://localhost:8001"
    KNOWLEDGE_SERVICE_URL: str = "http://localhost:8005"
    NOTIFICATION_SERVICE_URL: str = "http://localhost:8007"

    # LLM Settings
    DEFAULT_LLM_PROVIDER: str = "openai"  # openai, anthropic, gemini, ollama
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    OLLAMA_BASE_URL: str = "http://localhost:11434"

    # Compliance Engine Controls
    ENABLE_COMPLIANCE_AGENT: bool = True
    SCHEDULED_SCAN_INTERVAL_MINUTES: int = 60
    ENABLED_RULE_SETS: List[str] = [
        "METADATA",
        "EXPIRY",
        "APPROVAL",
        "MANDATORY_SECTIONS",
        "ISO_STANDARDS",
        "OSHA_SAFETY",
        "NIST_SECURITY",
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
