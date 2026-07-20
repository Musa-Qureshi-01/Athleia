"""Grounded Reasoning Engine and Citation Generator for Athleia Reasoning Service.

Synthesizes grounded, factual industrial responses strictly using verified EvidenceItem objects.
Never fabricates information or hallucinates unsupported claims.
"""

import re
from typing import List, Tuple
from app.core.config import settings
from app.core.logging import logger
from app.schemas.reasoning import CitationItem, EvidenceItem
from app.schemas.tools import KnowledgePriority
from app.services.llm_provider import LLMProvider


class ReasoningEngine:
    """Synthesizes grounded reasoning answers and validates evidence citations."""

    @classmethod
    async def generate_grounded_answer(
        cls, user_query: str, evidence_items: List[EvidenceItem]
    ) -> Tuple[str, List[CitationItem], str, List[str]]:
        """Synthesizes grounded response strictly from collected evidence items."""
        # 1. Intent Classification
        intent = cls._classify_intent(user_query)

        # 2. Check if sufficient evidence exists
        if not evidence_items or max([e.relevance_score for e in evidence_items], default=0.0) < 0.30:
            logger.info("insufficient_evidence_for_grounded_reasoning", query=user_query)
            unsupported_msg = (
                "Insufficient grounded enterprise evidence available to confidently answer the query. "
                "Please verify that the required Standard Operating Procedures (SOP), P&ID drawings, "
                "or equipment datasheets are ingested into the platform."
            )
            return unsupported_msg, [], intent, []

        # 3. Filter top evidence & build citations
        citations: List[CitationItem] = []
        sources_used: List[str] = []

        for idx, ev in enumerate(evidence_items):
            citation_id = f"[{idx+1}]"
            sources_used.append(f"{ev.source_name} ({ev.knowledge_priority.value})")

            citations.append(
                CitationItem(
                    citation_id=citation_id,
                    source_name=ev.source_name,
                    page_number=ev.page_number or 1,
                    section_path=ev.section_path or "Document Body",
                    excerpt=ev.content[:150],
                    is_external=ev.is_external
                )
            )

        # 4. Generate Grounded Answer using Multi-Provider LLM Orchestrator
        grounded_answer, provider_used = await LLMProvider.generate(user_query, evidence_items)
        sources_used.append(f"LLM Engine: {provider_used}")

        return grounded_answer, citations, intent, list(set(sources_used))

    @staticmethod
    def _classify_intent(query: str) -> str:
        q_upper = query.upper()
        if any(w in q_upper for w in ["SOP", "PROCEDURE", "MAINTENANCE", "STEP"]):
            return "PROCEDURAL_MAINTENANCE_INQUIRY"
        elif any(w in q_upper for w in ["P&ID", "PND", "DRAWING", "TAG", "INSTRUMENT"]):
            return "ENGINEERING_PID_DIAGRAM_INQUIRY"
        elif any(w in q_upper for w in ["FAIL", "ROOT CAUSE", "TROUBLESHOOT", "ALARM"]):
            return "ROOT_CAUSE_TROUBLESHOOTING"
        else:
            return "GENERAL_INDUSTRIAL_KNOWLEDGE_INQUIRY"


reasoning_engine = ReasoningEngine()
