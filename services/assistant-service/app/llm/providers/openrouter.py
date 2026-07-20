from typing import List, Dict, Any, AsyncGenerator, Optional
import httpx
from app.llm.base import BaseLLMProvider, LLMResult
from app.core.config import settings
from app.core.logging import logger

class OpenRouterProvider(BaseLLMProvider):
    def __init__(self, model_name: str = "anthropic/claude-3.5-sonnet"):
        # Rotates between key 1 and key 2 for high availability
        self.api_keys = [k for k in [settings.OPENROUTER_API_KEY_1, settings.OPENROUTER_API_KEY_2] if k]
        self.model_name = model_name
        self.endpoint = "https://openrouter.ai/api/v1/chat/completions"

    def _get_active_key(self) -> str:
        return self.api_keys[0] if self.api_keys else ""

    async def generate(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.3,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> LLMResult:
        key = self._get_active_key()
        if not key:
            return LLMResult(
                text=f"[OpenRouter Simulated] Model {self.model_name}: Grounded analysis for {messages[-1]['content']}",
                model_name=self.model_name
            )

        headers = {
            "Authorization": f"Bearer {key}",
            "HTTP-Referer": "https://athleia.ai",
            "X-Title": "Athleia Assistant",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model_name,
            "messages": messages,
            "temperature": temperature,
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            res = await client.post(self.endpoint, headers=headers, json=payload)
            if not res.is_success:
                logger.error(f"[OpenRouter Error] {res.status_code}: {res.text}")
                raise Exception(f"OpenRouter API Error: {res.text}")

            data = res.json()
            choice = data["choices"][0]
            text = choice["message"].get("content") or ""
            usage = data.get("usage", {})

            return LLMResult(
                text=text,
                prompt_tokens=usage.get("prompt_tokens", 0),
                completion_tokens=usage.get("completion_tokens", 0),
                cost_usd=0.0005,
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
