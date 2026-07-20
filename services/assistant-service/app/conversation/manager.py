from typing import List, Dict, Any, Optional
from app.repositories.assistant_repository import repository
from app.schemas.conversation import ConversationDetail, ConversationSummary

class ConversationManager:
    """
    Decoupled Conversation Session Manager.
    Handles CRUD operations, user isolation, archiving, pinning, and searching.
    """
    async def create_chat(self, user_id: str, initial_title: str = "New Conversation") -> Dict[str, Any]:
        return await repository.create_conversation(user_id=user_id, title=initial_title)

    async def list_chats(self, user_id: str, include_archived: bool = False) -> List[Dict[str, Any]]:
        return await repository.list_conversations(user_id=user_id, include_archived=include_archived)

    async def get_chat(self, conversation_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        return await repository.get_conversation(conversation_id=conversation_id, user_id=user_id)

    async def update_chat(
        self,
        conversation_id: str,
        user_id: str,
        title: Optional[str] = None,
        is_pinned: Optional[bool] = None,
        is_archived: Optional[bool] = None
    ) -> bool:
        return await repository.update_conversation(
            conversation_id=conversation_id,
            user_id=user_id,
            title=title,
            is_pinned=is_pinned,
            is_archived=is_archived
        )

    async def delete_chat(self, conversation_id: str, user_id: str) -> bool:
        return await repository.delete_conversation(conversation_id=conversation_id, user_id=user_id)

conversation_manager = ConversationManager()
