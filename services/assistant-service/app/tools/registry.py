import time
from typing import Dict, List, Optional, Any
from app.tools.base import BaseTool, ToolResult
from app.core.security import UserIdentity
from app.core.logging import logger

class ToolRegistry:
    """
    Modular Tool Registry.
    Dynamic registration and execution of tools with fine-grained permission checks.
    """
    def __init__(self):
        self._tools: Dict[str, BaseTool] = {}

    def register(self, tool: BaseTool):
        self._tools[tool.name] = tool
        logger.debug(f"[ToolRegistry] Registered tool '{tool.name}' (Required permissions: {tool.required_permissions})")

    def get_tool(self, name: str) -> Optional[BaseTool]:
        return self._tools.get(name)

    def list_available_tools_for_user(self, user: UserIdentity) -> List[Dict[str, Any]]:
        result = []
        for name, tool in self._tools.items():
            # Check permissions
            has_perm = True
            if tool.required_permissions:
                has_perm = user.role == "SUPER_ADMIN" or any(p in user.permissions for p in tool.required_permissions)
            
            result.append({
                "name": tool.name,
                "description": tool.description,
                "required_permissions": tool.required_permissions,
                "accessible": has_perm
            })
        return result

    def get_schemas_for_user(self, user: UserIdentity) -> List[Dict[str, Any]]:
        schemas = []
        for name, tool in self._tools.items():
            if not tool.required_permissions or user.role == "SUPER_ADMIN" or any(p in user.permissions for p in tool.required_permissions):
                schemas.append(tool.to_openai_schema())
        return schemas

    async def execute_tool(self, name: str, params: Dict[str, Any], user: UserIdentity) -> ToolResult:
        tool = self.get_tool(name)
        if not tool:
            return ToolResult(success=False, content=f"Tool '{name}' not found in registry.")

        # Validate permission
        if tool.required_permissions and user.role != "SUPER_ADMIN":
            if not any(p in user.permissions for p in tool.required_permissions):
                return ToolResult(
                    success=False,
                    content=f"Permission Denied: User '{user.email}' lacks required permissions {tool.required_permissions} to execute '{name}'."
                )

        t0 = time.time()
        try:
            res = await tool.execute(params, user)
            res.latency_seconds = round(time.time() - t0, 3)
            return res
        except Exception as e:
            logger.error(f"[ToolRegistry] Exception in tool '{name}': {e}")
            return ToolResult(
                success=False,
                content=f"Error executing tool '{name}': {str(e)}",
                latency_seconds=round(time.time() - t0, 3)
            )

tool_registry = ToolRegistry()
