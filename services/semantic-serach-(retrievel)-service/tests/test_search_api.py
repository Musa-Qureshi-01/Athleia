"""Integration tests for Indexing and Search API endpoints.
"""

import pytest


@pytest.mark.asyncio
async def test_index_and_search_end_to_end_api(async_client):
    # 1. Index document via POST /api/v1/index
    index_payload = {
        "document_id": "doc_api_test_01",
        "logical_document_id": "log_api_test_01",
        "filename": "PND-4012_PUMP_STATION_PID.pdf",
        "file_hash": "hash_api_01",
        "mime_type": "application/pdf",
        "size_bytes": 1024,
        "metadata": {
            "category": "ENGINEERING",
            "subtype": "P_AND_ID",
            "equipment_references": ["P-101A", "PT-101"]
        },
        "chunks": [
            {
                "chunk_id": "chk_api_01",
                "content": "Centrifugal Pump P-101A is monitored by Pressure Transmitter PT-101.",
                "page_number": 1,
                "section_path": "P&ID Canvas"
            },
            {
                "chunk_id": "chk_api_02",
                "content": "Emergency Valve VLV-302 controls cooling water line 6-CW-101-CS150.",
                "page_number": 1,
                "section_path": "Piping Details"
            }
        ]
    }

    index_resp = await async_client.post("/api/v1/index", json=index_payload)
    assert index_resp.status_code == 201
    assert index_resp.json()["status"] == "success"

    # 2. Search knowledge via POST /api/v1/search
    search_payload = {
        "query": "Pressure Transmitter PT-101 pump monitoring",
        "search_type": "HYBRID",
        "top_k": 5
    }

    search_resp = await async_client.post("/api/v1/search", json=search_payload)
    assert search_resp.status_code == 200
    search_data = search_resp.json()["data"]

    assert search_data["total_results"] > 0
    assert search_data["results"][0]["chunk_id"] == "chk_api_01"
    assert "P-101A" in search_data["results"][0]["content"]

    # 3. Purge index via DELETE /api/v1/index/{document_id}
    purge_resp = await async_client.delete("/api/v1/index/doc_api_test_01")
    assert purge_resp.status_code == 200
    assert purge_resp.json()["data"]["status"] == "PURGED"
