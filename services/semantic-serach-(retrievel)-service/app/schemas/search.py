"""Search & Retrieval Data Transfer Objects for Athleia Retrieval Service.
"""

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SearchType(str, Enum):
    DENSE = "DENSE"        # Semantic vector similarity search
    SPARSE = "SPARSE"      # BM25 keyword search
    HYBRID = "HYBRID"      # Reciprocal Rank Fusion (RRF) dense + sparse
    METADATA = "METADATA"  # Exact metadata filtering


class SearchFilters(BaseModel):
    category: Optional[str] = None
    subtype: Optional[str] = None
    equipment_references: List[str] = Field(default_factory=list)
    document_id: Optional[str] = None
    logical_document_id: Optional[str] = None
    tenant_id: Optional[str] = None


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Natural language or keyword search query")
    search_type: SearchType = Field(default=SearchType.HYBRID, description="Retrieval strategy: DENSE, SPARSE, or HYBRID")
    top_k: int = Field(default=10, ge=1, le=100, description="Number of top results to return")
    filters: Optional[SearchFilters] = None


class SearchResultItem(BaseModel):
    chunk_id: str
    document_id: str
    logical_document_id: str
    score: float
    content: str
    page_number: int = 1
    section_path: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    evidence: Optional[str] = None
    source_type: str = "HYBRID_RRF"


class SearchResponseData(BaseModel):
    query: str
    search_type: str
    total_results: int
    execution_time_ms: int
    results: List[SearchResultItem] = Field(default_factory=list)


class IndexDocumentRequest(BaseModel):
    """Payload sent by Ingestion Service or client containing NormalizedDocument JSON for indexing."""
    document_id: str
    logical_document_id: str
    filename: str
    file_hash: str
    mime_type: str
    size_bytes: int
    metadata: Dict[str, Any]
    chunks: List[Dict[str, Any]]
    entities: List[Dict[str, Any]] = Field(default_factory=list)
    relationships: List[Dict[str, Any]] = Field(default_factory=list)
