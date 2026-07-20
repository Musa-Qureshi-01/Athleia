import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from pydantic import BaseModel, Field
from app.agent.workflow import run_predictive_maintenance_analysis
from app.domain.models import MaintenanceFinding, EquipmentHealth, MaintenanceScanTelemetry, EvidenceItem
from app.domain.enums import RiskSeverity, FindingStatus, TriggerType, FailureCategory
from app.repositories.maintenance_repository import repository

router = APIRouter(prefix="/api/v1/maintenance", tags=["Maintenance Intelligence"])

class AnalyzeRequest(BaseModel):
    equipment_id: str = Field(..., example="PUMP-P101A")
    raw_content: Optional[str] = Field(None, example="Inspection report text...")
    trigger_type: Optional[TriggerType] = TriggerType.MANUAL_SCAN
    correlation_id: Optional[str] = None

@router.on_event("startup")
async def startup_event():
    await repository.init_db()

@router.post("/analyze", summary="Trigger Predictive Maintenance Analysis")
async def analyze_maintenance(req: AnalyzeRequest):
    """
    Triggers the LangGraph Predictive Maintenance Agent to analyze equipment records,
    evaluate failure patterns deterministically, invoke LLM reasoning, generate recommendations,
    and persist finding telemetry.
    """
    try:
        final_state = await run_predictive_maintenance_analysis(
            equipment_id=req.equipment_id,
            trigger_type=req.trigger_type.value if req.trigger_type else "MANUAL_SCAN",
            raw_content=req.raw_content,
            correlation_id=req.correlation_id,
        )

        finding_id = f"fnd_maint_{uuid.uuid4().hex[:8]}"
        ev_items = [
            EvidenceItem(
                verbatim_quote=e.get("verbatim_quote", ""),
                section_path=e.get("section_path"),
            )
            for e in final_state.get("evidence", [])
        ]

        finding = MaintenanceFinding(
            finding_id=finding_id,
            equipment_id=final_state["equipment_id"],
            asset_name=final_state["asset_name"],
            risk_score=final_state["risk_score"],
            failure_probability=final_state["failure_probability"],
            failure_category=FailureCategory.MECHANICAL_DEGRADATION,
            evidence=ev_items,
            historical_pattern=final_state["llm_reasoning_summary"],
            recommended_action=final_state["recommended_action"],
            estimated_priority=RiskSeverity(final_state["severity"]),
            confidence=final_state["confidence"],
            status=FindingStatus.OPEN,
            metadata={"analysis_id": final_state["analysis_id"]},
        )

        await repository.save_finding(finding)

        telemetry = MaintenanceScanTelemetry(
            analysis_id=final_state["analysis_id"],
            correlation_id=final_state["correlation_id"],
            trigger_type=TriggerType(final_state["trigger_type"]),
            equipment_id=final_state["equipment_id"],
            execution_time_ms=final_state["execution_time_ms"],
            token_usage=final_state["token_usage"],
            tools_used=final_state["tools_used"],
            risk_score=final_state["risk_score"],
            status="SUCCESS",
        )
        await repository.save_telemetry(telemetry)

        return {
            "analysis_id": final_state["analysis_id"],
            "finding_id": finding_id,
            "equipment_id": finding.equipment_id,
            "asset_name": finding.asset_name,
            "risk_score": finding.risk_score,
            "failure_probability": finding.failure_probability,
            "severity": finding.estimated_priority.value,
            "llm_reasoning_summary": final_state["llm_reasoning_summary"],
            "recommended_action": finding.recommended_action,
            "execution_time_ms": final_state["execution_time_ms"],
            "tools_used": final_state["tools_used"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Maintenance analysis error: {str(e)}")

@router.get("/findings", summary="List Predictive Maintenance Findings")
async def get_findings(
    equipment_id: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
):
    findings = await repository.get_findings(equipment_id=equipment_id, severity=severity, limit=limit)
    return {"count": len(findings), "findings": findings}

@router.get("/dashboard", summary="Maintenance Dashboard Overview Telemetry")
async def get_dashboard():
    summary = await repository.get_dashboard_summary()
    findings = await repository.get_findings(limit=10)
    summary["recent_findings"] = findings
    return summary

@router.get("/equipment/{equipment_id}/health", summary="Get Equipment Health & MTBF Index")
async def get_equipment_health(equipment_id: str):
    return {
        "equipment_id": equipment_id,
        "asset_name": f"Asset {equipment_id}",
        "health_index": 85.4,
        "last_maintenance_date": "2026-02-15T00:00:00Z",
        "next_recommended_date": "2026-05-15T00:00:00Z",
        "incident_count": 1,
        "mtbf_days": 180.0,
        "risk_rating": "MEDIUM",
    }

@router.get("/recommendations", summary="List Preventive Maintenance Recommendations")
async def get_recommendations():
    findings = await repository.get_findings(limit=20)
    recs = [
        {
            "finding_id": f["finding_id"],
            "equipment_id": f["equipment_id"],
            "asset_name": f["asset_name"],
            "recommended_action": f["recommended_action"],
            "priority": f["estimated_priority"],
            "risk_score": f["risk_score"],
        }
        for f in findings
    ]
    return {"count": len(recs), "recommendations": recs}
