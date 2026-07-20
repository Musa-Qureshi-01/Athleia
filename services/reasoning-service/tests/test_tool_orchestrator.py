"""Unit test for ToolOrchestrator.
"""

import pytest
from app.services.tool_orchestrator import tool_orchestrator


def test_tool_orchestrator_default_tools_registered():
    tools = tool_orchestrator.get_registered_tools(allow_external=False)
    names = [t.name for t in tools]
    assert "hybrid_search" in names
    assert "semantic_search" in names
    assert "equipment_lookup" in names
    # External tool should be disabled by default
    assert "web_search" not in names


def test_determine_tool_pipeline_for_equipment_query():
    pipeline = tool_orchestrator.determine_tool_pipeline("What is the suction pressure for Pump P-101A?")
    assert "hybrid_search" in pipeline
    assert "equipment_lookup" in pipeline
    assert "web_search" not in pipeline
