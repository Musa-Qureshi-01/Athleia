from fastapi import APIRouter, HTTPException, Depends, Header, status
from typing import Optional
from app.core.config import settings
from app.domain.models import (
    UserRegister,
    VerifyOTPRequest,
    ResendOTPRequest,
    UserLogin,
    TokenResponse,
    RefreshTokenRequest,
    UserProfile,
    PasswordResetRequest,
    PasswordResetConfirm,
)
from app.domain.enums import UserRole, UserStatus
from app.repositories.auth_repository import repository
from app.core.security import (
    hash_password,
    verify_password,
    generate_otp,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.email import send_verification_email, send_password_reset_email

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication & Security"])

@router.on_event("startup")
async def startup_event():
    await repository.init_db()

def get_role_permissions(role: UserRole) -> list[str]:
    base_employee = [
        "search_knowledge",
        "use_ai_reasoning",
        "view_documents",
        "view_maintenance_findings",
        "view_compliance_findings",
        "receive_notifications",
    ]
    if role == UserRole.EMPLOYEE:
        return base_employee

    manager_extra = ["view_reports", "view_team_analytics"]
    if role == UserRole.MANAGER:
        return base_employee + manager_extra

    admin_extra = [
        "upload_documents",
        "trigger_compliance_agent",
        "trigger_predictive_maintenance_agent",
        "manage_users",
        "assign_roles",
        "configure_organization",
        "delete_documents",
        "view_system_metrics",
    ]
    return base_employee + manager_extra + admin_extra

@router.post("/register", summary="Register New User")
async def register(req: UserRegister):
    existing = await repository.get_user_by_email(req.email)
    if existing:
        if existing.is_verified:
            raise HTTPException(status_code=400, detail="User with this email already exists and is verified. Please sign in.")
        
        # Unverified existing user: update details and generate fresh OTP
        hashed_pw = hash_password(req.password)
        async with repository.async_session() as session:
            async with session.begin():
                existing.hashed_password = hashed_pw
                existing.full_name = req.full_name
                existing.organization = req.organization or "Athleia Energy"
        
        otp_code = generate_otp()
        await repository.save_otp(existing.user_id, existing.email, otp_code)
        await send_verification_email(existing.email, otp_code)
        await repository.save_audit_log(existing.user_id, "USER_RE_REGISTERED", f"Unverified user re-registered: {existing.email}")

        return {
            "status": "success",
            "message": "Unverified account details updated. Fresh 6-digit OTP code sent.",
            "user_id": existing.user_id,
            "email": existing.email,
            "role": existing.role,
            "user_status": existing.status,
            "dev_otp": otp_code,
        }

    hashed_pw = hash_password(req.password)
    user = await repository.create_user(
        email=req.email,
        hashed_pw=hashed_pw,
        full_name=req.full_name,
        organization=req.organization or "Athleia Energy",
    )

    # Generate 6-digit OTP code & save
    otp_code = generate_otp()
    await repository.save_otp(user.user_id, user.email, otp_code)

    # Dispatch email verification OTP
    await send_verification_email(user.email, otp_code)

    await repository.save_audit_log(user.user_id, "USER_REGISTERED", f"User registered: {user.email}")

    return {
        "status": "success",
        "message": "User registered. 6-digit OTP verification code sent to email.",
        "user_id": user.user_id,
        "email": user.email,
        "role": user.role,
        "user_status": user.status,
        "dev_otp": otp_code,
    }

@router.post("/verify-otp", summary="Verify Email 6-Digit OTP")
async def verify_otp(req: VerifyOTPRequest):
    success = await repository.verify_otp(req.email, req.otp_code)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP code")

    user = await repository.get_user_by_email(req.email)
    if user:
        await repository.save_audit_log(user.user_id, "EMAIL_VERIFIED", f"Email verified via OTP for: {req.email}")

    return {
        "status": "success",
        "message": "Email verified successfully. You may now log in.",
        "email": req.email,
    }

@router.post("/resend-otp", summary="Resend Verification OTP")
async def resend_otp(req: ResendOTPRequest):
    user = await repository.get_user_by_email(req.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verified:
        return {"status": "info", "message": "Email is already verified."}

    new_otp = generate_otp()
    await repository.save_otp(user.user_id, user.email, new_otp)
    await send_verification_email(user.email, new_otp)

    return {
        "status": "success",
        "message": "New 6-digit OTP sent to email.",
        "dev_otp": new_otp,
    }

@router.post("/login", response_model=TokenResponse, summary="User Login")
async def login(req: UserLogin):
    user = await repository.get_user_by_email(req.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if user.status == UserStatus.LOCKED.value:
        raise HTTPException(
            status_code=403, detail="Account is temporarily locked due to excessive failed attempts."
        )

    if not verify_password(req.password, user.hashed_password):
        await repository.record_login_attempt(user.user_id, success=False)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.is_verified and user.email != settings.SUPERADMIN_EMAIL:
        new_otp = generate_otp()
        await repository.save_otp(user.user_id, user.email, new_otp)
        await send_verification_email(user.email, new_otp)
        raise HTTPException(
            status_code=403,
            detail=f"UNVERIFIED:{user.email}:{new_otp}"
        )

    # Clear failed login attempts & update last login timestamp
    await repository.record_login_attempt(user.user_id, success=True)

    # Issue JWT Access & Refresh Tokens
    token_payload = {
        "sub": user.user_id,
        "email": user.email,
        "role": user.role,
        "full_name": user.full_name,
    }
    access_token = create_access_token(token_payload)
    refresh_token = create_refresh_token(token_payload)

    await repository.save_audit_log(user.user_id, "USER_LOGIN", f"Successful login: {user.email}")

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in_seconds=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user_id=user.user_id,
        email=user.email,
        full_name=user.full_name,
        role=UserRole(user.role),
        status=UserStatus(user.status),
    )

@router.post("/refresh", summary="Rotate Refresh Token")
async def refresh_tokens(req: RefreshTokenRequest):
    payload = decode_token(req.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user_id = payload.get("sub")
    user = await repository.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_token_payload = {
        "sub": user.user_id,
        "email": user.email,
        "role": user.role,
        "full_name": user.full_name,
    }
    new_access = create_access_token(new_token_payload)
    new_refresh = create_refresh_token(new_token_payload)

    return {
        "access_token": new_access,
        "refresh_token": new_refresh,
        "token_type": "bearer",
        "expires_in_seconds": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }

@router.get("/me", response_model=UserProfile, summary="Get Current User Profile")
async def get_me(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid or expired access token")

    user_id = payload.get("sub")
    user = await repository.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")

    role_enum = UserRole(user.role)
    permissions = get_role_permissions(role_enum)

    return UserProfile(
        user_id=user.user_id,
        email=user.email,
        full_name=user.full_name,
        organization=user.organization,
        role=role_enum,
        status=UserStatus(user.status),
        is_verified=user.is_verified,
        created_at=user.created_at,
        last_login_at=user.last_login_at,
        permissions=permissions,
    )
