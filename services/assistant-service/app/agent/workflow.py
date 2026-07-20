from app.agent.state import AssistantState
from app.agent.nodes import (
    loader_node,
    intent_node,
    planner_node,
    agent_llm_node,
    validator_node
)

class AssistantWorkflowEngine:
    """
    Graph-Based Agentic Orchestrator Engine.
    Executes sequential state transformations through Loader -> Intent -> Planner -> LLM -> Validator.
    """
    async def run(self, initial_state: AssistantState) -> AssistantState:
        state = initial_state
        state = await loader_node(state)
        if state.cache_hit:
            return state

        state = await intent_node(state)
        state = await planner_node(state)
        state = await agent_llm_node(state)
        state = await validator_node(state)
        return state

workflow_engine = AssistantWorkflowEngine()
