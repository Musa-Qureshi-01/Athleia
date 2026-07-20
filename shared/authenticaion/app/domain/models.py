from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.domain.enums import UserRole, UserStatus

class UserRegister(BaseModel):
    email: str = Field(..., example="engineer@athleia.ai")
    password: str = Field(..., min_length=8, example="Password123!")
    full_name: str = Field(..., example="Enterprise Engineer")
    organization: Optional[str] = "Athleia Energy"

class VerifyOTPRequest(BaseModel):
    email: str
    otp_code: str = Field(..., min_length=6, max_length=6)

class ResendOTPRequest(BaseModel):
    email: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in_seconds: int = 900
    user_id: str
    email: str
    full_name: str
    role: UserRole
    status: UserStatus

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class RoleUpdateRequest(BaseModel):
    role: UserRole

class StatusUpdateRequest(BaseModel):
    status: UserStatus

class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetConfirm(BaseModel):
    email: str
    otp_code: str
    new_password: str = Field(..., min_length=8)

class UserProfile(BaseModel):
    user_id: str
    email: str
    full_name: str
    organization: str
    role: UserRole
    status: UserStatus
    is_verified: bool
    created_at: str
    last_login_at: Optional[str] = None
    permissions: List[str] = Field(default_factory=list)
