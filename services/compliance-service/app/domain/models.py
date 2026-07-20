"""Domain Entities for Compliance Intelligence Service.
Every finding is fully explainable with evidence, rule URN, policy reference, severity, and recommendation.
"""

import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from app.domain.enums import ComplianceSeverity, FindingStatus, RuleCategory, ScanTriggerType


class FindingEvidence(BaseModel):
    verbatim_quote: str = Field(..., description="Verbatim quote extracted from document or knowledge package")
    page_number: Optional[int] = Field(None, description="Page number where violation occurred")
    section_path: Optional[str] = Field(None, description="Document section path")
    context_snippet: Optional[str] = Field(None, description="Surrounding contextual text")


class ComplianceFinding(BaseModel):
    finding_id: str = Field(default_factory=lambda: f"fnd_{uuid.uuid4().hex[:8]}", description="Unique Finding ID")
    document_id: str = Field(..., description="Target Document ID or URN")
    package_urn: Optional[str] = Field(None, description="Associated OKF Knowledge Package URN")
    rule_violated: str = Field(..., description="URN or ID of the evaluated compliance rule")
    rule_category: RuleCategory = Field(RuleCategory.METADATA, description="Category of rule")
    policy_reference: str = Field(..., description="Internal Policy, ISO, OSHA, or NIST clause reference")
    title: str = Field(..., description="Short descriptive title of finding")
    evidence: List[FindingEvidence] = Field(default_factory=list, description="Verbatim evidence quotes")
    severity: ComplianceSeverity = Field(ComplianceSeverity.MEDIUM, description="Calculated finding severity")
    confidence: float = Field(1.0, ge=0.0, le=1.0, description="Confidence score (1.0 for deterministic, 0.0-1.0 for LLM)")
    recommendation: str = Field(..., description="Actionable remediation recommendation")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of finding creation")
    status: FindingStatus = Field(FindingStatus.OPEN, description="Current finding lifecycle status")
    reviewer: Optional[str] = Field(None, description="Assigned user or reviewer")
    is_deterministic: bool = Field(True, description="True if generated without LLM tokens")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Extensible JSON metadata")


class ComplianceRule(BaseModel):
    rule_id: str = Field(..., description="Unique Rule ID")
    name: str = Field(..., description="Rule Name")
    description: str = Field(..., description="Detailed description of rule intent")
    category: RuleCategory = Field(..., description="Rule category")
    policy_reference: str = Field(..., description="Policy or regulatory standard reference clause")
    default_severity: ComplianceSeverity = Field(ComplianceSeverity.MEDIUM, description="Default severity")
    is_deterministic: bool = Field(True, description="True if rule runs in Python engine without LLM")
    enabled: bool = Field(True, description="True if active")


class ScanTelemetry(BaseModel):
    scan_id: str = Field(default_factory=lambda: f"scn_{uuid.uuid4().hex[:8]}", description="Scan execution ID")
    correlation_id: str = Field(default_factory=lambda: f"corr_{uuid.uuid4().hex[:8]}", description="Correlation ID")
    trigger_type: ScanTriggerType = Field(..., description="Trigger event type")
    document_id: str = Field(..., description="Scanned document ID")
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None
    execution_time_ms: float = 0.0
    rules_evaluated: int = 0
    deterministic_findings_count: int = 0
    llm_findings_count: int = 0
    token_usage: Dict[str, int] = Field(default_factory=lambda: {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0})
    tool_calls: List[str] = Field(default_factory=list)
    errors: List[str] = Field(default_factory=list)
