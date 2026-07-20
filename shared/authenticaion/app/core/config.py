import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Athleia Authentication & Authorization Service"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8008

    # Connectivity
    GATEWAY_URL: str = os.getenv("GATEWAY_URL", "http://localhost:8000")
    NOTIFICATION_SERVICE_URL: str = os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:8009")

    # Database — reads AUTH_DATABASE_URL first, then DATABASE_URL, then local SQLite fallback
    DATABASE_URL: str = os.getenv(
        "AUTH_DATABASE_URL",
        os.getenv(
            "DATABASE_URL",
            "sqlite+aiosqlite:///./auth_service.db"
        )
    )

    # JWT & Security Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "athleia_enterprise_auth_super_secret_jwt_key_2026_prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    OTP_EXPIRE_MINUTES: int = 10
    MAX_FAILED_LOGIN_ATTEMPTS: int = 5
    LOCKOUT_DURATION_MINUTES: int = 15

    # SMTP Configuration for Email Verification
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAILS_FROM_NAME: str = os.getenv("EMAILS_FROM_NAME", "Athleia Security")
    EMAILS_FROM_ADDRESS: str = os.getenv("EMAILS_FROM_ADDRESS", "no-reply@athleia.ai")

    # Bootstrap Super Admin Credentials
    SUPERADMIN_EMAIL: str = os.getenv("SUPERADMIN_EMAIL", "admin@athleia.ai")
    SUPERADMIN_PASSWORD: str = os.getenv("SUPERADMIN_PASSWORD", "SuperAdmin123!")

    class Config:
        case_sensitive = True

settings = Settings()
