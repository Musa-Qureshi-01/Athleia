"""Integration test for Reasoning REST API endpoint.
"""

import pytest


@pytest.mark.asyncio
async def test_reason_endpoint_returns_grounded_response(async_client):
    payload = {
        "query": "What is the suction pressure for Pump P-101A monitored by Pressure Transmitter PT-101?",
        "allow_external_knowledge": False
    }

    response = await async_client.post("/api/v1/reason", json=payload)
    assert response.status_code == 200
    data = response.json()["data"]

    assert data["user_query"] == payload["query"]
    assert len(data["grounded_answer"]) > 0
    assert data["evaluation"]["overall_confidence"] >= 0.70
    assert len(data["citations"]) > 0
    assert data["citations"][0]["source_name"] == "PND-4012_PUMP_STATION_PID.pdf"
