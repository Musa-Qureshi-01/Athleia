"""Mandatory Safety Section validation rules.
"""

from typing import Any, Dict, List
from app.domain.enums import ComplianceSeverity, RuleCategory
from app.domain.models import ComplianceFinding, ComplianceRule, FindingEvidence
from app.rules.base import BaseRule


class MissingSafetySectionRule(BaseRule):
    """Rule verifying that industrial SOPs contain explicit Safety and Hazard isolation sections."""

    @property
    def rule(self) -> ComplianceRule:
        return ComplianceRule(
            rule_id="RULE-SEC-004",
            name="Missing Mandatory Safety & PPE Section",
            description="Verifies that operational procedures include mandatory PPE and Hazard Isolation sections.",
            category=RuleCategory.MANDATORY_SECTIONS,
            policy_reference="OSHA 1910.1200 (Hazard Communication Standard & Safety Requirements)",
            default_severity=ComplianceSeverity.CRITICAL,
            is_deterministic=True,
        )

    def evaluate(self, document_id: str, content: str, metadata: Dict[str, Any]) -> List[ComplianceFinding]:
        findings = []

        category = str(metadata.get("category", "")).upper()
        content_lower = content.lower()

        is_sop = "SOP" in category or "RUNBOOK" in category or "PROCEDURE" in category or "OPERATING" in category

        has_safety = any(
            term in content_lower
            for term in ["safety requirement", "safety section", "ppe required", "personal protective equipment", "hazard isolation", "lockout/tagout", "emergency stop"]
        )

        if is_sop and not has_safety:
            findings.append(
                ComplianceFinding(
                    document_id=document_id,
                    rule_violated=self.rule.rule_id,
                    rule_category=self.rule.category,
                    policy_reference=self.rule.policy_reference,
                    title="Incomplete SOP: Missing Mandatory Safety & Hazard Isolation Section",
                    evidence=[
                        FindingEvidence(
                            verbatim_quote=f"SOP content of length {len(content)} chars evaluated without safety keywords.",
                            section_path="Full Document Body",
                        )
                    ],
                    severity=self.rule.default_severity,
                    confidence=1.0,
                    recommendation="Add explicit 'Safety Requirements & PPE' section detailing required safety gear and emergency isolation.",
                    is_deterministic=True,
                )
            )

        return findings
