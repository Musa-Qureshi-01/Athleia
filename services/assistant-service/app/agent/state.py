from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
from app.schemas.chat import ExecutionMode, ExplanationStyle

@dataclass
class AssistantState:
    # Query & Context
    user_id: str
    user_role: str = "EMPLOYEE"
    user_permissions: List[str] = field(default_factory=list)
    user_preferences: Dict[str, Any] = field(default_factory=dict)
    conversation_id: str = ""
    messages: List[Dict[str, str]] = field(default_factory=list)
    
    # Modes & Parameters
    mode: ExecutionMode = ExecutionMode.STANDARD
    explanation_style: ExplanationStyle = ExplanationStyle.ADAPTIVE
    selected_model_name: str = "auto"
    allow_external_search: bool = True

    # Graph Execution Intermediate State
    intent_category: str = "general"
    system_prompt: str = ""
    llm_raw_response: str = ""
    citations: List[Dict[str, Any]] = field(default_factory=list)
    tool_calls_executed: List[Dict[str, Any]] = field(default_factory=list)
    
    # Audit & Metrics
    prompt_tokens: int = 0
    completion_tokens: int = 0
    cost_usd: float = 0.0
    latency_seconds: float = 0.0
    cache_hit: bool = False
    requires_approval: bool = False
    approval_details: Optional[Dict[str, Any]] = None
    validation_passed: bool = True
    formatted_final_answer: str = ""
