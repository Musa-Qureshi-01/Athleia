"""Reasoning REST API Endpoint for Athleia Reasoning Service.
"""

import time
import uuid
from fastapi import APIRouter, Depends, Header, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import logger
from app.db.database import get_db
from app.db.models import ReasoningSessionRecord, ReasoningTraceRecord
from app.schemas.reasoning import ReasoningRequest, ReasoningResponseData
from app.schemas.response import APISuccessResponse
from app.services.evaluator import grounding_evaluator
from app.services.evidence_collector import evidence_collector
from app.services.reasoning_engine import reasoning_engine
from app.services.tool_orchestrator import tool_orchestrator

router = APIRouter()


@router.post("/reason", response_model=APISuccessResponse[ReasoningResponseData])
async def reason_over_knowledge(
    request: Request,
    payload: ReasoningRequest,
    db: AsyncSession = Depends(get_db),
    x_tenant_id: str | None = Header(None)
):
    """Executes full 12-step Grounded Reasoning Pipeline over enterprise knowledge."""
    request_id = getattr(request.state, "request_id", f"req_{uuid.uuid4().hex[:8]}")
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    session_id = payload.session_id or f"ses_{uuid.uuid4().hex[:12]}"
    start_time = time.time()

    # 1. Determine Tool Execution Pipeline
    tools_selected = tool_orchestrator.determine_tool_pipeline(
        payload.query, allow_external=payload.allow_external_knowledge
    )

    # 2. Collect & Rank Verified Evidence
    evidence_items = await evidence_collector.collect_evidence(
        query=payload.query,
        allow_external_knowledge=payload.allow_external_knowledge,
        filters=payload.filters,
        tenant_id=tenant_id
    )

    # 3. Generate Grounded Answer & Citations
    grounded_answer, citations, intent_cat, sources_used = await reasoning_engine.generate_grounded_answer(
        payload.query, evidence_items
    )

    # 4. Evaluate Answer Grounding & Faithfulness
    eval_scores = grounding_evaluator.evaluate(payload.query, grounded_answer, evidence_items)

    duration_ms = int((time.time() - start_time) * 1000)

    # 5. Persist Session & Trace Audit Records into Neon PostgreSQL
    session_rec = ReasoningSessionRecord(
        session_id=session_id,
        tenant_id=tenant_id,
        user_query=payload.query,
        intent_category=intent_cat,
        grounded_answer=grounded_answer,
        confidence_score=eval_scores.overall_confidence,
        has_external_knowledge="TRUE" if payload.allow_external_knowledge else "FALSE"
    )

    trace_rec = ReasoningTraceRecord(
        session_id=session_id,
        tenant_id=tenant_id,
        step_name="COMPLETE_REASONING_PIPELINE",
        knowledge_priority_used="PRIORITY_1_ENTERPRISE",
        tools_executed=tools_selected,
        evidence_json=[e.model_dump() for e in evidence_items],
        citations_json=[c.model_dump() for c in citations],
        evaluation_scores=eval_scores.model_dump(),
        duration_ms=duration_ms
    )

    try:
        db.add(session_rec)
        db.add(trace_rec)
        await db.flush()
    except Exception as e:
        logger.warning("reasoning_audit_persistence_warning", error=str(e))
        await db.rollback()

    logger.info(
        "reasoning_query_completed",
        session_id=session_id,
        intent=intent_cat,
        confidence=eval_scores.overall_confidence,
        citations_count=len(citations),
        duration_ms=duration_ms
    )

    data = ReasoningResponseData(
        session_id=session_id,
        user_query=payload.query,
        intent_category=intent_cat,
        grounded_answer=grounded_answer,
        evaluation=eval_scores,
        citations=citations,
        evidence_summary=evidence_items,
        knowledge_sources_used=sources_used,
        execution_trace=[{
            "tools_executed": tools_selected,
            "duration_ms": duration_ms,
            "knowledge_priority_strategy": "PRIORITY_1_ENTERPRISE"
        }]
    )

    return APISuccessResponse(
        status="success",
        message="Grounded AI reasoning response generated successfully.",
        data=data,
        request_id=request_id
    )
