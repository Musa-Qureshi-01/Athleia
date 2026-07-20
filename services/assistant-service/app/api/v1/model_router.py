from fastapi import APIRouter
from app.schemas.model import ModelListResponse, ModelInfo

router = APIRouter(prefix="/models", tags=["Model Registry"])

@router.get("", response_model=ModelListResponse, summary="List Available Enabled Models")
async def list_models():
    models = [
        ModelInfo(id="auto", name="Auto Task-Based Router", provider="System Router", description="Automatically selects optimal model per task", is_default=True, task_specialty="all"),
        ModelInfo(id="groq/llama-3.3-70b-versatile", name="Groq Llama 3.3 70B", provider="Groq", description="Ultra-low latency fast conversation", task_specialty="fast_conversation"),
        ModelInfo(id="gemini/gemini-2.5-flash", name="Google Gemini 2.5 Flash", provider="Google Gemini", description="Search synthesis & high throughput", task_specialty="search_synthesis"),
        ModelInfo(id="openrouter/anthropic/claude-3.5-sonnet", name="Claude 3.5 Sonnet", provider="OpenRouter / Bedrock", description="Deep complex reasoning & analysis", task_specialty="complex_reasoning"),
        ModelInfo(id="openrouter/deepseek/deepseek-r1", name="DeepSeek R1", provider="OpenRouter", description="Document QA & technical code", task_specialty="document_qa"),
        ModelInfo(id="ollama/llama3.1", name="Local Ollama Llama 3.1", provider="Ollama", description="Offline local execution", task_specialty="offline"),
    ]
    return ModelListResponse(default_model="auto", available_models=models)
