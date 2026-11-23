import uuid
import secrets
import hashlib
import logging
import asyncio
from datetime import datetime, timedelta, timezone
from typing import Optional, List, Dict, Any

import jwt
import bcrypt
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import String, Boolean, Integer, Text, select, update, delete
from fastapi import HTTPException, status

from shared.auth.config import settings
from shared.auth.db import (
    DBOrganizationalUser,
    DBVerificationOTP,
    async_session_factory,
    engine,
    init_auth_db,
)
from shared.auth.models import (
    UserRole,
    UserStatus,
    TokenResponse,
    UserProfile,
    UserRegisterRequest,
)
from shared.auth.organizational.client import get_organizational_workos_client
from shared.auth.organizational.rbac.enforcer import get_role_permissions

logger = logging.getLogger("auth.organizational.service")

# Alias DBUser to DBOrganizationalUser for clean organizational table encapsulation
DBUser = DBOrganizationalUser


def hash_password(password: str) -> str:
    pw_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pw_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        pw_bytes = plain_password.encode("utf-8")[:72]
        hash_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(pw_bytes, hash_bytes)
    except Exception:
        return False


def hash_otp(otp: str) -> str:
    return hashlib.sha256(otp.encode("utf-8")).hexdigest()


class OrganizationalAuthService:
    def __init__(self):
        self.engine = engine
        self.async_session = async_session_factory

    async def init_db(self):
        await init_auth_db()

    # ── JWT Handling ─────────────────────────────────────────────────────────

    def create_access_token(self, user_id: str, email: str, role: str, full_name: str, org: str) -> str:
        now = datetime.now(timezone.utc)
        expires = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        payload = {
            "sub": user_id,
            "email": email,
            "role": role,
            "full_name": full_name,
            "organization": org,
            "scope": "organizational",
            "iss": "axios-organizational",
            "iat": int(now.timestamp()),
            "exp": int(expires.timestamp()),
            "type": "access",
        }
        return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    def create_refresh_token(self, user_id: str) -> str:
        now = datetime.now(timezone.utc)
        expires = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        payload = {
            "sub": user_id,
            "scope": "organizational",
            "iss": "axios-organizational",
            "iat": int(now.timestamp()),
            "exp": int(expires.timestamp()),
            "type": "refresh",
            "jti": secrets.token_hex(16),
        }
        return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    def verify_token(self, token: str) -> Dict[str, Any]:
        """Strictly verify organizational token.
        Rejects tampered, expired, or foreign (e.g. Evolution demo) tokens.
        """
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
                options={"verify_exp": True, "verify_iss": True},
                issuer="axios-organizational",
            )
            # Security Claim: Must be organizational scope
            if payload.get("scope") != "organizational":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid token scope: Access forbidden for non-organizational identity.",
                )
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication token expired. Please sign in again.",
            )
        except (jwt.InvalidTokenError, HTTPException) as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or tampered authentication token.",
            )

    # ── User Operations ──────────────────────────────────────────────────────

    async def get_user_by_email(self, email: str) -> Optional[DBUser]:
        async with self.async_session() as session:
            stmt = select(DBUser).where(DBUser.email == email.lower().strip())
            result = await session.execute(stmt)
            return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: str) -> Optional[DBUser]:
        async with self.async_session() as session:
            stmt = select(DBUser).where(DBUser.user_id == user_id)
            result = await session.execute(stmt)
            return result.scalar_one_or_none()

    async def authenticate_user(self, email: str, password: str) -> TokenResponse:
        email_clean = email.lower().strip()
        workos_client = get_organizational_workos_client()

        # Step 1: Attempt WorkOS password authentication if user registered with WorkOS
        workos_authenticated = False
        workos_user_data = None
        try:
            workos_res = workos_client.user_management.authenticate_with_password(
                email=email_clean,
                password=password,
                client_id=settings.WORKOS_ORGANIZATIONAL_CLIENT_ID,
            )
            if workos_res and getattr(workos_res, "user", None):
                workos_authenticated = True
                workos_user_data = workos_res.user
        except Exception as e:
            logger.debug(f"WorkOS password auth check: {e}")

        # Step 2: Validate against local organizational DB records
        user = await self.get_user_by_email(email_clean)

        if not workos_authenticated:
            if not user or not verify_password(password, user.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials. Please verify your email and password.",
                )

        if not user:
            # First-time login from WorkOS: bootstrap organizational DB record
            user_id = str(uuid.uuid4())
            full_name = "Enterprise User"
            if workos_user_data:
                full_name = f"{getattr(workos_user_data, 'first_name', '')} {getattr(workos_user_data, 'last_name', '')}".strip() or email_clean
            user = DBUser(
                user_id=user_id,
                email=email_clean,
                hashed_password=hash_password(password),
                full_name=full_name,
                organization="Axios Enterprise",
                role=UserRole.EMPLOYEE.value,
                status=UserStatus.ACTIVE.value,
                is_verified=True,
                created_at=datetime.now(timezone.utc).isoformat(),
                last_login_at=datetime.now(timezone.utc).isoformat(),
            )
            async with self.async_session() as session:
                async with session.begin():
                    session.add(user)
        else:
            # Update last login
            async with self.async_session() as session:
                async with session.begin():
                    await session.execute(
                        update(DBUser)
                        .where(DBUser.user_id == user.user_id)
                        .values(last_login_at=datetime.now(timezone.utc).isoformat())
                    )

        role = UserRole(user.role)
        status_enum = UserStatus(user.status)

        if status_enum in [UserStatus.LOCKED, UserStatus.DISABLED]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Account is {status_enum.value.lower()}. Please contact your organization administrator.",
            )

        access_token = self.create_access_token(
            user_id=user.user_id,
            email=user.email,
            role=role.value,
            full_name=user.full_name,
            org=user.organization,
        )
        refresh_token = self.create_refresh_token(user.user_id)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="Bearer",
            expires_in_seconds=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user_id=user.user_id,
            email=user.email,
            full_name=user.full_name,
            role=role,
            status=status_enum,
        )

    async def register_user(self, req: UserRegisterRequest) -> Dict[str, Any]:
        email_clean = req.email.lower().strip()
        existing = await self.get_user_by_email(email_clean)
        if existing and existing.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists and is active. Please sign in.",
            )

        # Sync user creation to WorkOS User Management
        workos_client = get_organizational_workos_client()
        names = req.full_name.split(" ", 1)
        first_name = names[0]
        last_name = names[1] if len(names) > 1 else ""
        try:
            workos_client.user_management.create_user(
                email=email_clean,
                password=req.password,
                first_name=first_name,
                last_name=last_name,
                email_verified=True,
            )
            logger.info(f"User {email_clean} created in WorkOS User Management.")
        except Exception as e:
            logger.info(f"WorkOS registration sync note: {e}")

        user_id = str(uuid.uuid4())
        hashed_pw = hash_password(req.password)
        now_str = datetime.now(timezone.utc).isoformat()

        async with self.async_session() as session:
            async with session.begin():
                if existing:
                    existing.hashed_password = hashed_pw
                    existing.full_name = req.full_name
                    existing.organization = req.organization or "Axios Enterprise"
                    existing.status = UserStatus.ACTIVE.value
                    existing.is_verified = True
                else:
                    new_user = DBUser(
                        user_id=user_id,
                        email=email_clean,
                        hashed_password=hashed_pw,
                        full_name=req.full_name,
                        organization=req.organization or "Axios Enterprise",
                        role=UserRole.EMPLOYEE.value,
                        status=UserStatus.ACTIVE.value,
                        is_verified=True,
                        created_at=now_str,
                    )
                    session.add(new_user)

        return {
            "message": "User registered successfully.",
            "email": email_clean,
            "status": "ACTIVE",
            "is_verified": True,
        }

    async def get_user_profile(self, user_id: str) -> UserProfile:
        user = await self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

        role_enum = UserRole(user.role)
        created_at_dt = datetime.fromisoformat(user.created_at) if user.created_at else datetime.now(timezone.utc)
        last_login_dt = datetime.fromisoformat(user.last_login_at) if user.last_login_at else None

        return UserProfile(
            user_id=user.user_id,
            email=user.email,
            full_name=user.full_name,
            organization=user.organization,
            role=role_enum,
            status=UserStatus(user.status),
            is_verified=user.is_verified,
            created_at=created_at_dt,
            last_login_at=last_login_dt,
            permissions=get_role_permissions(role_enum),
        )

    async def list_users(self, status_filter: Optional[str] = None) -> List[UserProfile]:
        async with self.async_session() as session:
            stmt = select(DBUser)
            if status_filter:
                stmt = stmt.where(DBUser.status == status_filter)
            result = await session.execute(stmt)
            users = result.scalars().all()

        profiles = []
        for u in users:
            r_enum = UserRole(u.role)
            c_at = datetime.fromisoformat(u.created_at) if u.created_at else datetime.now(timezone.utc)
            l_at = datetime.fromisoformat(u.last_login_at) if u.last_login_at else None
            profiles.append(
                UserProfile(
                    user_id=u.user_id,
                    email=u.email,
                    full_name=u.full_name,
                    organization=u.organization,
                    role=r_enum,
                    status=UserStatus(u.status),
                    is_verified=u.is_verified,
                    created_at=c_at,
                    last_login_at=l_at,
                    permissions=get_role_permissions(r_enum),
                )
            )
        return profiles

    async def update_user_role(self, user_id: str, new_role: UserRole) -> Dict[str, Any]:
        async with self.async_session() as session:
            async with session.begin():
                user = await session.get(DBUser, user_id)
                if not user:
                    raise HTTPException(status_code=404, detail="User not found.")
                user.role = new_role.value
        return {"user_id": user_id, "role": new_role.value, "updated": True}

    async def update_user_status(self, user_id: str, new_status: UserStatus) -> Dict[str, Any]:
        async with self.async_session() as session:
            async with session.begin():
                user = await session.get(DBUser, user_id)
                if not user:
                    raise HTTPException(status_code=404, detail="User not found.")
                user.status = new_status.value
        return {"user_id": user_id, "status": new_status.value, "updated": True}

    async def delete_user(self, user_id: str) -> Dict[str, Any]:
        async with self.async_session() as session:
            async with session.begin():
                user = await session.get(DBUser, user_id)
                if not user:
                    raise HTTPException(status_code=404, detail="User not found.")
                await session.delete(user)
        return {"user_id": user_id, "deleted": True}


org_auth_service = OrganizationalAuthService()
