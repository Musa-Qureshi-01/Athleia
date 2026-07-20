import os
from typing import Any
from app.core.config import settings
from app.core.logging import logger

class LLMFactory:
    """
    Pluggable LLM provider factory for Maintenance Intelligence Service.
    Supports OpenAI, Anthropic, Gemini, Azure OpenAI, and Ollama.
    """

    @staticmethod
    def get_llm(provider: str = None, model_name: str = None) -> Any:
        provider = (provider or settings.LLM_PROVIDER).lower()
        model = model_name or settings.DEFAULT_MODEL_NAME

        logger.info(f"Initializing pluggable LLM provider: '{provider}' (model: '{model}')")

        if provider == "openai":
            from langchain_openai import ChatOpenAI
            api_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY", "dummy_key")
            return ChatOpenAI(model=model, api_key=api_key, temperature=0.2)

        elif provider == "anthropic":
            from langchain_anthropic import ChatAnthropic
            api_key = settings.ANTHROPIC_API_KEY or os.getenv("ANTHROPIC_API_KEY", "dummy_key")
            return ChatAnthropic(model=model or "claude-3-5-sonnet-20240620", api_key=api_key, temperature=0.2)

        elif provider == "gemini":
            from langchain_google_genai import ChatGoogleGenerativeAI
            api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "dummy_key")
            return ChatGoogleGenerativeAI(model=model or "gemini-1.5-pro", google_api_key=api_key, temperature=0.2)

        elif provider == "ollama":
            from langchain_community.chat_models import ChatOllama
            return ChatOllama(base_url=settings.OLLAMA_BASE_URL, model=model or "llama3", temperature=0.2)

        else:
            # Fallback to OpenAI interface or mock interface for testing
            from langchain_openai import ChatOpenAI
            api_key = settings.OPENAI_API_KEY or "dummy_key"
            return ChatOpenAI(model="gpt-4o-mini", api_key=api_key, temperature=0.2)
