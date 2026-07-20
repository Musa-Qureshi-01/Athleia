"""Unit test for ReasoningEngine.
"""

import pytest
from app.schemas.reasoning import EvidenceItem
from app.schemas.tools import KnowledgePriority
from app.services.reasoning_engine import reasoning_engine


@pytest.mark.asyncio
async def test_reasoning_engine_generates_grounded_answer_with_citations():
    query = "What is the suction pressure for Pump P-101A?"
    evidence = [
        EvidenceItem(
            evidence_id="ev1",
            content="Centrifugal Pump P-101A is monitored by Pressure Transmitter PT-101. Standard suction pressure is 150 PSI.",
            knowledge_priority=KnowledgePriority.PRIORITY_1_ENTERPRISE,
            source_name="PND-4012_PUMP_STATION_PID.pdf",
            page_number=1,
            section_path="Equipment Overview",
            relevance_score=0.95
        )
    ]

    answer, citations, intent, sources = await reasoning_engine.generate_grounded_answer(query, evidence)

    assert "Centrifugal Pump P-101A" in answer
    assert len(citations) == 1
    assert citations[0].source_name == "PND-4012_PUMP_STATION_PID.pdf"
    assert "ENGINEERING_PID_DIAGRAM_INQUIRY" == intent


@pytest.mark.asyncio
async def test_reasoning_engine_handles_insufficient_evidence_without_hallucinating():
    query = "What is the secret code for project omega?"
    evidence = []  # No evidence available

    answer, citations, intent, sources = await reasoning_engine.generate_grounded_answer(query, evidence)

    assert "Insufficient grounded enterprise evidence" in answer
    assert len(citations) == 0
    assert len(sources) == 0
