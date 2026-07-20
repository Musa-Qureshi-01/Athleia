"""Abstract Interface for Pluggable LLM Providers.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional


class LLMProvider(ABC):
    """Abstract interface for multi-provider LLM adapters."""

    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @abstractmethod
    async def evaluate_semantic_compliance(
        self,
        document_text: str,
        policy_context: str,
        rules_context: str,
    ) -> Dict[str, Any]:
        """Evaluates semantic policy compliance and returns structured findings dict."""
        pass
