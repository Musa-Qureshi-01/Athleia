"""Search & Knowledge Retrieval API Endpoints for Athleia Retrieval Service.
"""

import time
import uuid
from fastapi import APIRouter, Depends, Header, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import logger
from app.db.database import get_db
from app.db.models import SearchAuditRecord
from app.schemas.response import APISuccessResponse
from app.schemas.search import SearchRequest, SearchResponseData
from app.services.reranker import ResultReranker
from app.services.retriever import hybrid_retriever

router = APIRouter()


@router.post("/search", response_model=APISuccessResponse[SearchResponseData])
async def search_knowledge(
    request: Request,
    payload: SearchRequest,
    db: AsyncSession = Depends(get_db),
    x_tenant_id: str | None = Header(None)
):
    """Retrieves relevant knowledge using Dense Vector, Sparse BM25, or Hybrid RRF Fusion."""
    request_id = getattr(request.state, "request_id", f"req_{uuid.uuid4().hex[:8]}")
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    search_id = f"sch_{uuid.uuid4().hex[:12]}"

    start_time = time.time()

    # 1. Execute Retrieval Engine
    raw_results = await hybrid_retriever.retrieve(db, payload, tenant_id=tenant_id)

    # 2. Execute Result Reranker & Citation Provider
    results = ResultReranker.rerank(payload.query, raw_results)

    duration_ms = int((time.time() - start_time) * 1000)

    # Log Search Telemetry Audit Record
    audit_rec = SearchAuditRecord(
        search_id=search_id,
        tenant_id=tenant_id,
        query=payload.query,
        search_type=payload.search_type.value,
        results_count=len(results),
        duration_ms=duration_ms
    )
    db.add(audit_rec)
    await db.flush()

    logger.info(
        "search_query_executed",
        search_id=search_id,
        query=payload.query,
        search_type=payload.search_type.value,
        results_count=len(results),
        duration_ms=duration_ms
    )

    data = SearchResponseData(
        query=payload.query,
        search_type=payload.search_type.value,
        total_results=len(results),
        execution_time_ms=duration_ms,
        results=results
    )

    return APISuccessResponse(
        status="success",
        message=f"Retrieved {len(results)} relevant knowledge chunks via {payload.search_type.value} search.",
        data=data,
        request_id=request_id
    )
