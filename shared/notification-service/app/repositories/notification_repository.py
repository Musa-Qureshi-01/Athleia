from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import String, Boolean, JSON, DateTime, Text, select, update, delete, func
from datetime import datetime
from app.core.config import settings
from app.domain.models import Notification

Base = declarative_base()

class DBNotification(Base):
    __tablename__ = "notifications"

    notification_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text)
    type: Mapped[str] = mapped_column(String(32), index=True)
    priority: Mapped[str] = mapped_column(String(32), index=True)
    source_service: Mapped[str] = mapped_column(String(64), index=True)
    recipient: Mapped[str] = mapped_column(String(64), index=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    created_at: Mapped[str] = mapped_column(String(64), index=True)
    read_at: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    correlation_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)

class NotificationRepository:
    def __init__(self, db_url: str = None):
        self.db_url = db_url or settings.DATABASE_URL
        self.engine = create_async_engine(self.db_url, echo=False)
        self.async_session = async_sessionmaker(self.engine, expire_on_commit=False)

    async def init_db(self):
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def save_notification(self, notification: Notification) -> Notification:
        async with self.async_session() as session:
            async with session.begin():
                db_item = DBNotification(
                    notification_id=notification.notification_id,
                    title=notification.title,
                    message=notification.message,
                    type=notification.type.value,
                    priority=notification.priority.value,
                    source_service=notification.source_service,
                    recipient=notification.recipient,
                    is_read=notification.is_read,
                    created_at=notification.created_at,
                    read_at=notification.read_at,
                    correlation_id=notification.correlation_id,
                    metadata_json=notification.metadata,
                )
                session.add(db_item)
            return notification

    async def get_notifications(
        self, recipient: str = None, limit: int = 50, is_read: bool = None
    ) -> List[Dict[str, Any]]:
        async with self.async_session() as session:
            stmt = select(DBNotification)
            if recipient and recipient != "all":
                from sqlalchemy import or_
                stmt = stmt.where(or_(DBNotification.recipient == recipient, DBNotification.recipient == "all"))
            if is_read is not None:
                stmt = stmt.where(DBNotification.is_read == is_read)
            stmt = stmt.order_by(DBNotification.created_at.desc()).limit(limit)

            res = await session.execute(stmt)
            rows = res.scalars().all()
            return [
                {
                    "notification_id": r.notification_id,
                    "title": r.title,
                    "message": r.message,
                    "type": r.type,
                    "priority": r.priority,
                    "source_service": r.source_service,
                    "recipient": r.recipient,
                    "is_read": r.is_read,
                    "created_at": r.created_at,
                    "read_at": r.read_at,
                    "correlation_id": r.correlation_id,
                    "metadata": r.metadata_json,
                }
                for r in rows
            ]

    async def get_notification_by_id(self, notification_id: str) -> Optional[Dict[str, Any]]:
        async with self.async_session() as session:
            stmt = select(DBNotification).where(DBNotification.notification_id == notification_id)
            res = await session.execute(stmt)
            r = res.scalar_one_or_none()
            if not r:
                return None
            return {
                "notification_id": r.notification_id,
                "title": r.title,
                "message": r.message,
                "type": r.type,
                "priority": r.priority,
                "source_service": r.source_service,
                "recipient": r.recipient,
                "is_read": r.is_read,
                "created_at": r.created_at,
                "read_at": r.read_at,
                "correlation_id": r.correlation_id,
                "metadata": r.metadata_json,
            }

    async def mark_as_read(self, notification_id: str) -> bool:
        async with self.async_session() as session:
            async with session.begin():
                now_str = datetime.utcnow().isoformat()
                stmt = (
                    update(DBNotification)
                    .where(DBNotification.notification_id == notification_id)
                    .values(is_read=True, read_at=now_str)
                )
                res = await session.execute(stmt)
                return res.rowcount > 0

    async def mark_all_as_read(self, recipient: str = "all") -> int:
        async with self.async_session() as session:
            async with session.begin():
                now_str = datetime.utcnow().isoformat()
                stmt = update(DBNotification).where(DBNotification.is_read == False)
                if recipient and recipient != "all":
                    stmt = stmt.where(DBNotification.recipient == recipient)
                stmt = stmt.values(is_read=True, read_at=now_str)
                res = await session.execute(stmt)
                return res.rowcount

    async def get_unread_count(self, recipient: str = "all") -> int:
        async with self.async_session() as session:
            stmt = select(func.count(DBNotification.notification_id)).where(DBNotification.is_read == False)
            if recipient and recipient != "all":
                from sqlalchemy import or_
                stmt = stmt.where(or_(DBNotification.recipient == recipient, DBNotification.recipient == "all"))
            res = await session.execute(stmt)
            return res.scalar() or 0

    async def delete_notification(self, notification_id: str) -> bool:
        async with self.async_session() as session:
            async with session.begin():
                stmt = delete(DBNotification).where(DBNotification.notification_id == notification_id)
                res = await session.execute(stmt)
                return res.rowcount > 0

    async def clear_all_notifications(self) -> int:
        """Hard-delete every notification row. Used by the admin clear-all action."""
        async with self.async_session() as session:
            async with session.begin():
                stmt = delete(DBNotification)
                res = await session.execute(stmt)
                return res.rowcount

repository = NotificationRepository()
