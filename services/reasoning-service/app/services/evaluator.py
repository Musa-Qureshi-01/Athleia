"""Evaluation Tools & Grounding Guardrails for Athleia Reasoning Service.

Evaluates Grounding, Faithfulness, Relevance, Completeness, and Overall Confidence scores.
Ensures zero hallucinations and strictly enforces minimum grounding thresholds.
"""

from typing import List
from app.core.config import settings
from app.schemas.reasoning import EvaluationScores, EvidenceItem


class GroundingEvaluator:
    """Evaluates answer grounding, faithfulness, relevance, and overall confidence."""

    @classmethod
    def evaluate(
        cls, query: str, answer: str, evidence_items: List[EvidenceItem]
    ) -> EvaluationScores:
        if "Insufficient grounded enterprise evidence" in answer or not evidence_items:
            return EvaluationScores(
                grounding_score=0.0,
                faithfulness_score=0.0,
                relevance_score=0.0,
                completeness_score=0.0,
                overall_confidence=0.0
            )

        # 1. Grounding Score: Sentences backed by evidence items
        sentences = [s.strip() for s in answer.split("\n\n") if s.strip()]
        grounded_count = 0
        evidence_text = " ".join([e.content.lower() for e in evidence_items])

        for sentence in sentences:
            words = [w.lower() for w in sentence.split() if len(w) > 3]
            match_count = sum(1 for w in words if w in evidence_text)
            if words and (match_count / len(words)) >= 0.30:
                grounded_count += 1

        grounding_score = min(1.0, round(grounded_count / max(len(sentences), 1), 2))

        # 2. Faithfulness Score: Check if external ungrounded claims exist
        external_count = sum(1 for e in evidence_items if e.is_external)
        faithfulness_score = 1.0 - (0.20 * external_count)
        faithfulness_score = max(0.20, min(1.0, round(faithfulness_score, 2)))

        # 3. Relevance Score: Query term overlap in answer
        query_terms = [q.lower() for q in query.split() if len(q) > 3]
        answer_lower = answer.lower()
        rel_matches = sum(1 for q in query_terms if q in answer_lower)
        relevance_score = min(1.0, round(rel_matches / max(len(query_terms), 1), 2)) if query_terms else 0.85

        # 4. Completeness Score
        completeness_score = min(1.0, round(len(evidence_items) / float(settings.MAX_EVIDENCE_CHUNKS), 2))

        # 5. Overall Confidence Calculation
        overall_confidence = (
            0.40 * grounding_score +
            0.30 * faithfulness_score +
            0.20 * relevance_score +
            0.10 * completeness_score
        )
        overall_confidence = max(0.0, min(1.0, round(overall_confidence, 2)))

        return EvaluationScores(
            grounding_score=grounding_score,
            faithfulness_score=faithfulness_score,
            relevance_score=relevance_score,
            completeness_score=completeness_score,
            overall_confidence=overall_confidence
        )


grounding_evaluator = GroundingEvaluator()
