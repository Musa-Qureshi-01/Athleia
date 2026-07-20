from typing import List, Dict, Any, AsyncGenerator, Optional
import httpx
from app.llm.base import BaseLLMProvider, LLMResult
from app.core.config import settings
from app.core.logging import logger

class GroqProvider(BaseLLMProvider):
    def __init__(self, model_name: str = "llama-3.3-70b-versatile"):
        self.api_key = settings.GROQ_API_KEY
        self.model_name = model_name
        self.endpoint = "https://api.groq.com/openai/v1/chat/completions"

    async def generate(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.3,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> LLMResult:
        if not self.api_key:
            return LLMResult(
                text=f"[Groq Offline] Model {self.model_name} executed in mock mode: {messages[-1]['content']}",
                model_name=self.model_name
            )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model_name,
            "messages": messages,
            "temperature": temperature,
        }
        if tools:
            payload["tools"] = tools

        async with httpx.AsyncClient(timeout=45.0) as client:
            res = await client.post(self.endpoint, headers=headers, json=payload)
            if not res.is_success:
                logger.error(f"[GroqProvider Error] {res.status_code}: {res.text}")
                raise Exception(f"Groq API Error ({res.status_code}): {res.text}")

            data = res.json()
            choice = data["choices"][0]
            text = choice["message"].get("content") or ""
            usage = data.get("usage", {})

            return LLMResult(
                text=text,
                prompt_tokens=usage.get("prompt_tokens", 0),
                completion_tokens=usage.get("completion_tokens", 0),
                cost_usd=0.0001,
                model_name=self.model_name
            )

    async def stream(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.3
    ) -> AsyncGenerator[str, None]:
        res = await self.generate(messages, temperature)
        words = res.text.split(" ")
        for w in words:
            yield w + " "
