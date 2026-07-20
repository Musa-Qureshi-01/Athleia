"""Unit test for Reasoning and Tool Data Models.
"""

import pytest
from app.schemas.reasoning import EvaluationScores, EvidenceItem, ReasoningRequest, ReasoningResponseData
from app.schemas.tools import KnowledgePriority, ToolMetadata, ToolType


def test_knowledge_priority_enum_hierarchy():
    assert KnowledgePriority.PRIORITY_1_ENTERPRISE.value == "PRIORITY_1_ENTERPRISE"
    assert KnowledgePriority.PRIORITY_4_WEB_SEARCH.value == "PRIORITY_4_WEB_SEARCH"


def test_reasoning_request_schema():
    req = ReasoningRequest(
        query="What is the maintenance procedure for centrifugal pump P-101A?",
        allow_external_knowledge=False
    )
    assert req.query == "What is the maintenance procedure for centrifugal pump P-101A?"
    assert req.allow_external_knowledge is False


def test_evaluation_scores_bounds():
    eval_scores = EvaluationScores(
        grounding_score=0.95,
        faithfulness_score=0.92,
        relevance_score=0.90,
        completeness_score=0.88,
        overall_confidence=0.91
    )
    assert eval_scores.grounding_score == 0.95
    assert eval_scores.overall_confidence == 0.91
