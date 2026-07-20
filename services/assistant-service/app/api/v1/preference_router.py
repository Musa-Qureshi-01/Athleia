from fastapi import APIRouter, Depends
from app.core.security import parse_user_token, UserIdentity
from app.schemas.preference import UserPreferenceUpdate, UserPreferenceSchema
from app.memory.user_memory import user_memory

router = APIRouter(prefix="/preferences", tags=["User Preferences & Memory"])

@router.get("", response_model=UserPreferenceSchema, summary="Get User Preferences & Memory Controls")
async def get_preferences(user: UserIdentity = Depends(parse_user_token)):
    pref = await user_memory.get_user_memory_context(user.user_id)
    return UserPreferenceSchema(user_id=user.user_id, **pref)

@router.patch("", response_model=UserPreferenceSchema, summary="Update User Preferences & Explanation Style")
async def update_preferences(
    req: UserPreferenceUpdate,
    user: UserIdentity = Depends(parse_user_token)
):
    updates = req.model_dump(exclude_unset=True)
    pref = await user_memory.update_user_memory(user.user_id, updates)
    return UserPreferenceSchema(user_id=user.user_id, **pref)

@router.delete("/memory", summary="Clear User Long-Term Memory")
async def clear_memory(user: UserIdentity = Depends(parse_user_token)):
    pref = await user_memory.update_user_memory(user.user_id, {"memory_enabled": False})
    return {"status": "success", "message": "User long-term memory cleared and disabled."}
