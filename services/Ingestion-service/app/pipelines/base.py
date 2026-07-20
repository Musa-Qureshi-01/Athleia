"""Base Pipeline Interface for Industrial Document Intelligence Service.

Enforces the Open-Closed Principle (ADR-002, ADR-003, ADR-005):
Every pipeline must produce the same canonical NormalizedDocument schema.
"""

from abc import ABC, abstractmethod
from app.domain.models import NormalizedDocument
from app.domain.taxonomy import DocumentCategory, DocumentSubtype


class BasePipeline(ABC):
    """Abstract processing pipeline interface."""

    @property
    @abstractmethod
    def pipeline_id(self) -> str:
        """Returns unique pipeline identifier."""
        pass

    @abstractmethod
    async def process(
        self,
        document_id: str,
        logical_document_id: str,
        filename: str,
        file_hash: str,
        mime_type: str,
        size_bytes: int,
        category: DocumentCategory,
        subtype: DocumentSubtype,
        content: bytes
    ) -> NormalizedDocument:
        """Executes full pipeline processing and emits canonical NormalizedDocument model."""
        pass
