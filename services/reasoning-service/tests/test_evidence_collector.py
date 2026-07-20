"""Integration test for EvidenceCollector.
"""

import pytest
from app.schemas.tools import KnowledgePriority
from app.services.evidence_collector import evidence_collector


@pytest.mark.asyncio
async def test_evidence_collector_collects_and_ranks_evidence():
    query = "What is the suction pressure for Pump P-101A monitored by PT-101?"
    evidence_items = await evidence_collector.collect_evidence(query, allow_external_knowledge=False)

    assert len(evidence_items) > 0
    # Highest priority items (Priority 1) should rank first
    assert evidence_items[0].knowledge_priority in [KnowledgePriority.PRIORITY_1_ENTERPRISE, KnowledgePriority.PRIORITY_2_STRUCTURED_DB]
    assert evidence_items[0].is_external is False
    assert evidence_items[0].relevance_score >= 0.70
