from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from app.core.security import parse_user_token, UserIdentity
from app.conversation.manager import conversation_manager
from app.schemas.conversation import ConversationUpdate, ConversationDetail, ConversationSummary

router = APIRouter(prefix="/conversations", tags=["Conversation Management"])

@router.get("", summary="List User Conversations")
async def list_conversations(
    include_archived: bool = False,
    user: UserIdentity = Depends(parse_user_token)
):
    chats = await conversation_manager.list_chats(user.user_id, include_archived=include_archived)
    return {"count": len(chats), "conversations": chats}

@router.post("", summary="Create New Conversation")
async def create_conversation(
    title: Optional[str] = "New Conversation",
    user: UserIdentity = Depends(parse_user_token)
):
    conv = await conversation_manager.create_chat(user.user_id, initial_title=title or "New Conversation")
    return conv

@router.get("/{conversation_id}", summary="Get Conversation Detail & History")
async def get_conversation(
    conversation_id: str,
    user: UserIdentity = Depends(parse_user_token)
):
    detail = await conversation_manager.get_chat(conversation_id, user.user_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Conversation not found or unauthorized.")
    return detail

@router.patch("/{conversation_id}", summary="Update Conversation (Rename, Pin, Archive)")
async def update_conversation(
    conversation_id: str,
    req: ConversationUpdate,
    user: UserIdentity = Depends(parse_user_token)
):
    success = await conversation_manager.update_chat(
        conversation_id=conversation_id,
        user_id=user.user_id,
        title=req.title,
        is_pinned=req.is_pinned,
        is_archived=req.is_archived
    )
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found or unauthorized.")
    return {"status": "success", "conversation_id": conversation_id}

@router.delete("/{conversation_id}", summary="Delete Conversation")
async def delete_conversation(
    conversation_id: str,
    user: UserIdentity = Depends(parse_user_token)
):
    success = await conversation_manager.delete_chat(conversation_id, user.user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found or unauthorized.")
    return {"status": "success", "deleted_id": conversation_id}
