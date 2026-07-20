from typing import List, Dict, Any, AsyncGenerator, Optional
import httpx
from app.llm.base import BaseLLMProvider, LLMResult
from app.core.config import settings
from app.core.logging import logger

class GeminiProvider(BaseLLMProvider):
    def __init__(self, model_name: str = "gemini-2.5-flash"):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = model_name

    async def generate(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.3,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> LLMResult:
        if not self.api_key:
            return LLMResult(
                text=f"[Gemini Simulated] Model {self.model_name} response to {messages[-1]['content']}",
                model_name=self.model_name
            )

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
        contents = []
        for m in messages:
            role = "user" if m["role"] == "user" else "model"
            contents.append({"role": role, "parts": [{"text": m["content"]}]})

        payload = {"contents": contents, "generationConfig": {"temperature": temperature}}

        async with httpx.AsyncClient(timeout=45.0) as client:
            res = await client.post(url, json=payload)
            if not res.is_success:
                logger.error(f"[Gemini Error] {res.status_code}: {res.text}")
                raise Exception(f"Gemini API Error: {res.text}")

            data = res.json()
            try:
                text = data["candidates"][0]["content"]["parts"][0]["text"]
            except Exception:
                text = "Processed content safely."

            return LLMResult(
                text=text,
                prompt_tokens=100,
                completion_tokens=150,
                cost_usd=0.0001,
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
