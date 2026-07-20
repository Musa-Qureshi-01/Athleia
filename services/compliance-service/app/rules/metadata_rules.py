"""Metadata validation rules (Missing Author, Domain, Title, Version).
"""

from typing import Any, Dict, List
from app.domain.enums import ComplianceSeverity, RuleCategory
from app.domain.models import ComplianceFinding, ComplianceRule, FindingEvidence
from app.rules.base import BaseRule


class MissingMetadataRule(BaseRule):
    """Rule verifying mandatory metadata fields (author, domain, version) are present."""

    @property
    def rule(self) -> ComplianceRule:
        return ComplianceRule(
            rule_id="RULE-META-001",
            name="Missing Mandatory Metadata Check",
            description="Verifies that documents contain mandatory metadata attributes including authors, domain, and SemVer version.",
            category=RuleCategory.METADATA,
            policy_reference="Athleia Corporate Governance Standard §3.1 (Metadata Standards)",
            default_severity=ComplianceSeverity.MEDIUM,
            is_deterministic=True,
        )

    def evaluate(self, document_id: str, content: str, metadata: Dict[str, Any]) -> List[ComplianceFinding]:
        findings = []
        missing = []

        if not metadata.get("author") and not metadata.get("authors"):
            missing.append("author / authors")
        if not metadata.get("domain"):
            missing.append("domain")
        if not metadata.get("version"):
            missing.append("version")

        if missing:
            findings.append(
                ComplianceFinding(
                    document_id=document_id,
                    rule_violated=self.rule.rule_id,
                    rule_category=self.rule.category,
                    policy_reference=self.rule.policy_reference,
                    title=f"Missing Mandatory Metadata: {', '.join(missing)}",
                    evidence=[
                        FindingEvidence(
                            verbatim_quote=f"Document metadata keys present: {list(metadata.keys())}",
                            section_path="Header Metadata",
                        )
                    ],
                    severity=self.rule.default_severity,
                    confidence=1.0,
                    recommendation=f"Update document metadata to specify required attributes: {', '.join(missing)}.",
                    is_deterministic=True,
                )
            )

        return findings
