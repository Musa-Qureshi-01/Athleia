"""Workflow Execution Nodes for Compliance Agent.
Deterministic Rule Evaluation node -> Semantic LLM Evaluation node -> Summary Compiler Node.
"""

from datetime import datetime
from typing import Dict, Any
from app.agent.state import ComplianceAgentState
from app.domain.models import ScanTelemetry
from app.llm.factory import llm_factory
from app.rules.rule_engine import rule_engine
from app.tools.document_reader_tool import DocumentReaderTool

doc_reader_tool = DocumentReaderTool()


async def node_read_document(state: ComplianceAgentState) -> ComplianceAgentState:
    """Node 1: Reads document text and metadata if not pre-provided."""
    if not state.content:
        doc_data = await doc_reader_tool.run(state.document_id)
        state.content = doc_data.get("content", "")
        if not state.metadata:
            state.metadata = doc_data.get("metadata", {})

    state.telemetry = ScanTelemetry(
        scan_id=state.scan_id,
        trigger_type=state.trigger_type,
        document_id=state.document_id,
    )
    return state


async def node_deterministic_rule_engine(state: ComplianceAgentState) -> ComplianceAgentState:
    """Node 2: Runs pure Python deterministic rules (ZERO LLM tokens)."""
    findings = rule_engine.evaluate_all(state.document_id, state.content, state.metadata)
    state.deterministic_findings = findings
    if state.telemetry:
        state.telemetry.rules_evaluated = len(rule_engine.list_registered_rules())
        state.telemetry.deterministic_findings_count = len(findings)

    # Trigger LLM only if document is complex SOP or explicitly requested
    content_lower = state.content.lower()
    needs_semantic = any(term in content_lower for term in ["ambiguous", "conflict", "deviation", "hazard", "regulatory"])
    state.requires_llm_analysis = needs_semantic
    return state


async def node_semantic_llm_evaluation(state: ComplianceAgentState) -> ComplianceAgentState:
    """Node 3: Invokes pluggable LLM provider only when semantic policy interpretation is required."""
    if not state.requires_llm_analysis:
        return state

    provider = llm_factory.get_provider("openai")
    res = await provider.evaluate_semantic_compliance(
        document_text=state.content,
        policy_context="ISO 9001 & OSHA 1910.119 Standards",
        rules_context="Semantic hazard and procedural alignment rules",
    )

    if state.telemetry:
        tu = res.get("token_usage", {})
        state.telemetry.token_usage = tu
        state.telemetry.llm_findings_count = len(res.get("findings", []))

    return state


async def node_compile_findings(state: ComplianceAgentState) -> ComplianceAgentState:
    """Node 4: Consolidates deterministic and semantic findings into explainable output."""
    state.all_findings = state.deterministic_findings + state.semantic_findings
    if state.telemetry:
        state.telemetry.end_time = datetime.utcnow()
        if state.telemetry.start_time:
            delta = state.telemetry.end_time - state.telemetry.start_time
            state.telemetry.execution_time_ms = delta.total_seconds() * 1000.0
    return state
