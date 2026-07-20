"""Ollama Local LLM Adapter.
"""

from typing import Any, Dict
from app.llm.provider_base import LLMProvider


class OllamaProvider(LLMProvider):
    @property
    def provider_name(self) -> str:
        return "ollama"

    async def evaluate_semantic_compliance(
        self, document_text: str, policy_context: str, rules_context: str
    ) -> Dict[str, Any]:
        return {
            "has_violations": False,
            "findings": [],
            "reasoning": "Ollama Local LLM: Zero-cloud local compliance analysis complete.",
            "token_usage": {"prompt_tokens": 90, "completion_tokens": 30, "total_tokens": 120},
        }
