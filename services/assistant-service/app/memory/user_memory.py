from typing import Dict, Any, Optional
from app.repositories.assistant_repository import repository

class UserMemoryManager:
    """
    Layer 2 Memory: User Memory & Personalization.
    Stores preferred explanation style, language, measurement units, and department context.
    Never stores sensitive passwords or auth tokens.
    """
    async def get_user_memory_context(self, user_id: str) -> Dict[str, Any]:
        prefs = await repository.get_user_preferences(user_id)
        return {
            "preferred_language": prefs.get("preferred_language", "en"),
            "explanation_style": prefs.get("explanation_style", "adaptive"),
            "preferred_units": prefs.get("preferred_units", "metric"),
            "department": prefs.get("department"),
            "memory_enabled": prefs.get("memory_enabled", True)
        }

    async def update_user_memory(self, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        return await repository.update_user_preferences(user_id, updates)

user_memory = UserMemoryManager()
