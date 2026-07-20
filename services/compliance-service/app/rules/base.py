"""Abstract Base Rule class for Deterministic Rule Engine.
Checks execute in pure Python with ZERO LLM token consumption.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from app.domain.models import ComplianceFinding, ComplianceRule


class BaseRule(ABC):
    """Abstract Base Rule for deterministic checks."""

    @property
    @abstractmethod
    def rule(self) -> ComplianceRule:
        """Returns rule definition."""
        pass

    @abstractmethod
    def evaluate(self, document_id: str, content: str, metadata: Dict[str, Any]) -> List[ComplianceFinding]:
        """Evaluates document against rule logic and returns zero or more findings."""
        pass
