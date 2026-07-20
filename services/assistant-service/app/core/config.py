import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Athleia Enterprise AI Workforce Copilot"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1/assistant"
    PORT: int = 8010

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"

    # Gateway & Internal Microservice Connectivity
    GATEWAY_URL: str = os.getenv("GATEWAY_URL", "http://localhost:8000")
    AUTH_SERVICE_URL: str = os.getenv("AUTH_SERVICE_URL", "http://localhost:8008")
    RETRIEVAL_SERVICE_URL: str = os.getenv("RETRIEVAL_SERVICE_URL", "http://localhost:8001")
    REASONING_SERVICE_URL: str = os.getenv("REASONING_SERVICE_URL", "http://localhost:8002")
    INGESTION_SERVICE_URL: str = os.getenv("INGESTION_SERVICE_URL", "http://localhost:8003")
    KNOWLEDGE_SERVICE_URL: str = os.getenv("KNOWLEDGE_SERVICE_URL", "http://localhost:8005")
    COMPLIANCE_SERVICE_URL: str = os.getenv("COMPLIANCE_SERVICE_URL", "http://localhost:8006")
    MAINTENANCE_SERVICE_URL: str = os.getenv("MAINTENANCE_SERVICE_URL", "http://localhost:8007")
    NOTIFICATION_SERVICE_URL: str = os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:8009")

    # Multi-Provider LLM Keys
    OPENROUTER_API_KEY_1: str = os.getenv("OPENROUTER_API_KEY_1", "")
    OPENROUTER_API_KEY_2: str = os.getenv("OPENROUTER_API_KEY_2", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_REGION: str = os.getenv("AWS_REGION", "eu-north-1")
    AWS_BEARER_TOKEN_BEDROCK: str = os.getenv("AWS_BEARER_TOKEN_BEDROCK", "")
    AWS_BEDROCK_MODEL_ID: str = os.getenv("AWS_BEDROCK_MODEL_ID", "anthropic.claude-3-5-sonnet-20240620-v1:0")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

    # Database — reads ASSISTANT_DATABASE_URL first, then DATABASE_URL, fallback SQLite
    DATABASE_URL: str = os.getenv(
        "ASSISTANT_DATABASE_URL",
        os.getenv(
            "DATABASE_URL",
            "sqlite+aiosqlite:///./assistant_service.db"
        )
    )

    # Features
    SEMANTIC_CACHE_ENABLED: bool = os.getenv("SEMANTIC_CACHE_ENABLED", "True").lower() == "true"
    EXTERNAL_SEARCH_ENABLED: bool = os.getenv("EXTERNAL_SEARCH_ENABLED", "True").lower() == "true"
    GLOBAL_MEMORY_ENABLED: bool = os.getenv("GLOBAL_MEMORY_ENABLED", "True").lower() == "true"

    # JWT Security Config
    SECRET_KEY: str = os.getenv("SECRET_KEY", "athleia_enterprise_auth_super_secret_jwt_key_2026_prod")
    ALGORITHM: str = "HS256"

    class Config:
        case_sensitive = True

settings = Settings()
