import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Athleia Centralized Notification Service"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1/notifications"
    PORT: int = 8009

    # Connectivity
    GATEWAY_URL: str = os.getenv("GATEWAY_URL", "http://localhost:8000")

    # Database — reads NOTIFICATION_DATABASE_URL first, then DATABASE_URL, then local SQLite fallback
    DATABASE_URL: str = os.getenv(
        "NOTIFICATION_DATABASE_URL",
        os.getenv(
            "DATABASE_URL",
            "sqlite+aiosqlite:///./notification_service.db"
        )
    )

    # Configuration & Retention
    MAX_NOTIFICATION_HISTORY: int = 1000
    RETENTION_DAYS: int = 90
    WEBSOCKET_PING_INTERVAL_SECONDS: int = 20

    class Config:
        case_sensitive = True

settings = Settings()
