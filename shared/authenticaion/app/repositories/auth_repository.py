import uuid
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import String, Boolean, Integer, Text, JSON, DateTime, select, update, delete
from app.core.config import settings
from app.core.security import hash_password, hash_otp
from app.domain.enums import UserRole, UserStatus
from app.domain.models import UserProfile

Base = declarative_base()

class DBUser(Base):
    __tablename__ = "users"

    user_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(255))
    organization: Mapped[str] = mapped_column(String(255), default="Athleia.ai")
    role: Mapped[str] = mapped_column(String(32), default=UserRole.EMPLOYEE.value, index=True)
    status: Mapped[str] = mapped_column(String(32), default=UserStatus.PENDING_VERIFICATION.value, index=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    failed_login_attempts: Mapped[int] = mapped_column(Integer, default=0)
    locked_until: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    created_at: Mapped[str] = mapped_column(String(64), index=True)
    last_login_at: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

class DBVerificationOTP(Base):
    __tablename__ = "verification_otps"

    otp_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True)
    email: Mapped[str] = mapped_column(String(255), index=True)
    hashed_otp: Mapped[str] = mapped_column(String(255))
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    expires_at: Mapped[str] = mapped_column(String(64), index=True)

class DBRefreshToken(Base):
    __tablename__ = "refresh_tokens"

    token_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True)
    token_hash: Mapped[str] = mapped_column(String(255), unique=True)
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False)
    expires_at: Mapped[str] = mapped_column(String(64))

class DBAuditLog(Base):
    __tablename__ = "audit_logs"

    log_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True)
    action: Mapped[str] = mapped_column(String(128), index=True)
    details: Mapped[str] = mapped_column(Text)
    timestamp: Mapped[str] = mapped_column(String(64), index=True)

