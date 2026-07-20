import time
import uuid
from langgraph.graph import StateGraph, END
from app.agent.state import MaintenanceAgentState
from app.agent.nodes import (
    gather_equipment_history,
    evaluate_deterministic_patterns,
    llm_reasoning_node,
    assess_risk_and_recommendation,
    persist_and_notify,
)

def create_predictive_maintenance_workflow():
    workflow = StateGraph(MaintenanceAgentState)

    workflow.add_node("gather_equipment_history", gather_equipment_history)
    workflow.add_node("evaluate_deterministic_patterns", evaluate_deterministic_patterns)
    workflow.add_node("llm_reasoning_node", llm_reasoning_node)
    workflow.add_node("assess_risk_and_recommendation", assess_risk_and_recommendation)
    workflow.add_node("persist_and_notify", persist_and_notify)

    workflow.set_entry_point("gather_equipment_history")

    workflow.add_edge("gather_equipment_history", "evaluate_deterministic_patterns")
    workflow.add_edge("evaluate_deterministic_patterns", "llm_reasoning_node")
    workflow.add_edge("llm_reasoning_node", "assess_risk_and_recommendation")
    workflow.add_edge("assess_risk_and_recommendation", "persist_and_notify")
    workflow.add_edge("persist_and_notify", END)

    return workflow.compile()

predictive_maintenance_agent = create_predictive_maintenance_workflow()

async def run_predictive_maintenance_analysis(
    equipment_id: str,
    trigger_type: str = "MANUAL_SCAN",
    raw_content: str = None,
    correlation_id: str = None
) -> dict:
    start_time = time.time()
    analysis_id = f"anl_maint_{uuid.uuid4().hex[:8]}"

    initial_state: MaintenanceAgentState = {
        "analysis_id": analysis_id,
        "correlation_id": correlation_id or f"corr_{uuid.uuid4().hex[:8]}",
        "trigger_type": trigger_type,
        "equipment_id": equipment_id,
        "asset_name": equipment_id,
        "raw_content": raw_content,
        "maintenance_history": [],
        "incident_logs": [],
        "manual_specs": {},
        "deterministic_result": {},
        "llm_reasoning_summary": "",
        "recommended_action": "",
        "risk_score": 0.0,
        "failure_probability": 0.0,
        "severity": "LOW",
        "confidence": 0.0,
        "evidence": [],
        "status": "PROCESSING",
        "execution_time_ms": 0.0,
        "token_usage": {"prompt_tokens": 180, "completion_tokens": 120, "total_tokens": 300},
        "tools_used": [],
        "error": None,
    }

    final_state = await predictive_maintenance_agent.ainvoke(initial_state)
    execution_time = (time.time() - start_time) * 1000
    final_state["execution_time_ms"] = round(execution_time, 2)
    return final_state
