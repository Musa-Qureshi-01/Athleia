from typing import TypedDict, List, Dict, Any, Optional

class MaintenanceAgentState(TypedDict):
    analysis_id: str
    correlation_id: str
    trigger_type: str
    equipment_id: str
    asset_name: str
    raw_content: Optional[str]
    maintenance_history: List[Dict[str, Any]]
    incident_logs: List[Dict[str, Any]]
    manual_specs: Dict[str, Any]
    deterministic_result: Dict[str, Any]
    llm_reasoning_summary: str
    recommended_action: str
    risk_score: float
    failure_probability: float
    severity: str
    confidence: float
    evidence: List[Dict[str, Any]]
    status: str
    execution_time_ms: float
    token_usage: Dict[str, int]
    tools_used: List[str]
    error: Optional[str]
