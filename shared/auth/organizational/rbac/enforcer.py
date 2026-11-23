from typing import List, Union
from fastapi import HTTPException, status
from shared.auth.organizational.rbac.roles import SystemRole
from shared.auth.organizational.rbac.permissions import ROLE_PERMISSION_MAP


def get_role_permissions(role: Union[SystemRole, str]) -> List[str]:
    """Retrieve all permission keys mapped to a given role."""
    try:
        if isinstance(role, str):
            role_enum = SystemRole(role)
        else:
            role_enum = role
    except ValueError:
        return []

    return sorted(list(ROLE_PERMISSION_MAP.get(role_enum, set())))


def has_permission(role: Union[SystemRole, str], required_permission: str) -> bool:
    """Check if the given role possesses the required permission."""
    permissions = get_role_permissions(role)
    return required_permission in permissions


def enforce_permission(role: Union[SystemRole, str], required_permission: str) -> None:
    """Enforce permission, raising 403 Forbidden if not authorized."""
    if not has_permission(role, required_permission):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: Role '{role}' lacks required permission '{required_permission}'.",
        )