class AuthRepository:
    def __init__(self, db_url: str = None):
        self.db_url = db_url or settings.DATABASE_URL
        self.engine = create_async_engine(
            self.db_url,
            echo=False,
            pool_pre_ping=True,
            pool_recycle=300,
        )
        self.async_session = async_sessionmaker(self.engine, expire_on_commit=False)

    async def init_db(self):
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        # Bootstrap Super Admin user if not exists
        await self._seed_superadmin()

    async def _seed_superadmin(self):
        async with self.async_session() as session:
            stmt = select(DBUser).where(DBUser.email == settings.SUPERADMIN_EMAIL)
            res = await session.execute(stmt)
            admin = res.scalar_one_or_none()
            if not admin:
                now_str = datetime.utcnow().isoformat()
                admin = DBUser(
                    user_id="usr_superadmin",
                    email=settings.SUPERADMIN_EMAIL,
                    hashed_password=hash_password(settings.SUPERADMIN_PASSWORD),
                    full_name="Athleia Super Admin",
                    organization="Athleia Core",
                    role=UserRole.SUPER_ADMIN.value,
                    status=UserStatus.ACTIVE.value,
                    is_verified=True,
                    created_at=now_str,
                )
                session.add(admin)
                await session.commit()

    async def create_user(
        self, email: str, hashed_pw: str, full_name: str, organization: str = "Athleia Energy"
    ) -> DBUser:
        async with self.async_session() as session:
            async with session.begin():
                user_id = f"usr_{uuid.uuid4().hex[:10]}"
                now_str = datetime.utcnow().isoformat()
                db_user = DBUser(
                    user_id=user_id,
                    email=email,
                    hashed_password=hashed_pw,
                    full_name=full_name,
                    organization=organization,
                    role=UserRole.EMPLOYEE.value,
                    status=UserStatus.PENDING_VERIFICATION.value,
                    is_verified=False,
                    created_at=now_str,
                )
                session.add(db_user)
            return db_user

    async def get_user_by_email(self, email: str) -> Optional[DBUser]:
        async with self.async_session() as session:
            stmt = select(DBUser).where(DBUser.email == email)
            res = await session.execute(stmt)
            return res.scalar_one_or_none()

    async def get_user_by_id(self, user_id: str) -> Optional[DBUser]:
        async with self.async_session() as session:
            stmt = select(DBUser).where(DBUser.user_id == user_id)
            res = await session.execute(stmt)
            return res.scalar_one_or_none()

    async def list_users(self, status: Optional[str] = None) -> List[DBUser]:
        async with self.async_session() as session:
            stmt = select(DBUser)
            if status:
                stmt = stmt.where(DBUser.status == status)
            res = await session.execute(stmt)
            return list(res.scalars().all())

    async def save_otp(self, user_id: str, email: str, raw_otp: str) -> str:
        async with self.async_session() as session:
            async with session.begin():
                # Delete existing OTPs for email
                await session.execute(delete(DBVerificationOTP).where(DBVerificationOTP.email == email))
                
                otp_id = f"otp_{uuid.uuid4().hex[:8]}"
                expires_at = (datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)).isoformat()
                db_otp = DBVerificationOTP(
                    otp_id=otp_id,
                    user_id=user_id,
                    email=email,
                    hashed_otp=hash_otp(raw_otp),
                    expires_at=expires_at,
                )
                session.add(db_otp)
            return otp_id

    async def verify_otp(self, email: str, raw_otp: str) -> bool:
        async with self.async_session() as session:
            stmt = select(DBVerificationOTP).where(DBVerificationOTP.email == email)
            res = await session.execute(stmt)
            otp_record = res.scalar_one_or_none()
            if not otp_record:
                return False

            now_str = datetime.utcnow().isoformat()
            if otp_record.expires_at < now_str:
                return False

            if otp_record.hashed_otp == hash_otp(raw_otp):
                # Mark user verified & active — use direct execute + commit (session auto-begins)
                await session.execute(
                    update(DBUser)
                    .where(DBUser.email == email)
                    .values(is_verified=True, status=UserStatus.ACTIVE.value)
                )
                await session.execute(
                    delete(DBVerificationOTP).where(DBVerificationOTP.email == email)
                )
                await session.commit()
                return True
            else:
                # Increment failed OTP attempts
                otp_record.attempts += 1
                await session.commit()
                return False

    async def record_login_attempt(self, user_id: str, success: bool):
        async with self.async_session() as session:
            async with session.begin():
                stmt = select(DBUser).where(DBUser.user_id == user_id)
                res = await session.execute(stmt)
                user = res.scalar_one_or_none()
                if not user:
                    return

                if success:
                    user.failed_login_attempts = 0
                    user.locked_until = None
                    user.last_login_at = datetime.utcnow().isoformat()
                else:
                    user.failed_login_attempts += 1
                    if user.failed_login_attempts >= settings.MAX_FAILED_LOGIN_ATTEMPTS:
                        user.status = UserStatus.LOCKED.value
                        user.locked_until = (
                            datetime.utcnow() + timedelta(minutes=settings.LOCKOUT_DURATION_MINUTES)
                        ).isoformat()

    async def update_user_role(self, user_id: str, new_role: UserRole) -> bool:
        async with self.async_session() as session:
            async with session.begin():
                stmt = update(DBUser).where(DBUser.user_id == user_id).values(role=new_role.value)
                res = await session.execute(stmt)
                return res.rowcount > 0

    async def update_user_status(self, user_id: str, new_status: UserStatus) -> bool:
        async with self.async_session() as session:
            async with session.begin():
                stmt = update(DBUser).where(DBUser.user_id == user_id).values(status=new_status.value)
                res = await session.execute(stmt)
                return res.rowcount > 0

    async def delete_user(self, user_id: str) -> bool:
        async with self.async_session() as session:
            async with session.begin():
                stmt = delete(DBUser).where(DBUser.user_id == user_id)
                res = await session.execute(stmt)
                return res.rowcount > 0

    async def save_audit_log(self, user_id: str, action: str, details: str):
        async with self.async_session() as session:
            async with session.begin():
                log_item = DBAuditLog(
                    log_id=f"log_{uuid.uuid4().hex[:8]}",
                    user_id=user_id,
                    action=action,
                    details=details,
                    timestamp=datetime.utcnow().isoformat(),
                )
                session.add(log_item)

repository = AuthRepository()
