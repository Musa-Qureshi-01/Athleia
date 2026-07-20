"""Integration tests for Document Classification, Pipeline Router, and Knowledge Normalization.
"""

import pytest
from app.domain.taxonomy import DocumentCategory, DocumentSubtype
from app.services.classifier import DocumentClassifier


def test_classifier_engineering_p_and_id():
    filename = "PND-4012_PUMP_STATION_PID.pdf"
    content = b"%PDF-1.4\nPiping & Instrumentation Diagram for Centrifugal Pump P-101A and PT-101\n%%EOF"
    res = DocumentClassifier.classify(filename, "application/pdf", content)

    assert res.category == DocumentCategory.ENGINEERING
    assert res.subtype == DocumentSubtype.P_AND_ID
    assert res.strategy == "ENGINEERING_PIPELINE"


def test_classifier_technical_sop():
    filename = "SOP_PUMP_MAINTENANCE_2026.pdf"
    content = b"%PDF-1.4\nStandard Operating Procedure for Maintenance Activities\n%%EOF"
    res = DocumentClassifier.classify(filename, "application/pdf", content)

    assert res.category == DocumentCategory.TECHNICAL
    assert res.subtype == DocumentSubtype.SOP
    assert res.strategy == "TEXT_PIPELINE"


@pytest.mark.asyncio
async def test_upload_and_retrieve_normalized_document(async_client):
    content = b"%PDF-1.4\n1. Introduction\nStandard Operating Procedure for Centrifugal Pump P-101A monitored by Pressure Transmitter PT-101.\n%%EOF"
    files = {"file": ("SOP_PND_101.pdf", content, "application/pdf")}

    response = await async_client.post("/api/v1/documents/upload", files=files)
    assert response.status_code == 202
    doc_id = response.json()["data"]["document_id"]

    # Retrieve normalized representation
    norm_resp = await async_client.get(f"/api/v1/documents/{doc_id}/normalized")
    assert norm_resp.status_code == 200
    norm_data = norm_resp.json()["data"]

    assert norm_data["filename"] == "SOP_PND_101.pdf"
    assert "metadata" in norm_data
    assert len(norm_data["chunks"]) > 0
    assert len(norm_data["entities"]) > 0

    # Verify extracted entities
    entity_names = [e["name"] for e in norm_data["entities"]]
    assert "P-101A" in entity_names or "PT-101" in entity_names
