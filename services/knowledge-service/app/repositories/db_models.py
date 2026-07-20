"""SQLAlchemy Database Models for Knowledge Service (PostgreSQL / SQLite fallback).
"""

from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String, Text, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class KnowledgePackageRecord(Base):
    __tablename__ = "knowledge_packages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    package_urn = Column(String(255), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    version = Column(String(32), nullable=False, default="1.0.0")
    domain = Column(String(128), nullable=False, index=True)
    state = Column(String(32), nullable=False, default="DRAFT", index=True)
    tenant_id = Column(String(128), nullable=False, default="default_tenant", index=True)
    authors_json = Column(JSON, nullable=False, default=list)
    metadata_json = Column(JSON, nullable=False, default=dict)
    created_at = Column(String(64), nullable=False)
    updated_at = Column(String(64), nullable=False)

    documents = relationship("KnowledgeDocumentRecord", back_populates="package", cascade="all, delete-orphan")
    relationships = relationship("KnowledgeRelationshipRecord", back_populates="package", cascade="all, delete-orphan")


class KnowledgeDocumentRecord(Base):
    __tablename__ = "knowledge_documents"

    id = Column(Integer, primary_key=True, autoincrement=True)
    package_id = Column(Integer, ForeignKey("knowledge_packages.id", ondelete="CASCADE"), nullable=False)
    document_urn = Column(String(255), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(64), nullable=False, default="GENERAL", index=True)
    content = Column(Text, nullable=False)
    tags_json = Column(JSON, nullable=False, default=list)
    provenance_json = Column(JSON, nullable=True)
    references_json = Column(JSON, nullable=False, default=list)
    metadata_json = Column(JSON, nullable=False, default=dict)

    package = relationship("KnowledgePackageRecord", back_populates="documents")


class KnowledgeRelationshipRecord(Base):
    __tablename__ = "knowledge_relationships"

    id = Column(Integer, primary_key=True, autoincrement=True)
    package_id = Column(Integer, ForeignKey("knowledge_packages.id", ondelete="CASCADE"), nullable=False)
    source_urn = Column(String(255), nullable=False, index=True)
    target_urn = Column(String(255), nullable=False, index=True)
    relationship_type = Column(String(64), nullable=False, index=True)
    properties_json = Column(JSON, nullable=False, default=dict)

    package = relationship("KnowledgePackageRecord", back_populates="relationships")


class KnowledgeAuditRecordModel(Base):
    __tablename__ = "knowledge_audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    operation_id = Column(String(128), nullable=False, index=True)
    package_urn = Column(String(255), nullable=False, index=True)
    action = Column(String(64), nullable=False)
    performed_by = Column(String(128), nullable=False)
    previous_state = Column(String(32), nullable=True)
    new_state = Column(String(32), nullable=True)
    timestamp = Column(String(64), nullable=False)
    details_json = Column(JSON, nullable=False, default=dict)
