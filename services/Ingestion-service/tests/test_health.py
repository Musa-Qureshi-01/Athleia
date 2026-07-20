"""Integration tests for Health Check endpoint.
"""

import pytest


@pytest.mark.asyncio
async def test_health_check_returns_200(async_client):
    response = await async_client.get("/api/v1/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "success"
    assert "data" in payload
    assert payload["data"]["status"] == "UP"
    assert "X-Request-ID" in response.headers
