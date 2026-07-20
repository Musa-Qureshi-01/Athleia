"""Canonical Normalized Document Domain Models for Altheia Industrial Document Intelligence Service.

Downstream services consume only these normalized models regardless of the input pipeline.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ProcessingState(str, Enum):
    PENDING = "Pending"
    UPLOADED = "Uploaded"
    VALIDATING = "Validating"
    QUEUED = "Queued"
    PROCESSING = "Processing"
    NORMALIZING = "Normalizing"
    PUBLISHING = "Publishing"
    COMPLETED = "Completed"
    VALIDATION_FAILED = "Validation_Failed"
    PROCESSING_FAILED = "Processing_Failed"
    RETRY_SCHEDULED = "Retry_Scheduled"
    CANCELLED = "Cancelled"


class EntityType(str, Enum):
    EQUIPMENT = "EQUIPMENT"
    INSTRUMENT_TAG = "INSTRUMENT_TAG"
    ASSET_ID = "ASSET_ID"
    COMPONENT = "COMPONENT"
    PROCEDURE = "PROCEDURE"
    STANDARD = "STANDARD"
    MEASUREMENT = "MEASUREMENT"
    LOCATION = "LOCATION"
    FAILURE_MODE = "FAILURE_MODE"
    MAINTENANCE_ACTIVITY = "MAINTENANCE_ACTIVITY"
    SAFETY_INSTRUCTION = "SAFETY_INSTRUCTION"


class RelationType(str, Enum):
    LOCATED_IN = "LOCATED_IN"
    CONNECTED_TO = "CONNECTED_TO"
    CONTROLS = "CONTROLS"
    PART_OF = "PART_OF"
    PREVENTS = "PREVENTS"
    MONITORS = "MONITORS"
    CONFORMS_TO = "CONFORMS_TO"
    MAINTAINS = "MAINTAINS"
    MEASURES = "MEASURES"
    TRIGGERS = "TRIGGERS"


class DocumentMetadata(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    document_number: Optional[str] = None
    revision: Optional[str] = None
    version: str = "1.0"
    creation_date: Optional[str] = None
    author: Optional[str] = None
    language: str = "en"
    organization_id: str = "default_tenant"
    equipment_references: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    custom_attributes: Dict[str, Any] = Field(default_factory=dict)


class BoundingBox(BaseModel):
    page_number: int
    x_min: float
    y_min: float
    x_max: float
    y_max: float


class DocumentSection(BaseModel):
    section_id: str
    title: str
    level: int = 1
    page_start: int
    page_end: int
    content: str
    parent_section_id: Optional[str] = None


class DocumentTable(BaseModel):
    table_id: str
    page_number: int
    title: Optional[str] = None
    headers: List[str] = Field(default_factory=list)
    rows: List[List[str]] = Field(default_factory=list)
    bounding_box: Optional[BoundingBox] = None


class DocumentImage(BaseModel):
    image_id: str
    page_number: int
    caption: Optional[str] = None
    mime_type: str = "image/png"
    storage_url: Optional[str] = None
    bounding_box: Optional[BoundingBox] = None


class DocumentFootnote(BaseModel):
    footnote_id: str
    page_number: int
    marker: str
    text: str


class DocumentChunk(BaseModel):
    chunk_id: str
    content: str
    token_count: int
    page_number: int
    section_path: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    evidence_refs: List[str] = Field(default_factory=list)


class IndustrialEntity(BaseModel):
    id: str
    name: str
    entity_type: EntityType
    confidence: float = 1.0
    bounding_box: Optional[BoundingBox] = None
    properties: Dict[str, Any] = Field(default_factory=dict)


class EntityRelationship(BaseModel):
    source_id: str
    target_id: str
    relation_type: RelationType
    confidence: float = 1.0
    evidence: Optional[str] = None


class DocumentReference(BaseModel):
    reference_id: str
    title: str
    target_document_number: Optional[str] = None
    reference_type: str = "CROSS_DRAWING"  # STANDARDS / SPECIFICATION / DRAWING


class ProcessingTrace(BaseModel):
    pipeline_id: str
    steps_executed: List[str] = Field(default_factory=list)
    execution_time_ms: int = 0
    worker_node: str = "local_worker"
    retry_count: int = 0
    warnings: List[str] = Field(default_factory=list)
    errors: List[str] = Field(default_factory=list)


class NormalizedDocument(BaseModel):
    document_id: str
    logical_document_id: str
    version: str = "1.0"
    filename: str
    file_hash: str
    mime_type: str
    size_bytes: int
    metadata: DocumentMetadata
    sections: List[DocumentSection] = Field(default_factory=list)
    tables: List[DocumentTable] = Field(default_factory=list)
    images: List[DocumentImage] = Field(default_factory=list)
    footnotes: List[DocumentFootnote] = Field(default_factory=list)
    chunks: List[DocumentChunk] = Field(default_factory=list)
    entities: List[IndustrialEntity] = Field(default_factory=list)
    relationships: List[EntityRelationship] = Field(default_factory=list)
    references: List[DocumentReference] = Field(default_factory=list)
    provenance: ProcessingTrace
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
