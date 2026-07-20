from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

class ExecutionMode(str, Enum):
    STANDARD = "standard"
    DEEP_THINK = "deep_think"

class ExplanationStyle(str, Enum):
    ADAPTIVE = "adaptive"
    BEGINNER = "beginner"
    TECHNICIAN = "technician"
    ENGINEER = "engineer"
    MANAGER = "manager"

class ChatMessageCreate(BaseModel):
    conversation_id: Optional[str] = Field(None, example="conv_12345678")
    message: str = Field(..., min_length=1, example="How do I troubleshoot cooling pump pressure drops?")
    model: Optional[str] = Field("auto", example="groq/llama-3.3-70b-versatile")
    mode: Optional[ExecutionMode] = Field(ExecutionMode.STANDARD)
    explanation_style: Optional[ExplanationStyle] = Field(ExplanationStyle.ADAPTIVE)
    allow_external_search: Optional[bool] = Field(True)

class CitationSchema(BaseModel):
    source_title: str
    source_url: Optional[str] = None
    snippet: str
    confidence_score: Optional[float] = 1.0

class ToolCallAuditSchema(BaseModel):
    tool_name: str
    input_params: Dict[str, Any]
    output_summary: str
    success: bool
    latency_seconds: float

class ChatResponse(BaseModel):
    conversation_id: str
    message_id: str
    answer: str
    citations: List[CitationSchema] = Field(default_factory=list)
    suggested_followups: List[str] = Field(default_factory=list)
    model_used: str
    mode: ExecutionMode
    explanation_style: ExplanationStyle
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_cost_usd: float = 0.0
    latency_seconds: float = 0.0
    tool_calls: List[ToolCallAuditSchema] = Field(default_factory=list)
    cache_hit: bool = False
    requires_approval: bool = False
    approval_details: Optional[Dict[str, Any]] = None
