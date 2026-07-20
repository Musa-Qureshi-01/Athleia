"""SQLAlchemy database models for Document Registry, Versioning, and Processing Job telemetry.
"""

from datetime import datetime, timezone
import uuid

from sqlalchemy import JSON, Column, DateTime, Integer, String, Text
from app.db.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class DocumentRecord(Base):
    """Logical document container representing a document independent of versions."""

    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    logical_document_id = Column(String(36), nullable=False, index=True)
    tenant_id = Column(String(64), nullable=False, index=True, default="default_tenant")
    version = Column(String(16), nullable=False, default="1.0")
    filename = Column(String(255), nullable=False)
    file_hash = Column(String(64), nullable=False, index=True)  # SHA-256 duplicate detection
    mime_type = Column(String(128), nullable=False)
    size_bytes = Column(Integer, nullable=False)
    category = Column(String(32), nullable=False, default="GENERAL")
    subtype = Column(String(64), nullable=False, default="PDF")
    status = Column(String(32), nullable=False, default="Pending")
    storage_path = Column(String(512), nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)


class DocumentVersionRecord(Base):
    """Immutable point-in-time snapshot of a logical document revision."""

    __tablename__ = "document_versions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    logical_document_id = Column(String(36), nullable=False, index=True)
    version = Column(String(16), nullable=False)
    document_id = Column(String(36), nullable=False)
    file_hash = Column(String(64), nullable=False)
    storage_path = Column(String(512), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)


class ProcessingJobRecord(Base):
    """Asynchronous job tracking state transitions, trace logs, workers, and retries."""

    __tablename__ = "processing_jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String(64), nullable=False, index=True, unique=True)
    document_id = Column(String(36), nullable=False, index=True)
    tenant_id = Column(String(64), nullable=False, index=True, default="default_tenant")
    state = Column(String(32), nullable=False, default="Pending")
    current_stage = Column(String(64), nullable=False, default="Ingestion")
    retry_count = Column(Integer, nullable=False, default=0)
    worker_id = Column(String(64), nullable=True)
    error_message = Column(Text, nullable=True)
    trace_logs = Column(JSON, nullable=True, default=list)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)
