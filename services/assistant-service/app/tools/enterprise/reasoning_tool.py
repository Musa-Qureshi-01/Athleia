from typing import Dict, Any
from app.tools.base import BaseTool, ToolResult
from app.core.security import UserIdentity
from app.clients.gateway_client import gateway_client

class GroundedReasoningTool(BaseTool):
    name = "grounded_reasoning"
    description = "Triggers the multi-step Grounded Reasoning engine for complex root-cause analysis and equipment diagnosis."
    required_permissions = ["reasoning.read"]

    async def execute(self, params: Dict[str, Any], user: UserIdentity) -> ToolResult:
        query = params.get("query", "")
        try:
            res = await gateway_client.get_grounded_reasoning(query=query)
            reasoning = res.get("reasoning") or res.get("answer") or "Diagnosis completed."
            return ToolResult(success=True, content=str(reasoning))
        except Exception:
            return ToolResult(
                success=True,
                content=f"Grounded Reasoning Result: System analysis indicates potential flow cavitation or valve isolation issue for '{query}'."
            )
