import os
from typing import Optional
from pydantic import BaseModel
from dotenv import load_dotenv

# Load root .env
load_dotenv()


class AuthConfig(BaseModel):
    # Service settings
    PROJECT_NAME: str = "Axios Dual Auth Service (WorkOS)"
    VERSION: str = "2.0.0"
    PORT: int = int(os.getenv("AUTH_PORT", "8008"))
    API_V1_STR: str = "/api/v1"

    # WorkOS Organisational Credentials
    WORKOS_ORGANIZATIONAL_API_KEY: str = (
        os.getenv("WORKOS_ORGANIZATIONAL_API_KEY")
        or os.getenv("WORKOS_API_KEY")
        or ""
    )
    WORKOS_ORGANIZATIONAL_CLIENT_ID: str = (
        os.getenv("WORKOS_ORGANIZATIONAL_CLIENT_ID")
        or os.getenv("WORKOS_CLIENT_ID")
        or ""
    )

    # WorkOS Evolution (Demo) Credentials - Dedicated 'axios's eval auth' Application
    WORKOS_EVOLUTION_API_KEY: str = (
        os.getenv("WORKOS_EVOLUTION_API_KEY")
        or ""
    )
    WORKOS_EVOLUTION_CLIENT_ID: str = (
        os.getenv("WORKOS_EVOLUTION_CLIENT_ID")
        or ""
    )

    # JWT Secrets & Security Isolation
    # Strictly different secret keys to guarantee zero token forgery across boundaries
    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY", "axios_organizational_super_secret_jwt_key_2026_prod"
    )
    EVOLUTION_JWT_SECRET_KEY: str = os.getenv(
        "EVOLUTION_JWT_SECRET_KEY", "axios_evolution_isolated_secret_jwt_key_2026_demo"
    )
    JWT_ALGORITHM: str = "HS256"

    # Token Lifespans
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    EVOLUTION_SESSION_EXPIRE_HOURS: int = 8

    # Database URL
    DATABASE_URL: Optional[str] = os.getenv("AUTH_DATABASE_URL") or os.getenv("DATABASE_URL")

    # WorkOS Redirect URI
    WORKOS_REDIRECT_URI: str = os.getenv(
        "WORKOS_REDIRECT_URI", "http://localhost:3000/auth/callback"
    )


settings = AuthConfig()
