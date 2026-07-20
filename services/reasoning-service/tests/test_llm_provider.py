"""Unit test for LLMProvider multi-provider orchestrator.
"""

import pytest
from app.schemas.reasoning import EvidenceItem
from app.schemas.tools import KnowledgePriority
from app.services.llm_provider import llm_provider


@pytest.mark.asyncio
async def test_llm_provider_fallback_to_deterministic():
    query = "What is the suction pressure for Pump P-101A?"
    evidence = [
        EvidenceItem(
            evidence_id="ev1",
            content="Centrifugal Pump P-101A is monitored by Pressure Transmitter PT-101.",
            knowledge_priority=KnowledgePriority.PRIORITY_1_ENTERPRISE,
            source_name="PND-4012_PUMP_STATION_PID.pdf",
            relevance_score=0.95
        )
    ]

    answer, provider_used = await llm_provider.generate(query, evidence, provider_override="DETERMINISTIC")
    assert "Centrifugal Pump P-101A" in answer
    assert provider_used == "DETERMINISTIC_GROUNDED_ENGINE"
