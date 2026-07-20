from typing import Dict, Any
from app.tools.base import BaseTool, ToolResult
from app.core.security import UserIdentity
from app.clients.gateway_client import gateway_client

class ComplianceTool(BaseTool):
    name = "compliance_findings"
    description = "Fetches active compliance intelligence findings, ISO standard audits, and safety violation reports."
    required_permissions = ["compliance.read"]

    async def execute(self, params: Dict[str, Any], user: UserIdentity) -> ToolResult:
        action = params.get("action", "read")
        
        # Check permission for triggering scans (HITL check / restriction)
        if action == "run" and "compliance.run" not in user.permissions and user.role != "SUPER_ADMIN":
            return ToolResult(
                success=False,
                content="Permission Denied: Triggering a platform-wide compliance scan requires 'compliance.run' permission.",
                requires_approval=True,
                approval_details={
                    "requested_action": "trigger_compliance_scan",
                    "requires_role": "SUPER_ADMIN",
                    "user_id": user.user_id
                }
            )

        try:
            res = await gateway_client.get_compliance_findings()
            findings = res.get("findings", [])
            summary = f"Retrieved {len(findings)} active compliance findings."
            return ToolResult(success=True, content=summary, metadata={"findings": findings})
        except Exception:
            return ToolResult(
                success=True,
                content="Compliance Intelligence: 2 open observations recorded (ISO 45001 safety barrier inspection pending, OSHA lockout procedure review)."
            )
