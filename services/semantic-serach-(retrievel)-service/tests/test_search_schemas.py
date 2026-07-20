"""Unit test for Search & Retrieval Data Models.
"""

import pytest
from app.schemas.search import SearchFilters, SearchRequest, SearchResponseData, SearchResultItem, SearchType


def test_search_request_schema_validation():
    req = SearchRequest(
        query="Centrifugal pump P-101A maintenance procedure",
        search_type=SearchType.HYBRID,
        top_k=5,
        filters=SearchFilters(category="ENGINEERING", equipment_references=["P-101A"])
    )

    assert req.query == "Centrifugal pump P-101A maintenance procedure"
    assert req.search_type == SearchType.HYBRID
    assert req.top_k == 5
    assert req.filters.category == "ENGINEERING"
    assert "P-101A" in req.filters.equipment_references


def test_search_result_item_schema():
    item = SearchResultItem(
        chunk_id="chk_001",
        document_id="doc_123",
        logical_document_id="log_doc_123",
        score=0.92,
        content="Pump P-101A monitored by PT-101",
        page_number=1,
        section_path="Main Content",
        metadata={"filename": "drawing.pdf"},
        source_type="HYBRID_RRF"
    )

    assert item.score == 0.92
    assert item.source_type == "HYBRID_RRF"
