"""Reasoning Request, Evidence, Citation, and Evaluation Data Transfer Objects.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from app.schemas.tools import KnowledgePriority


class EvidenceItem(BaseModel):
    evidence_id: str
    content: str
    knowledge_priority: KnowledgePriority
    source_name: str
    document_id: Optional[str] = None
    page_number: Optional[int] = 1
    section_path: Optional[str] = None
    relevance_score: float = 0.0
    is_external: bool = False


class CitationItem(BaseModel):
    citation_id: str
    source_name: str
    page_number: int = 1
    section_path: Optional[str] = None
    excerpt: str
    is_external: bool = False


class EvaluationScores(BaseModel):
    grounding_score: float = Field(default=0.0, ge=0.0, le=1.0)
    faithfulness_score: float = Field(default=0.0, ge=0.0, le=1.0)
    relevance_score: float = Field(default=0.0, ge=0.0, le=1.0)
    completeness_score: float = Field(default=0.0, ge=0.0, le=1.0)
    overall_confidence: float = Field(default=0.0, ge=0.0, le=1.0)


class ReasoningRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Industrial inquiry or troubleshooting question")
    session_id: Optional[str] = None
    allow_external_knowledge: bool = False
    filters: Optional[Dict[str, Any]] = None


class ReasoningResponseData(BaseModel):
    session_id: str
    user_query: str
    intent_category: str
    grounded_answer: str
    evaluation: EvaluationScores
    citations: List[CitationItem] = Field(default_factory=list)
    evidence_summary: List[EvidenceItem] = Field(default_factory=list)
    knowledge_sources_used: List[str] = Field(default_factory=list)
    execution_trace: List[Dict[str, Any]] = Field(default_factory=list)
