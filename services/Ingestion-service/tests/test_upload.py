"""Integration tests for Document Upload API and Validation Engine.
"""

import pytest


@pytest.mark.asyncio
async def test_valid_pdf_upload_success(async_client):
    # Valid PDF bytes header
    pdf_content = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF"
    files = {"file": ("test_sop.pdf", pdf_content, "application/pdf")}

    response = await async_client.post("/api/v1/documents/upload", files=files)
    assert response.status_code == 202

    payload = response.json()
    assert payload["status"] == "success"
    data = payload["data"]
    assert "document_id" in data
    assert data["filename"] == "test_sop.pdf"
    assert data["processing_state"] == "Queued"

    # Query document status
    doc_id = data["document_id"]
    status_response = await async_client.get(f"/api/v1/documents/{doc_id}")
    assert status_response.status_code == 200
    status_payload = status_response.json()
    assert status_payload["data"]["filename"] == "test_sop.pdf"


@pytest.mark.asyncio
async def test_unsupported_extension_rejected(async_client):
    files = {"file": ("malicious_script.exe", b"MZ\x90\x00", "application/octet-stream")}
    response = await async_client.post("/api/v1/documents/upload", files=files)
    assert response.status_code == 400
    payload = response.json()
    assert payload["detail"]["error"]["code"] == "UNSUPPORTED_EXTENSION"


@pytest.mark.asyncio
async def test_mime_magic_bytes_spoofing_rejected(async_client):
    # Extension is .pdf but binary bytes are plain text
    files = {"file": ("spoofed.pdf", b"INVALID_NON_PDF_HEADER_TEXT", "application/pdf")}
    response = await async_client.post("/api/v1/documents/upload", files=files)
    assert response.status_code == 400
    payload = response.json()
    assert payload["detail"]["error"]["code"] == "MIME_MAGIC_MISMATCH"


@pytest.mark.asyncio
async def test_duplicate_upload_rejected(async_client):
    pdf_content = b"%PDF-1.4\nDuplicate Content Test\n%%EOF"
    files1 = {"file": ("drawing_v1.pdf", pdf_content, "application/pdf")}
    files2 = {"file": ("drawing_v1_copy.pdf", pdf_content, "application/pdf")}

    # First upload succeeds
    resp1 = await async_client.post("/api/v1/documents/upload", files=files1)
    assert resp1.status_code == 202

    # Second upload with identical SHA-256 hash fails with 409 Conflict
    resp2 = await async_client.post("/api/v1/documents/upload", files=files2)
    assert resp2.status_code == 409
    payload2 = resp2.json()
    assert payload2["detail"]["error"]["code"] == "DUPLICATE_DOCUMENT"
