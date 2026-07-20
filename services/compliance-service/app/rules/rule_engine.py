"""Deterministic Rule Engine for Compliance Service.
Executes pure Python rules without calling LLMs.
"""

from typing import Any, Dict, List
from app.domain.models import ComplianceFinding, ComplianceRule
from app.rules.base import BaseRule
from app.rules.metadata_rules import MissingMetadataRule
from app.rules.expiry_rules import ExpiredDocumentRule
from app.rules.approval_rules import MissingApprovalRule
from app.rules.section_rules import MissingSafetySectionRule


class RuleEngine:
    """Deterministic Rule Engine executing validation rules in sequence."""

    def __init__(self):
        self.rules: List[BaseRule] = [
            MissingMetadataRule(),
            ExpiredDocumentRule(),
            MissingApprovalRule(),
            MissingSafetySectionRule(),
        ]

    def list_registered_rules(self) -> List[ComplianceRule]:
        return [r.rule for r in self.rules]

    def evaluate_all(self, document_id: str, content: str, metadata: Dict[str, Any]) -> List[ComplianceFinding]:
        findings: List[ComplianceFinding] = []
        for r in self.rules:
            if r.rule.enabled:
                res = r.evaluate(document_id, content, metadata)
                findings.extend(res)
        return findings


rule_engine = RuleEngine()
