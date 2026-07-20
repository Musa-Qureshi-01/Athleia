from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from app.core.security import UserIdentity

@dataclass
class ToolResult:
    success: bool
    content: str
    citations: List[Dict[str, Any]] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    latency_seconds: float = 0.0
    requires_approval: bool = False
    approval_details: Optional[Dict[str, Any]] = None

class BaseTool(ABC):
    name: str
    description: str
    required_permissions: List[str] = []

    @abstractmethod
    async def execute(self, params: Dict[str, Any], user: UserIdentity) -> ToolResult:
        pass

    def to_openai_schema(self) -> Dict[str, Any]:
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {
                    "type": "object",
                    "properties": {},
                    "required": []
                }
            }
        }
