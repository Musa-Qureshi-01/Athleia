import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Integer, Float, Text, JSON, DateTime, ForeignKey, select, update, delete
from app.core.config import settings

Base = declarative_base()

class DBConversation(Base):
    __tablename__ = "conversations"

    conversation_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True)
    title: Mapped[str] = mapped_column(String(255))
    is_pinned: Mapped[bool] = mapped_column(Boolean, default=False)
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[str] = mapped_column(String(64), index=True)
    updated_at: Mapped[str] = mapped_column(String(64), index=True)

class DBMessage(Base):
    __tablename__ = "messages"

    message_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    conversation_id: Mapped[str] = mapped_column(String(64), ForeignKey("conversations.conversation_id", ondelete="CASCADE"), index=True)
    role: Mapped[str] = mapped_column(String(32))  # 'user', 'assistant', 'system'
    content: Mapped[str] = mapped_column(Text)
    model_used: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    prompt_tokens: Mapped[int] = mapped_column(Integer, default=0)
    completion_tokens: Mapped[int] = mapped_column(Integer, default=0)
    total_cost: Mapped[float] = mapped_column(Float, default=0.0)
    latency_seconds: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[str] = mapped_column(String(64), index=True)

class DBMessageToolCall(Base):
    __tablename__ = "message_tool_calls"

    call_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    message_id: Mapped[str] = mapped_column(String(64), ForeignKey("messages.message_id", ondelete="CASCADE"), index=True)
    tool_name: Mapped[str] = mapped_column(String(64))
    input_params: Mapped[dict] = mapped_column(JSON, default=dict)
    output_summary: Mapped[str] = mapped_column(Text)
    success: Mapped[bool] = mapped_column(Boolean, default=True)
    latency_seconds: Mapped[float] = mapped_column(Float, default=0.0)

class DBMessageCitation(Base):
    __tablename__ = "message_citations"

    citation_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    message_id: Mapped[str] = mapped_column(String(64), ForeignKey("messages.message_id", ondelete="CASCADE"), index=True)
    source_title: Mapped[str] = mapped_column(String(255))
    source_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    snippet: Mapped[str] = mapped_column(Text)
    confidence_score: Mapped[float] = mapped_column(Float, default=1.0)

class DBMessageFeedback(Base):
    __tablename__ = "message_feedback"

    feedback_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    message_id: Mapped[str] = mapped_column(String(64), index=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True)
    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[str] = mapped_column(String(64))

class DBUserPreference(Base):
    __tablename__ = "user_preferences"

    user_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    preferred_language: Mapped[str] = mapped_column(String(10), default="en")
    preferred_model: Mapped[str] = mapped_column(String(64), default="auto")
    explanation_style: Mapped[str] = mapped_column(String(32), default="adaptive")
    preferred_units: Mapped[str] = mapped_column(String(32), default="metric")
    department: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    memory_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    updated_at: Mapped[str] = mapped_column(String(64))


