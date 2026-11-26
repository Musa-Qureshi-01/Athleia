import logging
import asyncio
from typing import Optional, AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import String, Boolean, Integer, select
from shared.auth.config import settings

logger = logging.getLogger("auth.db")

Base = declarative_base()


# ── TABLE 1: ORGANIZATIONAL USERS (Corporate Enterprise Accounts) ─────────────
class DBOrganizationalUser(Base):
    __tablename__ = "organizational_users"

    user_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(255))
    organization: Mapped[str] = mapped_column(String(255), default="Axios Enterprise")
    role: Mapped[str] = mapped_column(String(32), default="EMPLOYEE", index=True)
    status: Mapped[str] = mapped_column(String(32), default="ACTIVE", index=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True)
    failed_login_attempts: Mapped[int] = mapped_column(Integer, default=0)
    locked_until: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    created_at: Mapped[str] = mapped_column(String(64), index=True)
    last_login_at: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)


# ── TABLE 2: EVOLUTION / EVALUATION ACCOUNTS (Dedicated Isolated Demo Sessions) ────────────
class DBEvolutionAccount(Base):
    """Completely separate table exclusively for Evolution / Evaluation demo accounts.
    Allows prospective clients to explore Axios safely without polluting or touching
    the enterprise organizational user registry.
    """
    __tablename__ = "evolution_accounts"

    session_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    demo_email: Mapped[str] = mapped_column(String(255), index=True)
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    phone_number: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    demo_organization: Mapped[str] = mapped_column(String(255), default="Evolution Demo Sandbox")
    evaluation_purpose: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    role: Mapped[str] = mapped_column(String(32), default="EVOLUTION_GUEST")
    queries_used: Mapped[int] = mapped_column(Integer, default=0)
    queries_limit: Mapped[int] = mapped_column(Integer, default=50)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[str] = mapped_column(String(64))
    expires_at: Mapped[str] = mapped_column(String(64))


# ── TABLE 3: VERIFICATION OTPS ────────────────────────────────────────────────
class DBVerificationOTP(Base):
    __tablename__ = "verification_otps"

    otp_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True)
    email: Mapped[str] = mapped_column(String(255), index=True)
    hashed_otp: Mapped[str] = mapped_column(String(255))
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    expires_at: Mapped[str] = mapped_column(String(64), index=True)


# ── TABLE 4: DEMO REQUESTS (Isolated Public Form Inquiries) ────────────────────
# STRICT ARCHITECTURAL ISOLATION: Not foreign-keyed or tied to core auth or runtime services
class DBDemoRequest(Base):
    __tablename__ = "demo_requests"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    first_name: Mapped[str] = mapped_column(String(128))
    last_name: Mapped[str] = mapped_column(String(128))
    email: Mapped[str] = mapped_column(String(255), index=True)
    company: Mapped[str] = mapped_column(String(255))
    company_size: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    country: Mapped[Optional[str]] = mapped_column(String(128), default="United States")
    sparked_interest: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="NEW")
    created_at: Mapped[str] = mapped_column(String(64), index=True)


# ── TABLE 5: CAREER APPLICATIONS (Isolated Public Form Submissions) ───────────
# STRICT ARCHITECTURAL ISOLATION: Not foreign-keyed or tied to core auth or runtime services
class DBCareerApplication(Base):
    __tablename__ = "career_applications"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), index=True)
    phone: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    linkedin: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    department: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    portfolio: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    desired_role: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    cv_file_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    message: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="PENDING_REVIEW")
    created_at: Mapped[str] = mapped_column(String(64), index=True)


# ── TABLE 6: CONTACT INQUIRIES (Isolated Public Form Submissions) ─────────────
# STRICT ARCHITECTURAL ISOLATION: Not foreign-keyed or tied to core auth or runtime services
class DBContactInquiry(Base):
    __tablename__ = "contact_inquiries"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), index=True)
    company: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    company_size: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    message: Mapped[str] = mapped_column(String(2000))
    status: Mapped[str] = mapped_column(String(32), default="NEW")
    created_at: Mapped[str] = mapped_column(String(64), index=True)


# Database Engine setup
def get_db_url() -> str:
    url = settings.DATABASE_URL
    if not url or "neon" in url:
        # Guarantee 100% clean local SQLite if not configured or legacy neon string
        return "sqlite+aiosqlite:///./axios_auth.db"
    return url


db_url = get_db_url()
is_sqlite = "sqlite" in db_url

if is_sqlite:
    engine = create_async_engine(db_url, connect_args={"check_same_thread": False})
else:
    engine = create_async_engine(db_url, pool_size=5, max_overflow=10, pool_pre_ping=True)

async_session_factory = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        yield session


async def init_auth_db():
    """Initializes all auth tables cleanly on startup."""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Axios Dual Auth Database schema initialized (organizational_users & evolution_accounts).")
    except Exception as e:
        logger.error(f"Database schema initialization failed: {e}")
        raise e
