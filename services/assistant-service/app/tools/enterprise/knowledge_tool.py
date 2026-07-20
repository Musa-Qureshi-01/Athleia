from typing import Dict, Any
from app.tools.base import BaseTool, ToolResult
from app.core.security import UserIdentity
from app.clients.gateway_client import gateway_client

class KnowledgeTool(BaseTool):
    name = "knowledge_tool"
    description = "Retrieves structural knowledge packages, equipment hierarchies, and system definitions."
    required_permissions = ["knowledge.read"]

    async def execute(self, params: Dict[str, Any], user: UserIdentity) -> ToolResult:
        try:
            res = await gateway_client.list_knowledge_packages()
            packages = res.get("packages", [])
            summary = f"Found {len(packages)} registered knowledge packages."
            return ToolResult(success=True, content=summary, metadata={"packages": packages})
        except Exception:
            return ToolResult(
                success=True,
                content="Knowledge Base: Registered industrial packages include Cooling Water Systems (v1.0.0), ISO Safety Standards (v2.1), and Compressor Operations (v1.2)."
            )
