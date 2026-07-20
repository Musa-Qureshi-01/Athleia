"""LLM Provider Factory & Strategy Manager.
"""

from typing import Dict
from app.core.errors import InvalidProviderError
from app.llm.provider_base import LLMProvider
from app.llm.openai_provider import OpenAIProvider
from app.llm.anthropic_provider import AnthropicProvider
from app.llm.gemini_provider import GeminiProvider
from app.llm.ollama_provider import OllamaProvider


class LLMFactory:
    """Factory instantiating requested LLM provider."""

    def __init__(self):
        self._providers: Dict[str, LLMProvider] = {
            "openai": OpenAIProvider(),
            "anthropic": AnthropicProvider(),
            "gemini": GeminiProvider(),
            "ollama": OllamaProvider(),
        }

    def get_provider(self, provider_name: str) -> LLMProvider:
        name = provider_name.lower().strip()
        if name not in self._providers:
            raise InvalidProviderError(f"Unsupported LLM Provider '{provider_name}'. Supported: {list(self._providers.keys())}")
        return self._providers[name]


llm_factory = LLMFactory()
