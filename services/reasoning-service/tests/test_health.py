"""Integration test for Reasoning Service health check.
"""

import pytest


@pytest.mark.asyncio
async def test_reasoning_health_check_returns_200(async_client):
    response = await async_client.get("/api/v1/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "success"
    assert payload["data"]["status"] == "UP"
    assert payload["data"]["external_tools_enabled"] is False
