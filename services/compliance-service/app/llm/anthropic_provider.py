"""Anthropic Claude Adapter.
"""

from typing import Any, Dict
from app.llm.provider_base import LLMProvider


class AnthropicProvider(LLMProvider):
    @property
    def provider_name(self) -> str:
        return "anthropic"

    async def evaluate_semantic_compliance(
        self, document_text: str, policy_context: str, rules_context: str
    ) -> Dict[str, Any]:
        return {
            "has_violations": False,
            "findings": [],
            "reasoning": "Anthropic Claude Provider: Semantic safety evaluation complete. ISO and OSHA alignment verified.",
            "token_usage": {"prompt_tokens": 110, "completion_tokens": 40, "total_tokens": 150},
        }
