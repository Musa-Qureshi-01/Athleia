"""SQLAlchemy Models for Compliance Intelligence Service (PostgreSQL with JSONB metadata).
"""

from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, JSON
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class DBComplianceFinding(Base):
    __tablename__ = "compliance_findings"

    finding_id = Column(String, primary_key=True)
    document_id = Column(String, index=True, nullable=False)
    package_urn = Column(String, index=True, nullable=True)
    rule_violated = Column(String, index=True, nullable=False)
    rule_category = Column(String, index=True, nullable=False)
    policy_reference = Column(String, nullable=False)
    title = Column(String, nullable=False)
    evidence_json = Column(JSON, nullable=False, default=list)
    severity = Column(String, index=True, nullable=False)
    confidence = Column(Float, nullable=False, default=1.0)
    recommendation = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(String, index=True, nullable=False, default="OPEN")
    reviewer = Column(String, nullable=True)
    is_deterministic = Column(Boolean, nullable=False, default=True)
    metadata_json = Column(JSON, nullable=False, default=dict)


class DBScanTelemetry(Base):
    __tablename__ = "compliance_scans"

    scan_id = Column(String, primary_key=True)
    correlation_id = Column(String, index=True, nullable=False)
    trigger_type = Column(String, index=True, nullable=False)
    document_id = Column(String, index=True, nullable=False)
    start_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    end_time = Column(DateTime, nullable=True)
    execution_time_ms = Column(Float, default=0.0)
    rules_evaluated = Column(Integer, default=0) if "Integer" in globals() else Column(Float, default=0.0)
    deterministic_findings_count = Column(Float, default=0.0)
    llm_findings_count = Column(Float, default=0.0)
    token_usage_json = Column(JSON, nullable=False, default=dict)
    tool_calls_json = Column(JSON, nullable=False, default=list)
    errors_json = Column(JSON, nullable=False, default=list)
