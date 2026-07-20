"""Report Generator Tool - Compiles compliance summary reports.
"""

from typing import Any, Dict, List
from app.domain.models import ComplianceFinding
from app.tools.base import BaseComplianceTool


class ReportGeneratorTool(BaseComplianceTool):
    @property
    def name(self) -> str:
        return "report_generator_tool"

    @property
    def description(self) -> str:
        return "Compiles structured executive compliance summary reports from findings repository."

    async def run(self, findings: List[ComplianceFinding]) -> Dict[str, Any]:
        critical = [f for f in findings if f.severity == "CRITICAL"]
        high = [f for f in findings if f.severity == "HIGH"]
        medium = [f for f in findings if f.severity == "MEDIUM"]

        score = max(0, 100 - (len(critical) * 25 + len(high) * 10 + len(medium) * 5))

        return {
            "total_findings": len(findings),
            "compliance_score": score,
            "breakdown": {
                "critical": len(critical),
                "high": len(high),
                "medium": len(medium),
                "low": len([f for f in findings if f.severity == "LOW"]),
            },
            "status": "COMPLIANT" if score >= 85 else "NON_COMPLIANT",
        }
