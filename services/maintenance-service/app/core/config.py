import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Athleia Maintenance Intelligence Service"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1/maintenance"
    PORT: int = 8007

    # Microservice Connectivity
    GATEWAY_URL: str = os.getenv("GATEWAY_URL", "http://localhost:8000")
    RETRIEVAL_SERVICE_URL: str = os.getenv("RETRIEVAL_SERVICE_URL", "http://localhost:8001")
    KNOWLEDGE_SERVICE_URL: str = os.getenv("KNOWLEDGE_SERVICE_URL", "http://localhost:8005")
    NOTIFICATION_SERVICE_URL: str = os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:8009")

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite+aiosqlite:///./maintenance_service.db"
    )

    # LLM Settings
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "openai")  # openai, anthropic, gemini, azure, ollama
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    DEFAULT_MODEL_NAME: str = os.getenv("DEFAULT_MODEL_NAME", "gpt-4o-mini")

    # Thresholds & Policies
    MIN_FAILURE_COUNT_THRESHOLD: int = 2
    HIGH_RISK_SCORE_THRESHOLD: float = 75.0
    CRITICAL_RISK_SCORE_THRESHOLD: float = 90.0

    class Config:
        case_sensitive = True

settings = Settings()
