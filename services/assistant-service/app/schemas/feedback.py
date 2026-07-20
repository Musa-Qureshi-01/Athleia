from typing import Optional
from pydantic import BaseModel, Field

class FeedbackCreate(BaseModel):
    message_id: str
    rating: int = Field(..., ge=1, le=5, description="1 to 5 stars or 1=down, 5=up")
    comment: Optional[str] = None

class FeedbackResponse(BaseModel):
    status: str = "success"
    feedback_id: str
    message_id: str
