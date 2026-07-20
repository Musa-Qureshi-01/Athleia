from enum import Enum
from typing import Optional
from app.llm.base import BaseLLMProvider
from app.llm.providers.groq import GroqProvider
from app.llm.providers.openrouter import OpenRouterProvider
from app.llm.providers.gemini import GeminiProvider
from app.llm.providers.bedrock import BedrockProvider
from app.llm.providers.ollama import OllamaProvider

class TaskType(str, Enum):
    SEARCH_SYNTHESIS = "search_synthesis"
    COMPLEX_REASONING = "complex_reasoning"
    FAST_CONVERSATION = "fast_conversation"
    TRANSLATION = "translation"
    DOCUMENT_QA = "document_qa"

class ModelRouter:
    """
    Task-Based Model Router.
    Automatically selects the optimal LLM provider and model based on intent/task type,
    or respects explicit user preference.
    """
    def get_provider(
        self,
        task: TaskType,
        user_preferred_model: Optional[str] = None
    ) -> BaseLLMProvider:
        pref = (user_preferred_model or "auto").lower()

        # Explicit User Model Directives
        if "groq" in pref:
            return GroqProvider()
        if "gemini" in pref:
            return GeminiProvider()
        if "bedrock" in pref or "claude" in pref:
            return BedrockProvider()
        if "ollama" in pref:
            return OllamaProvider()
        if "openrouter" in pref or "deepseek" in pref:
            return OpenRouterProvider()

        # Automatic Task-Based Routing Defaults
        if task == TaskType.FAST_CONVERSATION:
            return GroqProvider("llama-3.3-70b-versatile")
        elif task == TaskType.COMPLEX_REASONING:
            return OpenRouterProvider("anthropic/claude-3.5-sonnet")
        elif task == TaskType.SEARCH_SYNTHESIS:
            return GeminiProvider("gemini-2.5-flash")
        elif task == TaskType.DOCUMENT_QA:
            return OpenRouterProvider("deepseek/deepseek-r1")
        elif task == TaskType.TRANSLATION:
            return GeminiProvider("gemini-2.5-flash")

        # System Default
        return GroqProvider("llama-3.3-70b-versatile")

model_router = ModelRouter()
