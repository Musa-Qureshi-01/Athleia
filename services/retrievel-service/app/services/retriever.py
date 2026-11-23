"""Hybrid Retrieval Engine implementing Dense Vector Search, Sparse BM25 Search, and RRF Fusion.
"""

from typing import Dict, List
from rank_bm25 import BM25Okapi
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.models import BM25IndexRecord, VectorIndexRecord
from app.schemas.search import SearchFilters, SearchRequest, SearchResultItem, SearchType
from app.services.embedding_manager import embedding_manager
from app.services.index_manager import IndexManager


class HybridRetriever:
    """Retrieves document knowledge using Dense Vector Search, Sparse BM25 Search, and RRF Fusion."""

    @classmethod
    async def retrieve(cls, db: AsyncSession, req: SearchRequest, tenant_id: str = "default_tenant") -> List[SearchResultItem]:
        """Dispatches retrieval based on requested SearchType (DENSE, SPARSE, or HYBRID)."""
        if req.search_type == SearchType.DENSE:
            return await cls.search_dense(db, req, tenant_id)
        elif req.search_type == SearchType.SPARSE:
            return await cls.search_sparse(db, req, tenant_id)
        else:
            return await cls.search_hybrid(db, req, tenant_id)

    @classmethod
    async def search_dense(cls, db: AsyncSession, req: SearchRequest, tenant_id: str) -> List[SearchResultItem]:
        """Performs dense vector similarity search using Cosine Similarity."""
        query_vec = embedding_manager.encode_text(req.query)

        stmt = select(VectorIndexRecord).where(VectorIndexRecord.tenant_id == tenant_id)
        stmt = cls._apply_filters_vector(stmt, req.filters)

        result = await db.execute(stmt)
        records = result.scalars().all()

        scored_items: List[SearchResultItem] = []
        for rec in records:
            score = embedding_manager.cosine_similarity(query_vec, rec.embedding_json)
            if score > 0.01:
                metadata = rec.metadata_json or {}
                scored_items.append(
                    SearchResultItem(
                        chunk_id=rec.chunk_id,
                        document_id=rec.document_id,
                        logical_document_id=rec.logical_document_id,
                        score=round(score, 4),
                        content=rec.content,
                        page_number=rec.page_number,
                        section_path=rec.section_path,
                        metadata=metadata,
                        evidence=f"Semantic Vector Match (Score: {score:.2f})",
                        source_type="DENSE"
                    )
                )

        scored_items.sort(key=lambda x: x.score, reverse=True)
        return scored_items[:req.top_k]

    @classmethod
    async def search_sparse(cls, db: AsyncSession, req: SearchRequest, tenant_id: str) -> List[SearchResultItem]:
        """Performs sparse BM25 keyword search."""
        query_tokens = IndexManager.tokenize(req.query)
        if not query_tokens:
            return []

        stmt = select(BM25IndexRecord).where(BM25IndexRecord.tenant_id == tenant_id)
        stmt = cls._apply_filters_bm25(stmt, req.filters)

        result = await db.execute(stmt)
        records = result.scalars().all()

        if not records:
            return []

        corpus_tokens = [rec.tokens_json for rec in records]
        bm25 = BM25Okapi(corpus_tokens)
        scores = bm25.get_scores(query_tokens)

        scored_items: List[SearchResultItem] = []
        for idx, rec in enumerate(records):
            score = float(scores[idx])
            if score > 0.001:
                metadata = rec.metadata_json or {}
                scored_items.append(
                    SearchResultItem(
                        chunk_id=rec.chunk_id,
                        document_id=rec.document_id,
                        logical_document_id=rec.logical_document_id,
                        score=round(score, 4),
                        content=rec.content,
                        page_number=1,
                        section_path="Root",
                        metadata=metadata,
                        evidence=f"Sparse BM25 Keyword Match (Score: {score:.2f})",
                        source_type="SPARSE"
                    )
                )

        scored_items.sort(key=lambda x: x.score, reverse=True)
        return scored_items[:req.top_k]

    @classmethod
    async def search_hybrid(cls, db: AsyncSession, req: SearchRequest, tenant_id: str) -> List[SearchResultItem]:
        """Performs Hybrid Search fusing Dense and Sparse rankings via Reciprocal Rank Fusion (RRF)."""
        # Retrieve candidate lists for both modalities
        req_dense = req.model_copy(update={"top_k": req.top_k * 2})
        req_sparse = req.model_copy(update={"top_k": req.top_k * 2})

        dense_results = await cls.search_dense(db, req_dense, tenant_id)
        sparse_results = await cls.search_sparse(db, req_sparse, tenant_id)

        rrf_scores: Dict[str, float] = {}
        item_map: Dict[str, SearchResultItem] = {}
        k_const = settings.DEFAULT_RRF_K

        # Accumulate RRF scores for Dense results
        for rank, item in enumerate(dense_results):
            rrf_scores[item.chunk_id] = rrf_scores.get(item.chunk_id, 0.0) + (1.0 / (k_const + rank + 1))
            item_map[item.chunk_id] = item

        # Accumulate RRF scores for Sparse results
        for rank, item in enumerate(sparse_results):
            rrf_scores[item.chunk_id] = rrf_scores.get(item.chunk_id, 0.0) + (1.0 / (k_const + rank + 1))
            if item.chunk_id not in item_map:
                item_map[item.chunk_id] = item

        # Build fused result list
        fused_items: List[SearchResultItem] = []
        for chunk_id, rrf_score in rrf_scores.items():
            base_item = item_map[chunk_id]
            fused_item = base_item.model_copy()
            fused_item.score = round(rrf_score, 5)
            fused_item.source_type = "HYBRID_RRF"
            fused_item.evidence = f"Hybrid RRF Fused Match (RRF Score: {rrf_score:.5f})"
            fused_items.append(fused_item)

        fused_items.sort(key=lambda x: x.score, reverse=True)
        return fused_items[:req.top_k]

    @staticmethod
    def _apply_filters_vector(stmt, filters: SearchFilters):
        if not filters:
            return stmt
        if filters.document_id:
            stmt = stmt.where(VectorIndexRecord.document_id == filters.document_id)
        if filters.logical_document_id:
            stmt = stmt.where(VectorIndexRecord.logical_document_id == filters.logical_document_id)
        return stmt

    @staticmethod
    def _apply_filters_bm25(stmt, filters: SearchFilters):
        if not filters:
            return stmt
        if filters.document_id:
            stmt = stmt.where(BM25IndexRecord.document_id == filters.document_id)
        if filters.logical_document_id:
            stmt = stmt.where(BM25IndexRecord.logical_document_id == filters.logical_document_id)
        return stmt


hybrid_retriever = HybridRetriever()
