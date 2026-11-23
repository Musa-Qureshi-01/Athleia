"""Integration test for HybridRetriever.
"""

import pytest
from app.schemas.search import IndexDocumentRequest, SearchFilters, SearchRequest, SearchType
from app.services.index_manager import index_manager
from app.services.retriever import hybrid_retriever


@pytest.mark.asyncio
async def test_hybrid_retriever_dense_sparse_and_rrf_fusion(get_db_session):
    # Index sample document first
    doc_req = IndexDocumentRequest(
        document_id="doc_test_retrieval_01",
        logical_document_id="log_retrieval_01",
        filename="PND-4012_PUMP_STATION.pdf",
        file_hash="hash_retrieval_01",
        mime_type="application/pdf",
        size_bytes=2048,
        metadata={"category": "ENGINEERING", "equipment_references": ["P-101A", "PT-101"]},
        chunks=[
            {"chunk_id": "chk_01", "content": "Centrifugal Pump P-101A monitored by Pressure Transmitter PT-101", "page_number": 1, "section_path": "Title Block"},
            {"chunk_id": "chk_02", "content": "Storage Tank TK-201 feeds Pump P-101A suction line 6-CW-101-CS150", "page_number": 1, "section_path": "Piping Details"}
        ]
    )

    await index_manager.index_document(get_db_session, doc_req)

    # 1. Test Dense Vector Search
    req_dense = SearchRequest(query="Pressure Transmitter PT-101", search_type=SearchType.DENSE, top_k=2)
    dense_res = await hybrid_retriever.retrieve(get_db_session, req_dense)
    assert len(dense_res) > 0
    assert dense_res[0].source_type == "DENSE"

    # 2. Test Sparse BM25 Search
    req_sparse = SearchRequest(query="Storage Tank TK-201", search_type=SearchType.SPARSE, top_k=2)
    sparse_res = await hybrid_retriever.retrieve(get_db_session, req_sparse)
    assert len(sparse_res) > 0
    assert sparse_res[0].source_type == "SPARSE"

    # 3. Test Hybrid RRF Search
    req_hybrid = SearchRequest(query="Pump P-101A PT-101", search_type=SearchType.HYBRID, top_k=2)
    hybrid_res = await hybrid_retriever.retrieve(get_db_session, req_hybrid)
    assert len(hybrid_res) > 0
    assert hybrid_res[0].source_type == "HYBRID_RRF"
