"""SQLAlchemy models for Reasoning Sessions, Tool Trace Audits, and Evaluation Scores.
"""

from datetime import datetime, timezone
import uuid
from sqlalchemy import JSON, Column, DateTime, Float, Integer, String, Text
from app.db.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class ReasoningSessionRecord(Base):
    """Tracks user reasoning query sessions, intent classification, and final grounded answer."""

    __tablename__ = "reasoning_session"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(64), nullable=False, index=True)
    tenant_id = Column(String(64), nullable=False, index=True, default="default_tenant")
    user_query = Column(Text, nullable=False)
    intent_category = Column(String(64), nullable=False, default="GENERAL_INDUSTRIAL_QUERY")
    grounded_answer = Column(Text, nullable=False)
    confidence_score = Column(Float, nullable=False, default=0.0)
    has_external_knowledge = Column(String(10), nullable=False, default="FALSE")
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)


class ReasoningTraceRecord(Base):
    """Detailed audit log tracing tool executions, collected evidence, citations, and evaluation metrics."""

    __tablename__ = "reasoning_trace"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(64), nullable=False, index=True)
    tenant_id = Column(String(64), nullable=False, index=True, default="default_tenant")
    step_name = Column(String(64), nullable=False)
    knowledge_priority_used = Column(String(32), nullable=False, default="PRIORITY_1_ENTERPRISE")
    tools_executed = Column(JSON, nullable=False)
    evidence_json = Column(JSON, nullable=True)
    citations_json = Column(JSON, nullable=True)
    evaluation_scores = Column(JSON, nullable=True)  # Grounding, Faithfulness, Relevance scores
    duration_ms = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
