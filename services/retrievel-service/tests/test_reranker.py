"""Unit test for ResultReranker.
"""

import pytest
from app.schemas.search import SearchResultItem
from app.services.reranker import ResultReranker


def test_reranker_boosts_equipment_tag_exact_matches():
    query = "Check pressure transmitter PT-101 on pump P-101A"
    items = [
        SearchResultItem(
            chunk_id="chk_01",
            document_id="doc_1",
            logical_document_id="log_1",
            score=0.50,
            content="General overview of water treatment plant",
            page_number=1,
            metadata={"filename": "overview.pdf"}
        ),
        SearchResultItem(
            chunk_id="chk_02",
            document_id="doc_2",
            logical_document_id="log_2",
            score=0.48,
            content="Pump P-101A is monitored by Pressure Transmitter PT-101.",
            page_number=2,
            metadata={"filename": "sop_drawing.pdf"}
        )
    ]

    reranked = ResultReranker.rerank(query, items)
    assert reranked[0].chunk_id == "chk_02"
    assert reranked[0].score > 0.48
    assert "sop_drawing.pdf" in reranked[0].evidence
