"""Multi-Provider LLM Orchestrator for Athleia Reasoning Service.

Supports Google Gemini, Anthropic via Amazon Bedrock, Groq, OpenRouter, Local Ollama,
and Deterministic Grounded Fallback.
"""

import json
from typing import List, Tuple
import httpx

from app.core.config import settings
from app.core.logging import logger
from app.schemas.reasoning import EvidenceItem

GROUNDED_SYSTEM_PROMPT = """You are the Industrial AI Reasoning Engine for Athleia.ai.
Your responsibility is to answer the user's technical inquiry strictly using the provided verified enterprise evidence.

RULES:
1. Every factual statement MUST be supported by the provided evidence chunks.
2. Cite evidence sources inline using square brackets like [1], [2] matching the provided evidence index numbers.
3. NEVER fabricate information or assume facts not present in the evidence.
4. If the provided evidence is insufficient to answer the query confidently, explicitly state:
   "Insufficient grounded enterprise evidence available to confidently answer the query."
"""


class LLMProvider:
    """Orchestrates LLM calls across Gemini, Amazon Bedrock Anthropic, Groq, OpenRouter, and Ollama."""

    @classmethod
    async def generate(
        cls, user_query: str, evidence_items: List[EvidenceItem], provider_override: str | None = None
    ) -> Tuple[str, str]:
        """Generates grounded LLM reasoning response. Returns (grounded_answer, provider_used)."""
        provider = (provider_override or settings.LLM_PROVIDER).upper()

        if not evidence_items:
            return (
                "Insufficient grounded enterprise evidence available to confidently answer the query.",
                "NONE"
            )

        # Build Context Prompt from Evidence Items
        context_str = cls._build_evidence_context(evidence_items)
        user_prompt = f"VERIFIED ENTERPRISE EVIDENCE:\n{context_str}\n\nUSER INQUIRY:\n{user_query}\n\nGROUNDED ANSWER:"

        # Dispatch to requested provider
        if provider == "GEMINI" and settings.GEMINI_API_KEY:
            answer = await cls._call_gemini(user_prompt)
            if answer:
                return answer, f"GEMINI ({settings.GEMINI_MODEL})"

        elif provider == "GROQ" and settings.GROQ_API_KEY:
            answer = await cls._call_groq(user_prompt)
            if answer:
                return answer, f"GROQ ({settings.GROQ_MODEL})"

        elif provider == "OPENROUTER" and settings.OPENROUTER_API_KEY:
            answer = await cls._call_openrouter(user_prompt)
            if answer:
                return answer, f"OPENROUTER ({settings.OPENROUTER_MODEL})"

        elif provider == "BEDROCK_ANTHROPIC":
            answer = await cls._call_bedrock_anthropic(user_prompt)
            if answer:
                return answer, f"BEDROCK_ANTHROPIC ({settings.BEDROCK_MODEL_ID})"

        elif provider == "OLLAMA":
            answer = await cls._call_ollama(user_prompt)
            if answer:
                return answer, f"OLLAMA ({settings.OLLAMA_MODEL})"

        # Fallback to Deterministic Grounded Synthesizer
        return cls._fallback_synthesis(evidence_items), "DETERMINISTIC_GROUNDED_ENGINE"

    @classmethod
    def _build_evidence_context(cls, evidence_items: List[EvidenceItem]) -> str:
        lines = []
        for idx, ev in enumerate(evidence_items):
            lines.append(f"[{idx+1}] Source: {ev.source_name} (Page {ev.page_number or 1}) | Content: \"{ev.content.strip()}\"")
        return "\n".join(lines)

    @classmethod
    async def _call_gemini(cls, prompt: str) -> str | None:
        """Call Google Gemini REST API."""
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
            payload = {
                "contents": [{"parts": [{"text": f"{GROUNDED_SYSTEM_PROMPT}\n\n{prompt}"}]}]
            }
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            logger.warning("gemini_api_call_failed", error=str(e))
        return None

    @classmethod
    async def _call_groq(cls, prompt: str) -> str | None:
        """Call Groq REST API."""
        try:
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {"Authorization": f"Bearer {settings.GROQ_API_KEY}", "Content-Type": "application/json"}
            payload = {
                "model": settings.GROQ_MODEL,
                "messages": [
                    {"role": "system", "content": GROUNDED_SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.1
            }
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(url, json=payload, headers=headers)
                if resp.status_code == 200:
                    return resp.json()["choices"][0]["message"]["content"]
        except Exception as e:
            logger.warning("groq_api_call_failed", error=str(e))
        return None

    @classmethod
    async def _call_openrouter(cls, prompt: str) -> str | None:
        """Call OpenRouter Gateway REST API."""
        try:
            url = "https://openrouter.ai/api/v1/chat/completions"
            headers = {"Authorization": f"Bearer {settings.OPENROUTER_API_KEY}", "Content-Type": "application/json"}
            payload = {
                "model": settings.OPENROUTER_MODEL,
                "messages": [
                    {"role": "system", "content": GROUNDED_SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.1
            }
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(url, json=payload, headers=headers)
                if resp.status_code == 200:
                    return resp.json()["choices"][0]["message"]["content"]
        except Exception as e:
            logger.warning("openrouter_api_call_failed", error=str(e))
        return None

    @classmethod
    async def _call_bedrock_anthropic(cls, prompt: str) -> str | None:
        """Call Anthropic Claude via AWS Bedrock Runtime boto3 client."""
        try:
            import boto3
            session = boto3.Session()
            client = session.client("bedrock-runtime", region_name="us-east-1")
            payload = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1000,
                "system": GROUNDED_SYSTEM_PROMPT,
                "messages": [{"role": "user", "content": prompt}]
            }
            resp = client.invoke_model(
                modelId=settings.BEDROCK_MODEL_ID,
                body=json.dumps(payload)
            )
            resp_body = json.loads(resp.get("body").read())
            return resp_body["content"][0]["text"]
        except Exception as e:
            logger.warning("bedrock_anthropic_call_failed", error=str(e))
        return None

    @classmethod
    async def _call_ollama(cls, prompt: str) -> str | None:
        """Call local Ollama REST API."""
        try:
            url = f"{settings.OLLAMA_BASE_URL}/api/generate"
            payload = {
                "model": settings.OLLAMA_MODEL,
                "system": GROUNDED_SYSTEM_PROMPT,
                "prompt": prompt,
                "stream": False
            }
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    return resp.json().get("response")
        except Exception as e:
            logger.warning("ollama_api_call_failed", error=str(e))
        return None

    @classmethod
    def _fallback_synthesis(cls, evidence_items: List[EvidenceItem]) -> str:
        paragraphs = []
        for idx, ev in enumerate(evidence_items):
            cid = f"[{idx+1}]"
            source_tag = "[EXTERNAL]" if ev.is_external else f"[{ev.source_name}]"
            paragraphs.append(f"{ev.content.strip()} {cid} {source_tag}")

        grounded_answer = "Based on verified enterprise knowledge:\n\n"
        grounded_answer += "\n\n".join(paragraphs)
        return grounded_answer


llm_provider = LLMProvider()
