from typing import Optional, Callable
from fastapi import Header, HTTPException, Depends, status

from shared.auth.organizational.service import org_auth_service
from shared.auth.organizational.rbac.roles import SystemRole
from shared.auth.organizational.rbac.enforcer import enforce_permission


async def get_current_org_user(authorization: Optional[str] = Header(None)) -> dict:
    """Dependency ensuring request is authenticated by a valid Organisational identity.
    Strictly denies access to Evolution demo tokens or untrusted issuers.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header. Expected Bearer <token>.",
        )

    token = authorization.split(" ")[1]
    payload = org_auth_service.verify_token(token)

    # Double-check isolation claims
    if payload.get("scope") != "organizational" or payload.get("iss") != "axios-organizational":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Request does not possess an authorized organizational security context.",
        )

    return payload


def require_permission(permission: str) -> Callable:
    """Dependency factory checking that the authenticated organizational user has the required permission."""
    async def _permission_dependency(user: dict = Depends(get_current_org_user)) -> dict:
        user_role = user.get("role", "")
        enforce_permission(user_role, permission)
        return user

    return _permission_dependency


async def require_admin_role(user: dict = Depends(get_current_org_user)) -> dict:
    """Dependency requiring ADMIN or SUPER_ADMIN role."""
    role = user.get("role", "")
    if role not in [SystemRole.ADMIN.value, SystemRole.SUPER_ADMIN.value]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Administrative privileges required.",
        )
    return user
