"""Domain Enumerations for Knowledge Service.
"""

from enum import Enum


class PackageLifecycleState(str, Enum):
    DRAFT = "DRAFT"
    VALIDATED = "VALIDATED"
    PUBLISHED = "PUBLISHED"
    DEPRECATED = "DEPRECATED"
    ARCHIVED = "ARCHIVED"


class RelationshipType(str, Enum):
    DEPENDS_ON = "DEPENDS_ON"
    GOVERNED_BY = "GOVERNED_BY"
    CONTROLS = "CONTROLS"
    VERIFIES = "VERIFIES"
    DERIVED_FROM = "DERIVED_FROM"
    REFERENCES = "REFERENCES"


class DocumentCategory(str, Enum):
    EQUIPMENT_SPEC = "EQUIPMENT_SPEC"
    SOP = "SOP"
    COMPLIANCE_RULE = "COMPLIANCE_RULE"
    RUNBOOK = "RUNBOOK"
    STANDARD = "STANDARD"
    POLICY = "POLICY"
    GENERAL = "GENERAL"
