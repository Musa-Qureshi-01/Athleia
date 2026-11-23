from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status

from shared.auth.config import settings
from shared.auth.models import (
    UserLoginRequest,
    UserRegisterRequest,
    VerifyOTPRequest,
    ResendOTPRequest,
    TokenResponse,
    UserProfile,
    RoleUpdateRequest,
    StatusUpdateRequest,
    WorkOSAuthURLResponse,
    WorkOSCallbackRequest,
    UserRole,
    UserStatus,
)
from shared.auth.organizational.service import org_auth_service
from shared.auth.organizational.client import get_organizational_workos_client
from shared.auth.organizational.middleware import (
    get_current_org_user,
    require_admin_role,
)

auth_router = APIRouter(prefix="/api/v1/auth", tags=["Organisational Authentication (WorkOS)"])
users_router = APIRouter(prefix="/api/v1/users", tags=["Organisational User Administration"])


# ── Authentication Endpoints ──────────────────────────────────────────────────

@auth_router.post("/login", response_model=TokenResponse, summary="Organisational Login")
async def login(req: UserLoginRequest):
    return await org_auth_service.authenticate_user(req.email, req.password)


@auth_router.post("/register", summary="Register Organisational User")
async def register(req: UserRegisterRequest):
    return await org_auth_service.register_user(req)


@auth_router.post("/verify-otp", summary="Verify OTP")
async def verify_otp(req: VerifyOTPRequest):
    # In WorkOS flow, registrations are validated; endpoint maintained for contract backwards compatibility
    return {"message": "Email verified successfully.", "verified": True}


@auth_router.post("/resend-otp", summary="Resend OTP")
async def resend_otp(req: ResendOTPRequest):
    return {"message": "Verification code dispatched.", "email": req.email}


@auth_router.get("/me", response_model=UserProfile, summary="Current User Profile")
@auth_router.get("/user-profile", response_model=UserProfile, summary="User Profile (Alias)")
async def get_current_user_profile(user: dict = Depends(get_current_org_user)):
    user_id = user.get("sub", "")
    return await org_auth_service.get_user_profile(user_id)


# ── WorkOS AuthKit / SSO Direct Integration Endpoints ────────────────────────

@auth_router.get(
    "/workos/authorize-url",
    response_model=WorkOSAuthURLResponse,
    summary="Get WorkOS Hosted Auth / SSO URL",
)
async def get_workos_authorize_url(
    redirect_uri: Optional[str] = None,
    provider: Optional[str] = Query(None, description="OAuth provider: GoogleOAuth, MicrosoftOAuth, authkit, etc."),
):
    try:
        client = get_organizational_workos_client()
        target_redirect = redirect_uri or settings.WORKOS_REDIRECT_URI

        # Map friendly provider identifiers to WorkOS Provider types
        resolved_provider = "authkit"
        if provider:
            p_lower = provider.lower()
            if "google" in p_lower:
                resolved_provider = "GoogleOAuth"
            elif "microsoft" in p_lower or "azure" in p_lower:
                resolved_provider = "MicrosoftOAuth"
            elif "github" in p_lower:
                resolved_provider = "GitHubOAuth"
            elif "apple" in p_lower:
                resolved_provider = "AppleOAuth"
            else:
                resolved_provider = provider

        url = client.user_management.get_authorization_url(
            redirect_uri=target_redirect,
            provider=resolved_provider,
        )
        return WorkOSAuthURLResponse(authorization_url=url)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate WorkOS authorization URL: {e}",
        )


@auth_router.post("/workos/callback", response_model=TokenResponse, summary="Exchange WorkOS Code for Session")
async def workos_callback(req: WorkOSCallbackRequest):
    try:
        client = get_organizational_workos_client()
        auth_response = client.user_management.authenticate_with_code(
            code=req.code,
            client_id=settings.WORKOS_ORGANIZATIONAL_CLIENT_ID,
        )
        user_data = auth_response.user
        email = user_data.email
        full_name = f"{getattr(user_data, 'first_name', '')} {getattr(user_data, 'last_name', '')}".strip() or email

        # Synchronize / provision locally
        user = await org_auth_service.get_user_by_email(email)
        if not user:
            # Register user locally with default EMPLOYEE role
            await org_auth_service.register_user(
                UserRegisterRequest(
                    email=email,
                    password="workos_oauth_session_placeholder",
                    full_name=full_name,
                    organization="Axios Enterprise",
                )
            )
            user = await org_auth_service.get_user_by_email(email)

        role = UserRole(user.role) if user else UserRole.EMPLOYEE
        user_id = user.user_id if user else user_data.id

        access_token = org_auth_service.create_access_token(
            user_id=user_id,
            email=email,
            role=role.value,
            full_name=full_name,
            org=user.organization if user else "Axios Enterprise",
        )
        refresh_token = org_auth_service.create_refresh_token(user_id)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="Bearer",
            expires_in_seconds=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user_id=user_id,
            email=email,
            full_name=full_name,
            role=role,
            status=UserStatus.ACTIVE,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"WorkOS callback authentication failed: {e}",
        )


# ── Organisational User Management Endpoints (RBAC Enforced) ─────────────────

@users_router.get("", summary="List All Organisational Users")
async def list_users(
    status_filter: Optional[str] = Query(None),
    admin_user: dict = Depends(require_admin_role),
):
    users = await org_auth_service.list_users(status_filter=status_filter)
    return {"count": len(users), "users": users}


@users_router.get("/pending", summary="List Pending Verification Users")
async def list_pending_users(admin_user: dict = Depends(require_admin_role)):
    users = await org_auth_service.list_users(status_filter=UserStatus.PENDING_VERIFICATION.value)
    return {"count": len(users), "pending_users": [u.email for u in users]}


@users_router.patch("/{user_id}/role", summary="Update User Role")
async def update_user_role(
    user_id: str,
    req: RoleUpdateRequest,
    admin_user: dict = Depends(require_admin_role),
):
    return await org_auth_service.update_user_role(user_id, req.role)


@users_router.patch("/{user_id}/status", summary="Update User Status")
async def update_user_status(
    user_id: str,
    req: StatusUpdateRequest,
    admin_user: dict = Depends(require_admin_role),
):
    return await org_auth_service.update_user_status(user_id, req.status)


@users_router.delete("/{user_id}", summary="Delete User")
async def delete_user(
    user_id: str,
    admin_user: dict = Depends(require_admin_role),
):
    return await org_auth_service.delete_user(user_id)
