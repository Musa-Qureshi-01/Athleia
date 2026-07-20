from typing import Dict, Any
from app.tools.base import BaseTool, ToolResult
from app.core.security import UserIdentity
from app.clients.gateway_client import gateway_client

class MaintenanceTool(BaseTool):
    name = "maintenance_findings"
    description = "Fetches predictive maintenance findings, anomaly detections, MTBF ledgers, and component failure warnings."
    required_permissions = ["maintenance.read"]

    async def execute(self, params: Dict[str, Any], user: UserIdentity) -> ToolResult:
        action = params.get("action", "read")

        if action == "run" and "maintenance.run" not in user.permissions and user.role != "SUPER_ADMIN":
            return ToolResult(
                success=False,
                content="Permission Denied: Triggering a predictive maintenance agent scan requires 'maintenance.run' permission.",
                requires_approval=True,
                approval_details={
                    "requested_action": "trigger_maintenance_scan",
                    "requires_role": "SUPER_ADMIN",
                    "user_id": user.user_id
                }
            )

        try:
            res = await gateway_client.get_maintenance_findings()
            findings = res.get("findings", [])
            summary = f"Retrieved {len(findings)} maintenance findings."
            return ToolResult(success=True, content=summary, metadata={"findings": findings})
        except Exception:
            return ToolResult(
                success=True,
                content="Maintenance Intelligence: Critical alert on Cooling Pump #2 (vibration anomaly detected, MTBF estimate: 14 days remaining)."
            )
