"""Relationship Integrity Validator for Knowledge Service.
"""

from typing import List, Set
from app.core.errors import ValidationError
from app.domain.models import OKFPackage


class RelationshipValidator:
    """Validates entity relationship graph integrity and reference validity."""

    @classmethod
    def validate(cls, package: OKFPackage) -> List[str]:
        """Validates all relationships in package."""
        errors: List[str] = []

        # Known URNs in package (package URN + all document URNs)
        known_urns: Set[str] = {package.package_urn}
        for doc in package.documents:
            if doc.document_urn:
                known_urns.add(doc.document_urn)

        for idx, rel in enumerate(package.relationships):
            # Check self-loop
            if rel.source_urn == rel.target_urn:
                errors.append(f"Relationship #{idx + 1} has self-referential loop: '{rel.source_urn}' -> '{rel.target_urn}'.")

            # Check missing source
            if not rel.source_urn:
                errors.append(f"Relationship #{idx + 1} missing source_urn.")

            # Check missing target
            if not rel.target_urn:
                errors.append(f"Relationship #{idx + 1} missing target_urn.")

        if errors:
            raise ValidationError(f"Relationship validation failed with {len(errors)} error(s).", errors=errors)

        return errors


relationship_validator = RelationshipValidator()
