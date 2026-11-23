"""SQLAlchemy models for Vector Index, BM25 Keyword Index, and Search Audit Logs.
"""

from datetime import datetime, timezone
import uuid
from sqlalchemy import JSON, Column, DateTime, Float, Integer, String, Text
from app.db.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class VectorIndexRecord(Base):
    """Stores text chunk embeddings and metadata payload for Dense Vector Retrieval."""

    __tablename__ = "retrieval_vector_index"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    chunk_id = Column(String(64), nullable=False, index=True)
    document_id = Column(String(36), nullable=False, index=True)
    logical_document_id = Column(String(36), nullable=False, index=True)
    tenant_id = Column(String(64), nullable=False, index=True, default="default_tenant")
    page_number = Column(Integer, nullable=False, default=1)
    section_path = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    embedding_json = Column(JSON, nullable=False)  # Float array representation of dense vector
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)


class BM25IndexRecord(Base):
    """Stores tokenized text content and document identifiers for Sparse BM25 Keyword Retrieval."""

    __tablename__ = "retrieval_bm25_index"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    chunk_id = Column(String(64), nullable=False, index=True)
    document_id = Column(String(36), nullable=False, index=True)
    logical_document_id = Column(String(36), nullable=False, index=True)
    tenant_id = Column(String(64), nullable=False, index=True, default="default_tenant")
    content = Column(Text, nullable=False)
    tokens_json = Column(JSON, nullable=False)  # List of lowercased tokens for BM25
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)


class SearchAuditRecord(Base):
    """Audit log tracking query execution duration, retrieval type, and top result counts."""

    __tablename__ = "retrieval_search_audit"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    search_id = Column(String(64), nullable=False, index=True, unique=True)
    tenant_id = Column(String(64), nullable=False, index=True, default="default_tenant")
    query = Column(Text, nullable=False)
    search_type = Column(String(32), nullable=False, default="HYBRID")  # DENSE, SPARSE, HYBRID
    results_count = Column(Integer, nullable=False, default=0)
    duration_ms = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
