"""Standard API Envelopes matching API & Data Contract Specification.
"""

from datetime import datetime, timezone
from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class APIErrorDetails(BaseModel):
    category: str
    code: str
    message: str
    details: Optional[dict[str, Any]] = None


class APISuccessResponse(BaseModel, Generic[T]):
    status: str = "success"
    message: str
    data: Optional[T] = None
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    request_id: str


class APIErrorResponse(BaseModel):
    status: str = "error"
    error: APIErrorDetails
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    request_id: str
