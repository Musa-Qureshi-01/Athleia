import pytest
import asyncio
from fastapi.testclient import TestClient
from app.main import app
from app.engine.pattern_engine import DeterministicPatternEngine
from app.tools.maintenance_tools import EquipmentLookupTool, MaintenanceHistoryTool
from app.agent.workflow import run_predictive_maintenance_analysis
from app.repositories.maintenance_repository import repository
from app.domain.models import MaintenanceFinding
from app.domain.enums import RiskSeverity, FailureCategory, FindingStatus

client = TestClient(app)

@pytest.fixture(autouse=True, scope="module")
def setup_database():
    asyncio.run(repository.init_db())

def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["status"] == "healthy"
    assert "Maintenance" in json_data["service"]

def test_deterministic_pattern_engine():
    engine = DeterministicPatternEngine()
    records = [
        {"event_type": "UNPLANNED_OUTAGE", "description": "Drive bearing failure"},
        {"event_type": "UNPLANNED_OUTAGE", "description": "Seal leakage"},
        {"event_type": "UNPLANNED_OUTAGE", "description": "Impeller cavitation"},
    ]
    incidents = [{"summary": "Suction pressure loss"}]
    
    result = engine.evaluate("PUMP-P101A", "Primary Cooling Water Pump P-101A", records, incidents)
    assert result.risk_score >= 60.0
    assert result.recommended_priority in [RiskSeverity.CRITICAL, RiskSeverity.HIGH]
    assert len(result.detected_patterns) > 0

def test_maintenance_tools():
    eq_tool = EquipmentLookupTool()
    eq = eq_tool.execute("PUMP-P101A")
    assert eq["equipment_id"] == "PUMP-P101A"
    assert "Centrifugal" in eq["model"]

    hist_tool = MaintenanceHistoryTool()
    hist = hist_tool.execute("PUMP-P101A")
    assert len(hist) > 0

@pytest.mark.asyncio
async def test_agent_workflow():
    state = await run_predictive_maintenance_analysis("PUMP-P101A", trigger_type="MANUAL_SCAN")
    assert state["status"] == "COMPLETED"
    assert state["equipment_id"] == "PUMP-P101A"
    assert state["risk_score"] > 0.0
    assert len(state["tools_used"]) >= 4

def test_rest_api_analyze():
    payload = {
        "equipment_id": "PUMP-P101A",
        "raw_content": "Vibration check: 5.2 mm/s recorded on drive bearing housing.",
        "trigger_type": "MANUAL_SCAN"
    }
    res = client.post("/api/v1/maintenance/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "finding_id" in data
    assert data["equipment_id"] == "PUMP-P101A"
    assert data["risk_score"] > 0.0
    assert "tools_used" in data

def test_rest_api_dashboard_and_findings():
    res_dash = client.get("/api/v1/maintenance/dashboard")
    assert res_dash.status_code == 200
    dash = res_dash.json()
    assert "agent_status" in dash
    assert dash["agent_status"] == "OPERATIONAL"

    res_fnd = client.get("/api/v1/maintenance/findings")
    assert res_fnd.status_code == 200
    fnd = res_fnd.json()
    assert "findings" in fnd
