"""Domain Entities for Knowledge Service.
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional
from app.domain.enums import DocumentCategory, PackageLifecycleState, RelationshipType


@dataclass
class Provenance:
    source_system: str
    ingestion_job_id: Optional[str] = None
    sha256_hash: Optional[str] = None
    original_filename: Optional[str] = None
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())


@dataclass
class OKFRelationship:
    source_urn: str
    target_urn: str
    relationship_type: RelationshipType
    properties: Dict[str, Any] = field(default_factory=dict)


@dataclass
class OKFDocument:
    document_urn: str
    title: str
    category: DocumentCategory
    content: str
    tags: List[str] = field(default_factory=list)
    provenance: Optional[Provenance] = None
    references: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class OKFPackage:
    package_urn: str
    title: str
    description: str
    version: str
    domain: str
    authors: List[str] = field(default_factory=list)
    state: PackageLifecycleState = PackageLifecycleState.DRAFT
    documents: List[OKFDocument] = field(default_factory=list)
    relationships: List[OKFRelationship] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    tenant_id: str = "default_tenant"
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())


@dataclass
class KnowledgeAuditRecord:
    operation_id: str
    package_urn: str
    action: str
    performed_by: str
    previous_state: Optional[str] = None
    new_state: Optional[str] = None
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    details: Dict[str, Any] = field(default_factory=dict)
