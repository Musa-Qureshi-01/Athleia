from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.domain.enums import RiskSeverity, FindingStatus, TriggerType, FailureCategory

class EvidenceItem(BaseModel):
    verbatim_quote: str
    document_id: Optional[str] = None
    section_path: Optional[str] = None
    page_number: Optional[int] = None
    context_snippet: Optional[str] = None

class MaintenanceFinding(BaseModel):
    finding_id: str = Field(..., description="Unique finding identifier (fnd_maint_...)")
    equipment_id: str = Field(..., description="Target equipment identifier (e.g., PUMP-P101A)")
    asset_name: str = Field(..., description="Human-readable asset name")
    risk_score: float = Field(..., ge=0.0, le=100.0, description="Calculated composite risk score")
    failure_probability: float = Field(..., ge=0.0, le=1.0, description="Predicted probability of failure")
    failure_category: FailureCategory = FailureCategory.MECHANICAL_DEGRADATION
    evidence: List[EvidenceItem] = Field(default_factory=list)
    historical_pattern: str = Field(..., description="Detected historical failure trend")
    recommended_action: str = Field(..., description="Actionable preventive maintenance task")
    estimated_priority: RiskSeverity = RiskSeverity.HIGH
    confidence: float = Field(default=0.95, ge=0.0, le=1.0)
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    status: FindingStatus = FindingStatus.OPEN
    metadata: Dict[str, Any] = Field(default_factory=dict)

class EquipmentHealth(BaseModel):
    equipment_id: str
    asset_name: str
    health_index: float = Field(..., ge=0.0, le=100.0, description="Overall health score (100 = perfect)")
    last_maintenance_date: Optional[str] = None
    next_recommended_date: Optional[str] = None
    incident_count: int = 0
    mtbf_days: float = Field(default=180.0, description="Estimated Mean Time Between Failures in days")
    risk_rating: RiskSeverity = RiskSeverity.LOW

class MaintenanceScanTelemetry(BaseModel):
    analysis_id: str
    correlation_id: str
    trigger_type: TriggerType
    equipment_id: str
    execution_time_ms: float
    token_usage: Dict[str, int] = Field(default_factory=lambda: {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0})
    tools_used: List[str] = Field(default_factory=list)
    risk_score: float
    status: str = "SUCCESS"
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
