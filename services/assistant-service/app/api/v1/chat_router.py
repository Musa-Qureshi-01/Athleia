import json
import asyncio
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from app.core.security import parse_user_token, UserIdentity
from app.schemas.chat import ChatMessageCreate, ChatResponse, CitationSchema, ToolCallAuditSchema
from app.agent.state import AssistantState
from app.agent.workflow import workflow_engine
from app.conversation.manager import conversation_manager
from app.conversation.title_generator import title_generator
from app.repositories.assistant_repository import repository
from app.core.metrics import metrics_tracker
from app.core.logging import logger

router = APIRouter(prefix="/chat", tags=["Assistant Chat Operations"])

@router.post("", response_model=ChatResponse, summary="Synchronous Chat Completion")
async def chat_completion(
    req: ChatMessageCreate,
    user: UserIdentity = Depends(parse_user_token)
):
    # 1. Resolve or Create Conversation
    cid = req.conversation_id
    if not cid:
        title = title_generator.generate_title(req.message)
        conv = await conversation_manager.create_chat(user.user_id, initial_title=title)
        cid = conv["conversation_id"]
    else:
        existing = await conversation_manager.get_chat(cid, user.user_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Conversation not found or unauthorized.")

    # 2. Retrieve Conversation History
    chat_detail = await conversation_manager.get_chat(cid, user.user_id)
    history = [{"role": m["role"], "content": m["content"]} for m in chat_detail.get("messages", [])]
    history.append({"role": "user", "content": req.message})

    # Save incoming user message
    await repository.save_message(conversation_id=cid, role="user", content=req.message)

    # 3. Construct Graph State & Run Workflow
    initial_state = AssistantState(
        user_id=user.user_id,
        user_role=user.role,
        user_permissions=user.permissions,
        conversation_id=cid,
        messages=history,
        mode=req.mode,
        explanation_style=req.explanation_style,
        selected_model_name=req.model,
        allow_external_search=req.allow_external_search
    )

    final_state = await workflow_engine.run(initial_state)

    # 4. Record Assistant Message & Metrics
    msg_dict = await repository.save_message(
        conversation_id=cid,
        role="assistant",
        content=final_state.formatted_final_answer,
        model_used=final_state.selected_model_name,
        prompt_tokens=final_state.prompt_tokens,
        completion_tokens=final_state.completion_tokens,
        total_cost=final_state.cost_usd,
        latency_seconds=final_state.latency_seconds,
        tool_calls=final_state.tool_calls_executed,
        citations=final_state.citations
    )

    metrics_tracker.record_chat(
        prompt_tokens=final_state.prompt_tokens,
        completion_tokens=final_state.completion_tokens,
        cost=final_state.cost_usd,
        cache_hit=final_state.cache_hit,
        tool_count=len(final_state.tool_calls_executed)
    )

    # 5. Format Response
    citations_output = [
        CitationSchema(
            source_title=c.get("source_title", "Source"),
            source_url=c.get("source_url"),
            snippet=c.get("snippet", ""),
            confidence_score=c.get("confidence_score", 1.0)
        )
        for c in final_state.citations
    ]

    tool_audits_output = [
        ToolCallAuditSchema(
            tool_name=tc.get("tool_name", "unknown"),
            input_params=tc.get("input_params", {}),
            output_summary=tc.get("output_summary", ""),
            success=tc.get("success", True),
            latency_seconds=tc.get("latency_seconds", 0.0)
        )
        for tc in final_state.tool_calls_executed
    ]

    suggested_followups = [
        "What are the specific safety isolation steps?",
        "Show maintenance MTBF trends for this equipment.",
        "Check compliance findings for ISO 45001."
    ]

    return ChatResponse(
        conversation_id=cid,
        message_id=msg_dict["message_id"],
        answer=final_state.formatted_final_answer,
        citations=citations_output,
        suggested_followups=suggested_followups,
        model_used=final_state.selected_model_name,
        mode=final_state.mode,
        explanation_style=final_state.explanation_style,
        prompt_tokens=final_state.prompt_tokens,
        completion_tokens=final_state.completion_tokens,
        total_cost_usd=final_state.cost_usd,
        latency_seconds=final_state.latency_seconds,
        tool_calls=tool_audits_output,
        cache_hit=final_state.cache_hit,
        requires_approval=final_state.requires_approval,
        approval_details=final_state.approval_details
    )

@router.post("/stream", summary="Server-Sent Events (SSE) Token Stream")
async def chat_stream(
    req: ChatMessageCreate,
    user: UserIdentity = Depends(parse_user_token)
):
    async def sse_event_generator():
        # First execute standard graph state to get answer
        response_obj = await chat_completion(req, user)
        full_text = response_obj.answer
        
        # Stream meta header
        yield f"event: metadata\ndata: {json.dumps({'conversation_id': response_obj.conversation_id, 'model': response_obj.model_used})}\n\n"
        
        # Stream chunks
        words = full_text.split(" ")
        for w in words:
            yield f"event: token\ndata: {json.dumps({'token': w + ' '})}\n\n"
            await asyncio.sleep(0.02)

        # Stream citations and complete
        yield f"event: complete\ndata: {json.dumps({'status': 'done', 'citations_count': len(response_obj.citations)})}\n\n"

    return StreamingResponse(sse_event_generator(), media_type="text/event-stream")
