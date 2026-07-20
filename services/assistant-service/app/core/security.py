from typing import Optional, List
from pydantic import BaseModel
from fastapi import Depends, HTTPException, status, Header
from jose import jwt, JWTError
from app.core.config import settings
from app.core.logging import logger

class UserIdentity(BaseModel):
    user_id: str
    email: str
    full_name: str
    organization: str = "Athleia.ai"
    role: str = "EMPLOYEE"
    permissions: List[str] = []

def get_role_default_permissions(role: str) -> List[str]:
    base_employee = [
        "knowledge.read",
        "reasoning.read",
        "documents.read",
        "maintenance.read",
        "compliance.read",
        "notifications.read",
        "external_search.execute",
        "utilities.execute",
    ]
    if role == "EMPLOYEE":
        return base_employee
    
    manager_permissions = base_employee + [
        "reports.read",
        "team_analytics.read",
    ]
    if role == "MANAGER":
        return manager_permissions
        
    admin_permissions = manager_permissions + [
        "documents.upload",
        "documents.delete",
        "compliance.run",
        "maintenance.run",
        "users.manage",
        "roles.assign",
        "organization.configure",
        "metrics.read",
    ]
    return admin_permissions

def parse_user_token(authorization: Optional[str] = Header(None)) -> UserIdentity:
    """
    Parses and verifies Bearer JWT token from Gateway or direct requests.
    Falls back to mock identity in development mode if token is missing.
    """
    if not authorization or not authorization.startswith("Bearer "):
        if settings.ENVIRONMENT == "development":
            # Dev mock fallback
            return UserIdentity(
                user_id="usr_superadmin_001",
                email="admin@athleia.ai",
                full_name="Athleia Super Admin",
                organization="Athleia.ai",
                role="SUPER_ADMIN",
                permissions=get_role_default_permissions("SUPER_ADMIN")
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Bearer authorization header"
        )

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub") or payload.get("user_id")
        email = payload.get("email", "")
        full_name = payload.get("full_name", "Athleia User")
        role = payload.get("role", "EMPLOYEE")
        permissions = payload.get("permissions", get_role_default_permissions(role))

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token claims: missing sub")

        return UserIdentity(
            user_id=user_id,
            email=email,
            full_name=full_name,
            organization=payload.get("organization", "Athleia.ai"),
            role=role,
            permissions=permissions
        )
    except JWTError as e:
        logger.warning(f"JWT Verification Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token signature or expired token")

def require_permission(required_perm: str):
    def check_perm(user: UserIdentity = Depends(parse_user_token)):
        if required_perm not in user.permissions and user.role != "SUPER_ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: Missing required permission '{required_perm}'"
            )
        return user
    return check_perm
