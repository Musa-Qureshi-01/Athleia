"""Integration test for Retrieval Service health check.
"""

import pytest


@pytest.mark.asyncio
async def test_retrieval_health_check_returns_200(async_client):
    response = await async_client.get("/api/v1/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "success"
    assert payload["data"]["status"] == "UP"
    assert "BAAI/bge-small-en-v1.5" in payload["data"]["embedding_model"]
