"""Expiration and Review Date validation rules.
"""

from datetime import datetime
from typing import Any, Dict, List
from app.domain.enums import ComplianceSeverity, RuleCategory
from app.domain.models import ComplianceFinding, ComplianceRule, FindingEvidence
from app.rules.base import BaseRule


class ExpiredDocumentRule(BaseRule):
    """Rule verifying that document expiration date or review date has not passed."""

    @property
    def rule(self) -> ComplianceRule:
        return ComplianceRule(
            rule_id="RULE-EXP-002",
            name="Expired Document / Review Date Check",
            description="Verifies that SOPs and technical runbooks have not exceeded their mandatory review cycle.",
            category=RuleCategory.EXPIRY,
            policy_reference="ISO 9001:2015 Clause 7.5.3 (Control of Documented Information)",
            default_severity=ComplianceSeverity.HIGH,
            is_deterministic=True,
        )

    def evaluate(self, document_id: str, content: str, metadata: Dict[str, Any]) -> List[ComplianceFinding]:
        findings = []
        expiry_str = metadata.get("expiry_date") or metadata.get("next_review_date")

        if expiry_str:
            try:
                expiry_dt = datetime.fromisoformat(str(expiry_str).replace("Z", "+00:00"))
                if expiry_dt.date() < datetime.utcnow().date():
                    days_past = (datetime.utcnow().date() - expiry_dt.date()).days
                    findings.append(
                        ComplianceFinding(
                            document_id=document_id,
                            rule_violated=self.rule.rule_id,
                            rule_category=self.rule.category,
                            policy_reference=self.rule.policy_reference,
                            title=f"Expired Operational Procedure ({days_past} days past review date)",
                            evidence=[
                                FindingEvidence(
                                    verbatim_quote=f"Review date recorded: '{expiry_str}'",
                                    section_path="Metadata / Document Control Header",
                                )
                            ],
                            severity=ComplianceSeverity.HIGH if days_past > 90 else ComplianceSeverity.MEDIUM,
                            confidence=1.0,
                            recommendation="Initiate formal document re-validation review and publish updated version.",
                            is_deterministic=True,
                            metadata={"days_expired": days_past},
                        )
                    )
            except Exception:
                pass

        return findings
