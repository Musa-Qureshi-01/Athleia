"""Domain Exception Hierarchy for Compliance Intelligence Service.
"""

class ComplianceError(Exception):
    """Base exception for compliance service."""
    pass


class FindingNotFoundError(ComplianceError):
    """Raised when compliance finding is not found."""
    pass


class RuleEvaluationError(ComplianceError):
    """Raised when rule engine evaluation fails."""
    pass


class InvalidProviderError(ComplianceError):
    """Raised when unsupported LLM provider is requested."""
    pass


class StorageError(ComplianceError):
    """Raised on repository or database failures."""
    pass
