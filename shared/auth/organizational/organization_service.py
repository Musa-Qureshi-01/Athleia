import logging
from typing import Dict, Any, List, Optional, Union
from fastapi import HTTPException, status
from sqlalchemy import select, Select

from shared.auth.config import settings
from shared.auth.db import DBOrganizationalUser, async_session_factory
from shared.auth.organizational.rbac.roles import SystemRole, ROLE_HIERARCHY
from shared.auth.organizational.rbac.permissions import (
    Permission,
    ROLE_PERMISSION_MAP,
)
from shared.auth.organizational.rbac.enforcer import (
    has_permission,
    enforce_permission,
    get_role_permissions,
)

logger = logging.getLogger("auth.organizational.organization_service")


class OrganizationService:
    """Enterprise Organizational Service.
    Enforces multi-tenant organizational boundaries, real RBAC role authorization,
    and Row-Level Security (RLS) data partitioning without mock bypasses.
    """

    def __init__(self):
        self._hierarchy = ROLE_HIERARCHY
        self._permission_map = ROLE_PERMISSION_MAP

    # ── 1. TENANT MANAGEMENT & BOUNDARY VALIDATION ────────────────────────────

    def extract_tenant_from_email(self, email: str) -> str:
        """Derive default enterprise organization identifier from corporate domain."""
        parts = email.lower().strip().split("@")
        if len(parts) == 2:
            domain = parts[1]
            # Normalise domain into clean corporate tenant id
            return domain.replace(".", "_")
        return "axios_enterprise"

    def enforce_tenant_boundary(
        self,
        user_context: Dict[str, Any],
        target_organization: str,
        allow_super_admin: bool = True,
    ) -> None:
        """Enforces that an active request cannot access or mutate resources
        belonging to another tenant organization. Zero bypass allowed.
        """
        user_org = user_context.get("organization", "").strip().lower()
        target_org = target_organization.strip().lower()
        user_role = user_context.get("role", "")

        # Super Admin platform auditors may inspect across tenants if allowed
        if allow_super_admin and user_role == SystemRole.SUPER_ADMIN.value:
            return

        if not user_org or user_org != target_org:
            logger.warning(
                f"RLS Boundary Breach Prevented: User {user_context.get('email')} (Org: '{user_org}') "
                f"attempted to access target Org: '{target_org}'."
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Forbidden: Cross-tenant data access is strictly prohibited by Axios RLS policy.",
            )

    # ── 2. ROLE-BASED ACCESS CONTROL (RBAC) ──────────────────────────────────

    def check_permission(self, role: Union[SystemRole, str], required_permission: str) -> bool:
        """Evaluates whether the role possesses the required permission."""
        return has_permission(role, required_permission)

    def authorize(
        self,
        user_context: Dict[str, Any],
        required_permission: str,
    ) -> None:
        """Authorizes user action against granular RBAC rules.
        Raises HTTP 403 Forbidden on failure.
        """
        role = user_context.get("role", "")
        if not role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication context is missing role claims.",
            )

        if not has_permission(role, required_permission):
            logger.warning(
                f"RBAC Rejection: User {user_context.get('email')} with role '{role}' "
                f"attempted action requiring '{required_permission}'."
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Role '{role}' lacks required permission '{required_permission}'.",
            )

    def can_assign_role(self, actor_role: str, target_role: str) -> bool:
        """Ensures an administrator cannot grant a role higher than or equal to their own tier."""
        try:
            actor_enum = SystemRole(actor_role)
            target_enum = SystemRole(target_role)
            actor_weight = self._hierarchy.get(actor_enum, 0)
            target_weight = self._hierarchy.get(target_enum, 0)
            return actor_weight > target_weight
        except ValueError:
            return False

    def get_effective_permissions(self, role: Union[SystemRole, str]) -> List[str]:
        """Returns the full permission list for the given role."""
        return get_role_permissions(role)

    # ── 3. ROW-LEVEL SECURITY (RLS) QUERY ENFORCEMENT ────────────────────────

    def apply_rls_filter(
        self,
        stmt: Select,
        user_context: Dict[str, Any],
        tenant_column: Any,
    ) -> Select:
        """Applies Row-Level Security (RLS) scoping to any SQLAlchemy query.
        Guarantees that results are isolated strictly to the user's organization,
        preventing any cross-tenant data leakage.
        """
        user_role = user_context.get("role", "")
        user_org = user_context.get("organization", "").strip()

        # SUPER_ADMIN may query across organizations
        if user_role == SystemRole.SUPER_ADMIN.value:
            return stmt

        if not user_org:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Security Context Error: Missing organization claim for RLS enforcement.",
            )

        return stmt.where(tenant_column == user_org)

    def validate_record_rls(
        self,
        user_context: Dict[str, Any],
        record_tenant_id: str,
    ) -> None:
        """Validates that a single fetched entity conforms to tenant RLS boundaries."""
        self.enforce_tenant_boundary(user_context, record_tenant_id)

    # ── 4. ORGANIZATION MEMBERSHIP & ROSTER QUERIES ──────────────────────────

    async def list_organization_members(
        self,
        user_context: Dict[str, Any],
        target_organization: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Lists active organizational users within the caller's tenant boundary."""
        org_to_query = target_organization or user_context.get("organization", "")
        self.enforce_tenant_boundary(user_context, org_to_query)

        async with async_session_factory() as session:
            stmt = select(DBOrganizationalUser).where(
                DBOrganizationalUser.organization == org_to_query
            )
            result = await session.execute(stmt)
            users = result.scalars().all()

            return [
                {
                    "user_id": u.user_id,
                    "email": u.email,
                    "full_name": u.full_name,
                    "organization": u.organization,
                    "role": u.role,
                    "status": u.status,
                    "created_at": u.created_at,
                    "last_login_at": u.last_login_at,
                }
                for u in users
            ]


# Singleton instance
organization_service = OrganizationService()
