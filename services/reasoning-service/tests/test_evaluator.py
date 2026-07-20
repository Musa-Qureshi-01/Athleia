"""Unit test for GroundingEvaluator.
"""

import pytest
from app.schemas.reasoning import EvidenceItem
from app.schemas.tools import KnowledgePriority
from app.services.evaluator import grounding_evaluator


def test_evaluator_scores_well_grounded_answer():
    query = "What is the suction pressure for Pump P-101A?"
    answer = "Centrifugal Pump P-101A is monitored by Pressure Transmitter PT-101. Standard suction pressure is 150 PSI."
    evidence = [
        EvidenceItem(
            evidence_id="ev1",
            content="Centrifugal Pump P-101A is monitored by Pressure Transmitter PT-101. Standard suction pressure is 150 PSI.",
            knowledge_priority=KnowledgePriority.PRIORITY_1_ENTERPRISE,
            source_name="PND-4012_PUMP_STATION_PID.pdf",
            relevance_score=0.95
        )
    ]

    scores = grounding_evaluator.evaluate(query, answer, evidence)

    assert scores.grounding_score >= 0.80
    assert scores.faithfulness_score == 1.0
    assert scores.overall_confidence >= 0.70


def test_evaluator_scores_zero_for_unsupported_answer():
    query = "What is the secret code for project omega?"
    answer = "Insufficient grounded enterprise evidence available to confidently answer the query."
    evidence = []

    scores = grounding_evaluator.evaluate(query, answer, evidence)

    assert scores.grounding_score == 0.0
    assert scores.overall_confidence == 0.0
