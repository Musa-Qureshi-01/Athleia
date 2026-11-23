from enum import Enum
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    EMPLOYEE = "EMPLOYEE"
    AUDITOR = "AUDITOR"


class UserStatus(str, Enum):
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
    ACTIVE = "ACTIVE"
    LOCKED = "LOCKED"
    DISABLED = "DISABLED"


# ── Request Models ────────────────────────────────────────────────────────────

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    organization: Optional[str] = "Axios Enterprise"


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp_code: str


class ResendOTPRequest(BaseModel):
    email: EmailStr


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class RoleUpdateRequest(BaseModel):
    role: UserRole


class StatusUpdateRequest(BaseModel):
    status: UserStatus


# ── Response Models ───────────────────────────────────────────────────────────

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in_seconds: int
    user_id: str
    email: str
    full_name: str
    role: UserRole
    status: UserStatus


class UserProfile(BaseModel):
    user_id: str
    email: str
    full_name: str
    organization: str
    role: UserRole
    status: UserStatus
    is_verified: bool = True
    created_at: datetime
    last_login_at: Optional[datetime] = None
    permissions: List[str] = []


class WorkOSAuthURLResponse(BaseModel):
    authorization_url: str


class WorkOSCallbackRequest(BaseModel):
    code: str


# ── Evolution (Demo) Models ───────────────────────────────────────────────────

class EvolutionTokenRequest(BaseModel):
    demo_email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    demo_organization: Optional[str] = "Demo Workspace"
    purpose: Optional[str] = "Evaluation"


class EvolutionTokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    expires_in_seconds: int
    session_id: str
    demo_user: str
    role: str = "EVOLUTION_GUEST"
    scope: str = "evolution:demo"
    queries_allocated: int = 50
    queries_remaining: int = 50


class EvolutionStatusResponse(BaseModel):
    active: bool
    session_id: str
    role: str
    scope: str
    queries_remaining: int
    features_permitted: List[str]
    features_restricted: List[str]
