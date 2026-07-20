"""Extensible Pipeline Router for Industrial Document Intelligence Service.

Implements the Open-Closed Principle (ADR-002, ADR-005):
Routes classified documents to specialized registered processing pipelines.
"""

from typing import Dict
from app.domain.models import NormalizedDocument
from app.domain.taxonomy import DocumentCategory, DocumentSubtype
from app.pipelines.base import BasePipeline
from app.pipelines.engineering_pipeline import EngineeringPipeline
from app.pipelines.ocr_pipeline import OCRPipeline
from app.pipelines.text_pipeline import TextPipeline


class PipelineRouter:
    """Registry and dispatcher for specialized document pipelines."""

    def __init__(self):
        self._pipelines: Dict[DocumentCategory, BasePipeline] = {}
        self._default_pipeline = TextPipeline()
        self._engineering_pipeline = EngineeringPipeline()
        self._ocr_pipeline = OCRPipeline()

        # Register specialized pipelines per document category
        self.register_pipeline(DocumentCategory.GENERAL, self._default_pipeline)
        self.register_pipeline(DocumentCategory.TECHNICAL, self._default_pipeline)
        self.register_pipeline(DocumentCategory.OPERATIONAL, self._default_pipeline)
        self.register_pipeline(DocumentCategory.COMPLIANCE, self._default_pipeline)
        self.register_pipeline(DocumentCategory.ENGINEERING, self._engineering_pipeline)
        self.register_pipeline(DocumentCategory.SCANNED, self._ocr_pipeline)

    def register_pipeline(self, category: DocumentCategory, pipeline: BasePipeline) -> None:
        """Registers a specialized pipeline for a document category without altering core logic."""
        self._pipelines[category] = pipeline

    def select_pipeline(self, category: DocumentCategory) -> BasePipeline:
        """Selects appropriate pipeline for document category."""
        return self._pipelines.get(category, self._default_pipeline)

    async def execute(
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
        """Dispatches document to matched pipeline and returns canonical NormalizedDocument."""
        pipeline = self.select_pipeline(category)
        return await pipeline.process(
            document_id=document_id,
            logical_document_id=logical_document_id,
            filename=filename,
            file_hash=file_hash,
            mime_type=mime_type,
            size_bytes=size_bytes,
            category=category,
            subtype=subtype,
            content=content
        )


pipeline_router = PipelineRouter()
