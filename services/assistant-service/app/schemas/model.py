from typing import List, Optional
from pydantic import BaseModel

class ModelInfo(BaseModel):
    id: str
    name: str
    provider: str
    description: str
    context_window: int = 128000
    is_default: bool = False
    task_specialty: str = "general"


class ModelListResponse(BaseModel):
    default_model: str
    available_models: List[ModelInfo]
