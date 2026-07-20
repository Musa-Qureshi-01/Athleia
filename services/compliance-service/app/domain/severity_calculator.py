"""Configurable Severity & Risk Scoring Matrix for Compliance Intelligence Service.
"""

from typing import Dict, Any
from app.domain.enums import ComplianceSeverity, RuleCategory


class SeverityCalculator:
    """Calculates finding severity dynamically based on rule category, safety impact, and document status."""

    def __init__(self, overrides: Dict[str, ComplianceSeverity] = None):
        self.overrides = overrides or {}

    def calculate(
        self,
        category: RuleCategory,
        rule_id: str,
        default_severity: ComplianceSeverity,
        context: Dict[str, Any] = None
    ) -> ComplianceSeverity:
        # 1. Override check
        if rule_id in self.overrides:
            return self.overrides[rule_id]

        context = context or {}

        # 2. Critical Safety Checks (OSHA / High pressure / Chemical isolation)
        if category in (RuleCategory.SAFETY_OSHA, RuleCategory.IEC_ELECTRICAL):
            if context.get("is_high_risk_asset", False) or "emergency" in str(context).lower():
                return ComplianceSeverity.CRITICAL
            return ComplianceSeverity.HIGH

        # 3. Expiry of Primary SOP
        if category == RuleCategory.EXPIRY:
            if context.get("days_expired", 0) > 180:
                return ComplianceSeverity.HIGH
            return ComplianceSeverity.MEDIUM

        # 4. Missing Signatures
        if category == RuleCategory.APPROVAL:
            if context.get("document_status") == "PUBLISHED":
                return ComplianceSeverity.HIGH
            return ComplianceSeverity.MEDIUM

        return default_severity


severity_calculator = SeverityCalculator()
