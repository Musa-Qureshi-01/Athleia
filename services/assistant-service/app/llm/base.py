from abc import ABC, abstractmethod
from typing import List, Dict, Any, AsyncGenerator, Optional
from dataclasses import dataclass

@dataclass
class LLMResult:
    text: str
    prompt_tokens: int = 0
    completion_tokens: int = 0
    cost_usd: float = 0.0
    model_name: str = ""
    tool_calls: List[Dict[str, Any]] = None

class BaseLLMProvider(ABC):
    @abstractmethod
    async def generate(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.3,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> LLMResult:
        pass

    @abstractmethod
    async def stream(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.3
    ) -> AsyncGenerator[str, None]:
        pass
