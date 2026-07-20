from typing import Optional
from pydantic import BaseModel

class UserPreferenceUpdate(BaseModel):
    preferred_language: Optional[str] = None
    preferred_model: Optional[str] = None
    explanation_style: Optional[str] = None
    preferred_units: Optional[str] = None
    department: Optional[str] = None
    memory_enabled: Optional[bool] = None

class UserPreferenceSchema(BaseModel):
    user_id: str
    preferred_language: str = "en"
    preferred_model: str = "auto"
    explanation_style: str = "adaptive"
    preferred_units: str = "metric"
    department: Optional[str] = None
    memory_enabled: bool = True
