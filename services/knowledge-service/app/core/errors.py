"""Custom exception definitions for Knowledge Service.
"""

class KnowledgeServiceError(Exception):
    """Base exception for Knowledge Service."""
    pass

class ValidationError(KnowledgeServiceError):
    """Raised when knowledge package or document fails validation."""
    def __init__(self, message: str, errors: list = None):
        super().__init__(message)
        self.errors = errors or []

class PackageNotFoundError(KnowledgeServiceError):
    """Raised when requested package URN or ID is not found."""
    pass

class InvalidStateTransitionError(KnowledgeServiceError):
    """Raised when illegal lifecycle state transition is requested."""
    pass

class AdapterError(KnowledgeServiceError):
    """Raised when format adapter import or export fails."""
    pass
