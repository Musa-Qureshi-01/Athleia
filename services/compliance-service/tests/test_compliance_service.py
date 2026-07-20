"""Pytest Test Suite for Compliance Intelligence Service.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.domain.enums import ComplianceSeverity, FindingStatus, RuleCategory
from app.rules.rule_engine import rule_engine
from app.llm.factory import llm_factory
from app.agent.workflow import compliance_agent


@pytest.mark.asyncio
async def test_health_check_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "healthy"
        assert data["service"] == "compliance-service"
        assert data["port"] == 8006


@pytest.mark.asyncio
async def test_deterministic_rule_engine_missing_metadata():
    findings = rule_engine.evaluate_all("doc_test_01", "Sample content", metadata={})
    assert len(findings) > 0
    meta_findings = [f for f in findings if f.rule_violated == "RULE-META-001"]
    assert len(meta_findings) == 1
    assert meta_findings[0].is_deterministic is True
    assert meta_findings[0].confidence == 1.0


@pytest.mark.asyncio
async def test_deterministic_rule_engine_expired_sop():
    metadata = {
        "author": "Process Lead",
        "domain": "Industrial Operations",
        "version": "1.0.0",
        "expiry_date": "2020-01-01T00:00:00Z",
    }
    findings = rule_engine.evaluate_all("doc_test_02", "Sample content", metadata=metadata)
    exp_findings = [f for f in findings if f.rule_violated == "RULE-EXP-002"]
    assert len(exp_findings) == 1
    assert exp_findings[0].severity in (ComplianceSeverity.HIGH, ComplianceSeverity.MEDIUM)


@pytest.mark.asyncio
async def test_deterministic_rule_engine_missing_safety():
    metadata = {
        "author": "Process Lead",
        "domain": "Industrial Operations",
        "version": "1.0.0",
        "category": "SOP",
    }
    findings = rule_engine.evaluate_all("doc_test_03", "Standard operating text without PPE.", metadata=metadata)
    sec_findings = [f for f in findings if f.rule_violated == "RULE-SEC-004"]
    assert len(sec_findings) == 1
    assert sec_findings[0].severity == ComplianceSeverity.CRITICAL


@pytest.mark.asyncio
async def test_pluggable_llm_factory():
    provider = llm_factory.get_provider("openai")
    assert provider.provider_name == "openai"

    provider_anthropic = llm_factory.get_provider("anthropic")
    assert provider_anthropic.provider_name == "anthropic"


@pytest.mark.asyncio
async def test_compliance_agent_workflow():
    state = await compliance_agent.run_scan(
        document_id="doc_test_agent_01",
        content="Pump P-101A SOP text. Verify PT-101 pressure.",
        metadata={"category": "SOP"},
    )

    assert state.scan_id.startswith("scn_")
    assert len(state.all_findings) > 0
    assert state.telemetry is not None
    assert state.telemetry.rules_evaluated > 0


@pytest.mark.asyncio
async def test_api_trigger_scan_and_dashboard():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Trigger scan
        res_scan = await client.post(
            "/api/v1/compliance/scan",
            json={
                "document_id": "doc_api_01",
                "content": "Emergency runbook for station 101.",
                "metadata": {"category": "SOP"},
            },
        )
        assert res_scan.status_code == 200
        scan_data = res_scan.json()
        assert scan_data["status"] == "success"
        assert len(scan_data["findings"]) > 0

        # Query findings
        res_findings = await client.get("/api/v1/compliance/findings?document_id=doc_api_01")
        assert res_findings.status_code == 200
        assert res_findings.json()["count"] > 0

        # Query rules
        res_rules = await client.get("/api/v1/compliance/rules")
        assert res_rules.status_code == 200
        assert res_rules.json()["count"] >= 4

        # Query Dashboard
        res_dash = await client.get("/api/v1/compliance/dashboard")
        assert res_dash.status_code == 200
        dash_data = res_dash.json()
        assert dash_data["agent_status"] == "OPERATIONAL"
        assert "compliance_score" in dash_data
