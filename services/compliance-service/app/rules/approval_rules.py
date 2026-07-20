"""Approval Signature and Sign-off validation rules.
"""

from typing import Any, Dict, List
from app.domain.enums import ComplianceSeverity, RuleCategory
from app.domain.models import ComplianceFinding, ComplianceRule, FindingEvidence
from app.rules.base import BaseRule


class MissingApprovalRule(BaseRule):
    """Rule verifying that published SOPs contain formal approval sign-off or electronic signature."""

    @property
    def rule(self) -> ComplianceRule:
        return ComplianceRule(
            rule_id="RULE-APP-003",
            name="Missing Formal Approval Sign-off",
            description="Verifies that published procedures contain required engineering or safety sign-off approvals.",
            category=RuleCategory.APPROVAL,
            policy_reference="OSHA 1910.119(f) (Process Safety Management - Operating Procedures)",
            default_severity=ComplianceSeverity.HIGH,
            is_deterministic=True,
        )

    def evaluate(self, document_id: str, content: str, metadata: Dict[str, Any]) -> List[ComplianceFinding]:
        findings = []

        is_published = metadata.get("state") == "PUBLISHED" or metadata.get("status") == "PUBLISHED"
        approvers = metadata.get("approvers") or metadata.get("approved_by") or metadata.get("signatures")

        content_lower = content.lower()
        has_approval_in_text = "approved by" in content_lower or "sign-off" in content_lower or "approver:" in content_lower

        if is_published and not approvers and not has_approval_in_text:
            findings.append(
                ComplianceFinding(
                    document_id=document_id,
                    rule_violated=self.rule.rule_id,
                    rule_category=self.rule.category,
                    policy_reference=self.rule.policy_reference,
                    title="Published Procedure Missing Engineering Approval Sign-off",
                    evidence=[
                        FindingEvidence(
                            verbatim_quote="Document state is PUBLISHED but no electronic signature or approver metadata is recorded.",
                            section_path="Approval Block",
                        )
                    ],
                    severity=self.rule.default_severity,
                    confidence=1.0,
                    recommendation="Obtain explicit sign-off from Plant Operations Manager or Process Engineer before release.",
                    is_deterministic=True,
                )
            )

        return findings
