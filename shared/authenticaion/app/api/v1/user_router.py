from fastapi import APIRouter, HTTPException, Header, Depends, Query
from typing import Optional, List
from app.domain.models import RoleUpdateRequest, StatusUpdateRequest, UserProfile
from app.domain.enums import UserRole, UserStatus
from app.repositories.auth_repository import repository
from app.core.security import decode_token
from app.api.v1.auth_router import get_role_permissions

user_router = APIRouter(prefix="/api/v1/users", tags=["User & Identity Administration"])

async def require_admin_role(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization header")

    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid access token")

    role = payload.get("role")
    if role not in [UserRole.SUPER_ADMIN.value, UserRole.ADMIN.value]:
        raise HTTPException(status_code=403, detail="Forbidden: Requires Admin or Super Admin role")

    return payload

@user_router.get("", summary="List All Users")
async def list_users(
    status_filter: Optional[str] = Query(None),
    admin_data: dict = Depends(require_admin_role)
):
    db_users = await repository.list_users(status=status_filter)
    result = []
    for u in db_users:
        r_enum = UserRole(u.role)
        result.append(
            UserProfile(
                user_id=u.user_id,
                email=u.email,
                full_name=u.full_name,
                organization=u.organization,
                role=r_enum,
                status=UserStatus(u.status),
                is_verified=u.is_verified,
                created_at=u.created_at,
                last_login_at=u.last_login_at,
                permissions=get_role_permissions(r_enum),
            )
        )
    return {"count": len(result), "users": result}

@user_router.get("/pending", summary="List Pending Verification Users")
async def list_pending_users(admin_data: dict = Depends(require_admin_role)):
    db_users = await repository.list_users(status=UserStatus.PENDING_VERIFICATION.value)
    return {"count": len(db_users), "pending_users": [u.email for u in db_users]}

@user_router.patch("/{user_id}/role", summary="Update User Role")
async def update_role(
    user_id: str,
    req: RoleUpdateRequest,
    admin_data: dict = Depends(require_admin_role)
):
    success = await repository.update_user_role(user_id, req.role)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    await repository.save_audit_log(admin_data.get("sub"), "ROLE_UPDATED", f"Updated user {user_id} role to {req.role}")
    return {"status": "success", "user_id": user_id, "new_role": req.role}

@user_router.patch("/{user_id}/status", summary="Update User Status")
async def update_status(
    user_id: str,
    req: StatusUpdateRequest,
    admin_data: dict = Depends(require_admin_role)
):
    success = await repository.update_user_status(user_id, req.status)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    await repository.save_audit_log(admin_data.get("sub"), "STATUS_UPDATED", f"Updated user {user_id} status to {req.status}")
    return {"status": "success", "user_id": user_id, "new_status": req.status}

@user_router.delete("/{user_id}", summary="Delete User Account")
async def delete_user(
    user_id: str,
    admin_data: dict = Depends(require_admin_role)
):
    success = await repository.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    await repository.save_audit_log(admin_data.get("sub"), "USER_DELETED", f"Deleted user {user_id}")
    return {"status": "success", "deleted_user_id": user_id}