class AssistantRepository:
    def __init__(self, db_url: str = None):
        self.db_url = db_url or settings.DATABASE_URL
        self.engine = create_async_engine(self.db_url, echo=False)
        self.async_session = async_sessionmaker(self.engine, expire_on_commit=False)

    async def init_db(self):
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    # ── Conversation CRUD ──────────────────────────────────────────

    async def create_conversation(self, user_id: str, title: str) -> Dict[str, Any]:
        cid = f"conv_{uuid.uuid4().hex[:12]}"
        now_str = datetime.utcnow().isoformat()
        async with self.async_session() as session:
            async with session.begin():
                conv = DBConversation(
                    conversation_id=cid,
                    user_id=user_id,
                    title=title,
                    is_pinned=False,
                    is_archived=False,
                    created_at=now_str,
                    updated_at=now_str
                )
                session.add(conv)
        return {
            "conversation_id": cid,
            "user_id": user_id,
            "title": title,
            "is_pinned": False,
            "is_archived": False,
            "created_at": now_str,
            "updated_at": now_str,
        }

    async def list_conversations(self, user_id: str, include_archived: bool = False) -> List[Dict[str, Any]]:
        async with self.async_session() as session:
            stmt = select(DBConversation).where(DBConversation.user_id == user_id)
            if not include_archived:
                stmt = stmt.where(DBConversation.is_archived == False)
            stmt = stmt.order_by(DBConversation.is_pinned.desc(), DBConversation.updated_at.desc())
            res = await session.execute(stmt)
            rows = res.scalars().all()
            return [
                {
                    "conversation_id": r.conversation_id,
                    "user_id": r.user_id,
                    "title": r.title,
                    "is_pinned": r.is_pinned,
                    "is_archived": r.is_archived,
                    "created_at": r.created_at,
                    "updated_at": r.updated_at,
                }
                for r in rows
            ]

    async def get_conversation(self, conversation_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        async with self.async_session() as session:
            stmt = select(DBConversation).where(
                DBConversation.conversation_id == conversation_id,
                DBConversation.user_id == user_id
            )
            res = await session.execute(stmt)
            conv = res.scalar_one_or_none()
            if not conv:
                return None

            msg_stmt = select(DBMessage).where(DBMessage.conversation_id == conversation_id).order_by(DBMessage.created_at.asc())
            msg_res = await session.execute(msg_stmt)
            messages = msg_res.scalars().all()

            return {
                "conversation_id": conv.conversation_id,
                "user_id": conv.user_id,
                "title": conv.title,
                "is_pinned": conv.is_pinned,
                "is_archived": conv.is_archived,
                "created_at": conv.created_at,
                "updated_at": conv.updated_at,
                "messages": [
                    {
                        "message_id": m.message_id,
                        "conversation_id": m.conversation_id,
                        "role": m.role,
                        "content": m.content,
                        "model_used": m.model_used,
                        "prompt_tokens": m.prompt_tokens,
                        "completion_tokens": m.completion_tokens,
                        "total_cost": m.total_cost,
                        "latency_seconds": m.latency_seconds,
                        "created_at": m.created_at,
                    }
                    for m in messages
                ]
            }

    async def update_conversation(
        self,
        conversation_id: str,
        user_id: str,
        title: Optional[str] = None,
        is_pinned: Optional[bool] = None,
        is_archived: Optional[bool] = None
    ) -> bool:
        async with self.async_session() as session:
            async with session.begin():
                now_str = datetime.utcnow().isoformat()
                vals: Dict[str, Any] = {"updated_at": now_str}
                if title is not None:
                    vals["title"] = title
                if is_pinned is not None:
                    vals["is_pinned"] = is_pinned
                if is_archived is not None:
                    vals["is_archived"] = is_archived

                stmt = update(DBConversation).where(
                    DBConversation.conversation_id == conversation_id,
                    DBConversation.user_id == user_id
                ).values(**vals)
                res = await session.execute(stmt)
                return res.rowcount > 0

    async def delete_conversation(self, conversation_id: str, user_id: str) -> bool:
        async with self.async_session() as session:
            async with session.begin():
                stmt = delete(DBConversation).where(
                    DBConversation.conversation_id == conversation_id,
                    DBConversation.user_id == user_id
                )
                res = await session.execute(stmt)
                return res.rowcount > 0

    # ── Messages & Tool Audit ──────────────────────────────────────

    async def save_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
        model_used: Optional[str] = None,
        prompt_tokens: int = 0,
        completion_tokens: int = 0,
        total_cost: float = 0.0,
        latency_seconds: float = 0.0,
        tool_calls: Optional[List[Dict[str, Any]]] = None,
        citations: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        msg_id = f"msg_{uuid.uuid4().hex[:12]}"
        now_str = datetime.utcnow().isoformat()
        async with self.async_session() as session:
            async with session.begin():
                msg = DBMessage(
                    message_id=msg_id,
                    conversation_id=conversation_id,
                    role=role,
                    content=content,
                    model_used=model_used,
                    prompt_tokens=prompt_tokens,
                    completion_tokens=completion_tokens,
                    total_cost=total_cost,
                    latency_seconds=latency_seconds,
                    created_at=now_str
                )
                session.add(msg)

                # Touch conversation updated_at
                stmt = update(DBConversation).where(
                    DBConversation.conversation_id == conversation_id
                ).values(updated_at=now_str)
                await session.execute(stmt)

                if tool_calls:
                    for tc in tool_calls:
                        call_item = DBMessageToolCall(
                            call_id=f"call_{uuid.uuid4().hex[:8]}",
                            message_id=msg_id,
                            tool_name=tc.get("tool_name", "unknown"),
                            input_params=tc.get("input_params", {}),
                            output_summary=tc.get("output_summary", ""),
                            success=tc.get("success", True),
                            latency_seconds=tc.get("latency_seconds", 0.0)
                        )
                        session.add(call_item)

                if citations:
                    for c in citations:
                        cit_item = DBMessageCitation(
                            citation_id=f"cit_{uuid.uuid4().hex[:8]}",
                            message_id=msg_id,
                            source_title=c.get("source_title", "Source"),
                            source_url=c.get("source_url"),
                            snippet=c.get("snippet", ""),
                            confidence_score=c.get("confidence_score", 1.0)
                        )
                        session.add(cit_item)

        return {
            "message_id": msg_id,
            "conversation_id": conversation_id,
            "role": role,
            "content": content,
            "created_at": now_str
        }

    # ── Feedback ───────────────────────────────────────────────────

    async def save_feedback(self, user_id: str, message_id: str, rating: int, comment: Optional[str] = None) -> str:
        fid = f"fb_{uuid.uuid4().hex[:8]}"
        now_str = datetime.utcnow().isoformat()
        async with self.async_session() as session:
            async with session.begin():
                fb = DBMessageFeedback(
                    feedback_id=fid,
                    message_id=message_id,
                    user_id=user_id,
                    rating=rating,
                    comment=comment,
                    created_at=now_str
                )
                session.add(fb)
        return fid

    # ── User Preferences ──────────────────────────────────────────

    async def get_user_preferences(self, user_id: str) -> Dict[str, Any]:
        async with self.async_session() as session:
            stmt = select(DBUserPreference).where(DBUserPreference.user_id == user_id)
            res = await session.execute(stmt)
            pref = res.scalar_one_or_none()
            if not pref:
                return {
                    "user_id": user_id,
                    "preferred_language": "en",
                    "preferred_model": "auto",
                    "explanation_style": "adaptive",
                    "preferred_units": "metric",
                    "department": None,
                    "memory_enabled": True
                }
            return {
                "user_id": pref.user_id,
                "preferred_language": pref.preferred_language,
                "preferred_model": pref.preferred_model,
                "explanation_style": pref.explanation_style,
                "preferred_units": pref.preferred_units,
                "department": pref.department,
                "memory_enabled": pref.memory_enabled
            }

    async def update_user_preferences(self, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        now_str = datetime.utcnow().isoformat()
        async with self.async_session() as session:
            async with session.begin():
                stmt = select(DBUserPreference).where(DBUserPreference.user_id == user_id)
                res = await session.execute(stmt)
                pref = res.scalar_one_or_none()
                if not pref:
                    pref = DBUserPreference(
                        user_id=user_id,
                        preferred_language=updates.get("preferred_language", "en"),
                        preferred_model=updates.get("preferred_model", "auto"),
                        explanation_style=updates.get("explanation_style", "adaptive"),
                        preferred_units=updates.get("preferred_units", "metric"),
                        department=updates.get("department"),
                        memory_enabled=updates.get("memory_enabled", True),
                        updated_at=now_str
                    )
                    session.add(pref)
                else:
                    for k, v in updates.items():
                        if v is not None and hasattr(pref, k):
                            setattr(pref, k, v)
                    pref.updated_at = now_str
        return await self.get_user_preferences(user_id)

repository = AssistantRepository()
