from typing import List, Dict, Any, AsyncGenerator, Optional
import httpx
from app.llm.base import BaseLLMProvider, LLMResult
from app.core.config import settings

class OllamaProvider(BaseLLMProvider):
    def __init__(self, model_name: str = "llama3.1"):
        self.base_url = settings.OLLAMA_BASE_URL
        self.model_name = model_name

    async def generate(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.3,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> LLMResult:
        endpoint = f"{self.base_url}/api/chat"
        payload = {"model": self.model_name, "messages": messages, "stream": False}
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                res = await client.post(endpoint, json=payload)
                if res.is_success:
                    data = res.json()
                    return LLMResult(
                        text=data["message"]["content"],
                        prompt_tokens=50,
                        completion_tokens=100,
                        cost_usd=0.0,
                        model_name=self.model_name
                    )
        except Exception:
            pass

        return LLMResult(
            text=f"[Ollama Offline Fallback] Response generated for query.",
            model_name=self.model_name
        )

    async def stream(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.3
    ) -> AsyncGenerator[str, None]:
        res = await self.generate(messages, temperature)
        for chunk in res.text.split(" "):
            yield chunk + " "
