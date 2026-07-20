from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    is_pinned: Optional[bool] = None
    is_archived: Optional[bool] = None

class MessageSchema(BaseModel):
    message_id: str
    conversation_id: str
    role: str
    content: str
    model_used: Optional[str] = None
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_cost: float = 0.0
    latency_seconds: float = 0.0
    created_at: str

class ConversationDetail(BaseModel):
    conversation_id: str
    user_id: str
    title: str
    is_pinned: bool
    is_archived: bool
    created_at: str
    updated_at: str
    messages: List[MessageSchema] = Field(default_factory=list)

class ConversationSummary(BaseModel):
    conversation_id: str
    user_id: str
    title: str
    is_pinned: bool
    is_archived: bool
    created_at: str
    updated_at: str
    last_message_snippet: Optional[str] = None
