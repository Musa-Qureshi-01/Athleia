from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from app.domain.enums import NotificationType, NotificationPriority

class NotificationCreate(BaseModel):
    title: str = Field(..., example="Critical Safety Violation Detected")
    message: str = Field(..., example="SOP cooling water procedure missing mandatory safety isolation section.")
    type: NotificationType = NotificationType.WARNING
    priority: NotificationPriority = NotificationPriority.HIGH
    source_service: str = Field(..., example="compliance-service")
    recipient: str = Field(default="all", example="admin")
    correlation_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class Notification(BaseModel):
    notification_id: str
    title: str
    message: str
    type: NotificationType
    priority: NotificationPriority
    source_service: str
    recipient: str
    is_read: bool = False
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    read_at: Optional[str] = None
    correlation_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
