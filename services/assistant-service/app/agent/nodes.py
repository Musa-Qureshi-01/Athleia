import time
from typing import Dict, Any
from app.agent.state import AssistantState
from app.agent.intent import intent_classifier
from app.agent.prompts import prompt_engine
from app.agent.validator import response_validator
from app.llm.router import model_router, TaskType
from app.cache.semantic_cache import semantic_cache
from app.memory.conversation_memory import conversation_memory
from app.memory.user_memory import user_memory
from app.tools.registry import tool_registry
from app.core.security import UserIdentity
from app.core.logging import logger

async def loader_node(state: AssistantState) -> AssistantState:
    """Loads user memory preferences and context summary."""
    t0 = time.time()
    mem = await user_memory.get_user_memory_context(state.user_id)
    state.user_preferences = mem
    state.explanation_style = mem.get("explanation_style", state.explanation_style)
    
    # Check Semantic Cache
    if state.messages and state.messages[-1]["role"] == "user":
        query = state.messages[-1]["content"]
        cached = semantic_cache.get(query, state.user_id, state.mode.value)
        if cached:
            logger.info(f"[LoaderNode] Semantic Cache HIT for query '{query}'")
            state.cache_hit = True
            state.formatted_final_answer = cached.get("answer", "")
            state.citations = cached.get("citations", [])
            state.latency_seconds = round(time.time() - t0, 3)
            return state

    return state

async def intent_node(state: AssistantState) -> AssistantState:
    """Classifies user query intent."""
    if state.cache_hit or not state.messages:
        return state

    user_query = state.messages[-1]["content"]
    intent = intent_classifier.classify(user_query)
    state.intent_category = intent.value
    return state

async def planner_node(state: AssistantState) -> AssistantState:
    """Constructs prompt using Role-adapted prompt engine."""
    if state.cache_hit:
        return state

    context_summary = conversation_memory.generate_context_summary(state.messages)
    system_prompt = prompt_engine.build_prompt(
        role=state.user_role,
        explanation_style=state.explanation_style.value if hasattr(state.explanation_style, 'value') else str(state.explanation_style),
        user_name=state.user_preferences.get("full_name", "Enterprise User"),
        department=state.user_preferences.get("department"),
        context_summary=context_summary
    )
    state.system_prompt = system_prompt
    return state

async def agent_llm_node(state: AssistantState) -> AssistantState:
    """Executes LLM call with Task-Based Model Router."""
    if state.cache_hit:
        return state

    t0 = time.time()
    task = TaskType(state.intent_category) if state.intent_category in [t.value for t in TaskType] else TaskType.FAST_CONVERSATION
    provider = model_router.get_provider(task, state.selected_model_name)
    
    # Prepare messages array with system prompt
    full_messages = [{"role": "system", "content": state.system_prompt}]
    full_messages.extend(conversation_memory.format_history_for_prompt(state.messages))

    # Auto Tool Decision: If query implies search/compliance/maintenance, execute tool first
    user_query = state.messages[-1]["content"].lower()
    if any(w in user_query for w in ["search", "sop", "procedure", "finding", "pump", "compliance", "maintenance"]):
        dummy_user = UserIdentity(
            user_id=state.user_id,
            email=state.user_id + "@athleia.ai",
            full_name="Enterprise Worker",
            role=state.user_role,
            permissions=state.user_permissions
        )
        tool_res = await tool_registry.execute_tool("enterprise_search", {"query": state.messages[-1]["content"]}, dummy_user)
        if tool_res.citations:
            state.citations.extend(tool_res.citations)
        if tool_res.requires_approval:
            state.requires_approval = True
            state.approval_details = tool_res.approval_details
        
        full_messages.append({"role": "system", "content": f"Enterprise Search Evidence: {tool_res.content}"})
        state.tool_calls_executed.append({
            "tool_name": "enterprise_search",
            "input_params": {"query": state.messages[-1]["content"]},
            "output_summary": tool_res.content[:200],
            "success": tool_res.success,
            "latency_seconds": tool_res.latency_seconds
        })

    llm_out = await provider.generate(full_messages)
    state.llm_raw_response = llm_out.text
    state.prompt_tokens = llm_out.prompt_tokens
    state.completion_tokens = llm_out.completion_tokens
    state.cost_usd = llm_out.cost_usd
    state.selected_model_name = llm_out.model_name
    state.latency_seconds = round(time.time() - t0, 3)
    return state

async def validator_node(state: AssistantState) -> AssistantState:
    """Validates response safety & grounding."""
    if state.cache_hit:
        return state

    ok, checked_text = response_validator.validate(state.llm_raw_response, state.citations, state.user_role)
    state.validation_passed = ok
    state.formatted_final_answer = checked_text
    
    # Cache valid responses
    if ok and state.messages:
        query = state.messages[-1]["content"]
        semantic_cache.set(query, state.user_id, state.mode.value, {
            "answer": state.formatted_final_answer,
            "citations": state.citations
        })

    return state
