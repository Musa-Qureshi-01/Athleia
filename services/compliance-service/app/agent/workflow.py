"""LangGraph Compliance Monitoring Agent Workflow Compilation.
"""

import uuid
from typing import Dict, Any
from app.agent.nodes import (
    node_read_document,
    node_deterministic_rule_engine,
    node_semantic_llm_evaluation,
    node_compile_findings,
)
from app.agent.state import ComplianceAgentState
from app.domain.enums import ScanTriggerType


class ComplianceMonitoringAgent:
    """Autonomous Event-Driven Compliance Monitoring Agent."""

    async def run_scan(
        self,
        document_id: str,
        content: str = "",
        metadata: Dict[str, Any] = None,
        trigger_type: ScanTriggerType = ScanTriggerType.DOCUMENT_UPLOADED,
    ) -> ComplianceAgentState:
        scan_id = f"scn_{uuid.uuid4().hex[:8]}"
        state = ComplianceAgentState(
            scan_id=scan_id,
            document_id=document_id,
            content=content,
            metadata=metadata or {},
            trigger_type=trigger_type,
        )

        # Sequential LangGraph state node pipeline execution
        state = await node_read_document(state)
        state = await node_deterministic_rule_engine(state)
        if state.requires_llm_analysis:
            state = await node_semantic_llm_evaluation(state)
        state = await node_compile_findings(state)

        return state


compliance_agent = ComplianceMonitoringAgent()
