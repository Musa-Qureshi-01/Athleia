from typing import List, Dict, Any

class ConversationMemoryManager:
    """
    Layer 1 Memory: Short-Term Conversation Memory.
    Manages sliding window history and generates context summaries when history exceeds token limits.
    """
    def __init__(self, max_turns: int = 10):
        self.max_turns = max_turns

    def format_history_for_prompt(self, messages: List[Dict[str, Any]]) -> List[Dict[str, str]]:
        recent = messages[-self.max_turns:]
        formatted = []
        for m in recent:
            role = m.get("role", "user")
            content = m.get("content", "")
            formatted.append({"role": role, "content": content})
        return formatted

    def generate_context_summary(self, messages: List[Dict[str, Any]]) -> str:
        if len(messages) <= self.max_turns:
            return ""
        older = messages[:-self.max_turns]
        topics = [m.get("content", "")[:50] for m in older if m.get("role") == "user"]
        return f"Prior Context Summary ({len(older)} turns): User previously inquired about: {'; '.join(topics)}."

conversation_memory = ConversationMemoryManager()
