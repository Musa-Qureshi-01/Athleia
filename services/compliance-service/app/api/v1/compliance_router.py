"""FastAPI Router for Compliance Dashboard & Inter-Service Querying (/api/v1/compliance).
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

from app.agent.workflow import compliance_agent
from app.domain.enums import ComplianceSeverity, FindingStatus, ScanTriggerType
from app.domain.models import ComplianceFinding
from app.repositories.sqlalchemy_repository import repository
from app.rules.rule_engine import rule_engine
from app.tools.notification_tool import NotificationTool
from app.tools.report_generator_tool import ReportGeneratorTool

router = APIRouter(tags=["Compliance Intelligence"])
notification_tool = NotificationTool()
report_tool = ReportGeneratorTool()


class TriggerScanRequest(BaseModel):
    document_id: str = Field(..., description="Target document ID or URN to scan")
    content: Optional[str] = Field(None, description="Optional raw text content")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Document metadata attributes")
    trigger_type: ScanTriggerType = Field(ScanTriggerType.MANUAL_SCAN, description="Scan trigger type")


class UpdateFindingStatusRequest(BaseModel):
    status: FindingStatus = Field(..., description="Target finding status")
    reviewer: str = Field("compliance_officer", description="User ID updating status")


@router.post("/scan", status_code=status.HTTP_200_OK)
async def trigger_compliance_scan(req: TriggerScanRequest):
    """Triggers Compliance Agent scan on target document."""
    state = await compliance_agent.run_scan(
        document_id=req.document_id,
        content=req.content or "",
        metadata=req.metadata,
        trigger_type=req.trigger_type,
    )

    # Store findings
    for finding in state.all_findings:
        await repository.save_finding(finding)

        # Notify if Critical / High
        if finding.severity in (ComplianceSeverity.CRITICAL, ComplianceSeverity.HIGH):
            await notification_tool.run(
                finding_id=finding.finding_id,
                title=finding.title,
                severity=finding.severity,
                document_id=finding.document_id,
            )

    # Record telemetry
    if state.telemetry:
        await repository.record_telemetry(state.telemetry)

    return {
        "status": "success",
        "scan_id": state.scan_id,
        "document_id": state.document_id,
        "total_findings": len(state.all_findings),
        "deterministic_findings": len(state.deterministic_findings),
        "semantic_findings": len(state.semantic_findings),
        "findings": state.all_findings,
    }


@router.get("/findings")
async def get_compliance_findings(
    document_id: Optional[str] = Query(None, description="Filter by document ID"),
    severity: Optional[ComplianceSeverity] = Query(None, description="Filter by severity"),
    status: Optional[FindingStatus] = Query(None, description="Filter by status"),
    limit: int = Query(50, ge=1, le=200),
):
    """Retrieves compliance findings (exposes endpoint for Reasoning & Retrieval inter-service querying)."""
    findings = await repository.search_findings(
        document_id=document_id,
        severity=severity,
        status=status,
        limit=limit,
    )
    return {
        "count": len(findings),
        "findings": findings,
    }


@router.patch("/findings/{finding_id}/status")
async def update_finding_status(finding_id: str, req: UpdateFindingStatusRequest):
    """Updates finding lifecycle status (OPEN -> UNDER_REVIEW -> RESOLVED)."""
    updated = await repository.update_finding_status(finding_id, req.status, reviewer=req.reviewer)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Finding '{finding_id}' not found.")
    return {
        "status": "success",
        "finding_id": finding_id,
        "new_status": updated.status.value,
        "reviewer": updated.reviewer,
    }


@router.get("/rules")
async def get_compliance_rules():
    """Lists all registered deterministic and semantic compliance rules."""
    rules = rule_engine.list_registered_rules()
    return {
        "count": len(rules),
        "rules": rules,
    }


@router.get("/scans")
async def get_scan_history(limit: int = Query(20, ge=1, le=100)):
    """Retrieves scan telemetry execution history."""
    scans = await repository.get_telemetry_history(limit=limit)
    return {
        "count": len(scans),
        "scans": scans,
    }


@router.get("/dashboard")
async def get_compliance_dashboard_overview():
    """Returns Executive Compliance Dashboard overview metrics."""
    all_findings = await repository.search_findings(limit=500)
    report = await report_tool.run(all_findings)

    scans = await repository.get_telemetry_history(limit=10)

    return {
        "service": "compliance-service",
        "agent_status": "OPERATIONAL",
        "compliance_score": report["compliance_score"],
        "compliance_status": report["status"],
        "total_findings": report["total_findings"],
        "severity_breakdown": report["breakdown"],
        "recent_scans": len(scans),
        "pending_reviews": len([f for f in all_findings if f.status == FindingStatus.OPEN]),
    }
