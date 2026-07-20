from fastapi import APIRouter, Depends
from app.core.security import parse_user_token, UserIdentity
from app.tools.registry import tool_registry

router = APIRouter(prefix="/tools", tags=["Tool Registry"])

@router.get("", summary="List Registered Tools & User Permissions")
async def list_tools(user: UserIdentity = Depends(parse_user_token)):
    tools = tool_registry.list_available_tools_for_user(user)
    return {"count": len(tools), "user_role": user.role, "tools": tools}
