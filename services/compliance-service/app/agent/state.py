"""LangGraph Compliance Agent State Definition.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from app.domain.enums import ScanTriggerType
from app.domain.models import ComplianceFinding, ScanTelemetry


class ComplianceAgentState(BaseModel):
    scan_id: str
    document_id: str
    trigger_type: ScanTriggerType
    content: str = ""
    metadata: Dict[str, Any] = Field(default_factory=dict)
    deterministic_findings: List[ComplianceFinding] = Field(default_factory=list)
    semantic_findings: List[ComplianceFinding] = Field(default_factory=list)
    all_findings: List[ComplianceFinding] = Field(default_factory=list)
    requires_llm_analysis: bool = False
    telemetry: Optional[ScanTelemetry] = None
    error: Optional[str] = None
