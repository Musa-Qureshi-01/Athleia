"""Vector & BM25 Index Manager for Athleia Retrieval Service.

Manages indexing of NormalizedDocument chunks into VectorIndexRecord and BM25IndexRecord tables.
"""

import re
from typing import Any, Dict, List
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import logger
from app.db.models import BM25IndexRecord, VectorIndexRecord
from app.schemas.search import IndexDocumentRequest
from app.services.embedding_manager import embedding_manager


class IndexManager:
    """Indexes document chunks into Dense Vector Store and Sparse BM25 Keyword Store."""

    @staticmethod
    def tokenize(text: str) -> List[str]:
        """Lowercases and tokenizes text for BM25 keyword matching."""
        return [word.lower() for word in re.findall(r"\w+", text) if len(word) > 1]

    @classmethod
    async def index_document(cls, db: AsyncSession, req: IndexDocumentRequest, tenant_id: str = "default_tenant") -> Dict[str, Any]:
        """Indexes all chunks of a NormalizedDocument into Vector and BM25 database tables."""
        # 1. Clear existing index records for this document_id (Idempotent re-indexing)
        await cls.delete_document_indexes(db, req.document_id)

        chunks_indexed = 0
        vector_records = []
        bm25_records = []

        metadata_payload = {
            "filename": req.filename,
            "mime_type": req.mime_type,
            "category": req.metadata.get("category"),
            "subtype": req.metadata.get("subtype"),
            "equipment_references": req.metadata.get("equipment_references", []),
            "document_number": req.metadata.get("document_number"),
            "revision": req.metadata.get("revision"),
        }

        for chunk_data in req.chunks:
            chunk_id = chunk_data.get("chunk_id", f"chk_{chunks_indexed+1:03d}")
            content = chunk_data.get("content", "")
            page_number = chunk_data.get("page_number", 1)
            section_path = chunk_data.get("section_path", "Root")

            if not content.strip():
                continue

            # 2. Generate Dense Embedding Vector
            embedding = embedding_manager.encode_text(content)

            vector_rec = VectorIndexRecord(
                chunk_id=chunk_id,
                document_id=req.document_id,
                logical_document_id=req.logical_document_id,
                tenant_id=tenant_id,
                page_number=page_number,
                section_path=section_path,
                content=content,
                embedding_json=embedding,
                metadata_json=metadata_payload
            )
            vector_records.append(vector_rec)

            # 3. Generate Sparse BM25 Token List
            tokens = cls.tokenize(content)
            bm25_rec = BM25IndexRecord(
                chunk_id=chunk_id,
                document_id=req.document_id,
                logical_document_id=req.logical_document_id,
                tenant_id=tenant_id,
                content=content,
                tokens_json=tokens,
                metadata_json=metadata_payload
            )
            bm25_records.append(bm25_rec)

            chunks_indexed += 1

        db.add_all(vector_records)
        db.add_all(bm25_records)
        await db.flush()

        logger.info(
            "document_indexed_successfully",
            document_id=req.document_id,
            chunks_indexed=chunks_indexed,
            tenant_id=tenant_id
        )

        return {
            "document_id": req.document_id,
            "logical_document_id": req.logical_document_id,
            "chunks_indexed": chunks_indexed,
            "status": "INDEXED"
        }

    @classmethod
    async def delete_document_indexes(cls, db: AsyncSession, document_id: str) -> None:
        """Removes all vector and BM25 index records for a given document_id."""
        await db.execute(delete(VectorIndexRecord).where(VectorIndexRecord.document_id == document_id))
        await db.execute(delete(BM25IndexRecord).where(BM25IndexRecord.document_id == document_id))
        await db.flush()


index_manager = IndexManager()
