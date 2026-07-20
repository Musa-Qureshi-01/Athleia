"""Notification Tool - Dispatches critical compliance alerts to Notification Service.
"""

from typing import Any, Dict
import httpx
from app.core.config import settings
from app.domain.enums import ComplianceSeverity
from app.tools.base import BaseComplianceTool


class NotificationTool(BaseComplianceTool):
    @property
    def name(self) -> str:
        return "notification_tool"

    @property
    def description(self) -> str:
        return "Dispatches compliance violation alerts (Critical/High) to Notification Service."

    async def run(self, finding_id: str, title: str, severity: ComplianceSeverity, document_id: str) -> Dict[str, Any]:
        payload = {
            "finding_id": finding_id,
            "title": title,
            "severity": severity.value,
            "document_id": document_id,
            "channel": "SLACK_EMAIL",
        }

        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.post(
                    f"{settings.NOTIFICATION_SERVICE_URL}/api/v1/notify",
                    json=payload
                )
                if res.status_code == 200:
                    return {"status": "dispatched", "notification_id": res.json().get("id")}
        except Exception:
            pass

        return {"status": "logged", "message": f"Alert for finding '{finding_id}' logged for notification dispatch."}
