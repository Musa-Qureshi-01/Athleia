"""Integration test for IndexManager.
"""

import pytest
from app.schemas.search import IndexDocumentRequest
from app.services.index_manager import index_manager


@pytest.mark.asyncio
async def test_index_document_creates_vector_and_bm25_records(get_db_session):
    doc_req = IndexDocumentRequest(
        document_id="doc_test_index_01",
        logical_document_id="log_doc_test_01",
        filename="SOP_PUMP_MAINTENANCE.pdf",
        file_hash="hash_index_01",
        mime_type="application/pdf",
        size_bytes=1024,
        metadata={"category": "TECHNICAL", "equipment_references": ["P-101A", "PT-101"]},
        chunks=[
            {"chunk_id": "chk_001", "content": "Centrifugal Pump P-101A is monitored by Pressure Transmitter PT-101", "page_number": 1, "section_path": "Root > SOP"},
            {"chunk_id": "chk_002", "content": "Check oil level and seal flush line 6-CW-101-CS150", "page_number": 2, "section_path": "Root > Maintenance Steps"}
        ]
    )

    res = await index_manager.index_document(get_db_session, doc_req)
    assert res["status"] == "INDEXED"
    assert res["chunks_indexed"] == 2
