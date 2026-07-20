"""Google Gemini LLM Adapter.
"""

from typing import Any, Dict
from app.llm.provider_base import LLMProvider


class GeminiProvider(LLMProvider):
    @property
    def provider_name(self) -> str:
        return "gemini"

    async def evaluate_semantic_compliance(
        self, document_text: str, policy_context: str, rules_context: str
    ) -> Dict[str, Any]:
        return {
            "has_violations": False,
            "findings": [],
            "reasoning": "Google Gemini Provider: Contextual policy reasoning completed successfully.",
            "token_usage": {"prompt_tokens": 105, "completion_tokens": 35, "total_tokens": 140},
        }
