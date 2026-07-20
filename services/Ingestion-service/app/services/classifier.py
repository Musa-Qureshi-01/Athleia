"""Document Classification Engine for Altheia Industrial Document Intelligence Service.

Categorizes documents into GENERAL, TECHNICAL, ENGINEERING, OPERATIONAL, COMPLIANCE, or SCANNED
using rule-based content heuristics, MIME detection, and visual structure analysis.
"""

import os
from typing import Dict, List, Tuple
from pypdf import PdfReader

from app.domain.taxonomy import DocumentCategory, DocumentSubtype, SUPPORTED_EXTENSIONS


class ClassificationResult:
    def __init__(self, category: DocumentCategory, subtype: DocumentSubtype, confidence: float, strategy: str):
        self.category = category
        self.subtype = subtype
        self.confidence = confidence
        self.strategy = strategy

    def to_dict(self) -> dict:
        return {
            "category": self.category.value,
            "subtype": self.subtype.value,
            "confidence": self.confidence,
            "strategy": self.strategy,
        }


class DocumentClassifier:
    """Classifies document category and subtype using open-source content heuristics."""

    # Keywords for Technical Documentation
    TECHNICAL_KEYWORDS = {"sop", "standard operating procedure", "work instruction", "manual", "datasheet", "specification"}

    # Keywords for Operational Records
    OPERATIONAL_KEYWORDS = {"maintenance", "inspection", "incident", "root cause", "work order", "shift report", "calibration"}

    # Keywords for Compliance
    COMPLIANCE_KEYWORDS = {"iso", "osha", "safety procedure", "risk assessment", "audit", "regulatory"}

    # Keywords for Engineering Drawings / P&IDs
    ENGINEERING_KEYWORDS = {"p&id", "piping and instrumentation", "drawing", "schematic", "flow diagram", "pfd", "cad"}

    @classmethod
    def classify(cls, filename: str, mime_type: str, content: bytes) -> ClassificationResult:
        ext = os.path.splitext(filename)[1].lower()
        subtype = SUPPORTED_EXTENSIONS.get(ext, DocumentSubtype.UNKNOWN)

        # 1. Scanned Image Detection
        if ext in [".png", ".jpg", ".jpeg", ".tiff", ".bmp", ".webp"]:
            return ClassificationResult(
                category=DocumentCategory.SCANNED,
                subtype=subtype,
                confidence=0.95,
                strategy="OCR_PIPELINE"
            )

        # 2. Text Content Extraction for PDF / DOCX / TXT heuristics
        extracted_text = ""
        if ext == ".pdf":
            try:
                import io
                reader = PdfReader(io.BytesIO(content))
                for page in reader.pages[:3]:  # Inspect first 3 pages
                    extracted_text += (page.extract_text() or "").lower()
            except Exception:
                pass
        elif ext in [".txt", ".md", ".csv"]:
            try:
                extracted_text = content[:4096].decode("utf-8", errors="ignore").lower()
            except Exception:
                pass

        filename_lower = filename.lower()

        # 3. Engineering / P&ID Check
        if any(kw in filename_lower or kw in extracted_text for kw in cls.ENGINEERING_KEYWORDS):
            return ClassificationResult(
                category=DocumentCategory.ENGINEERING,
                subtype=DocumentSubtype.P_AND_ID if "p&id" in filename_lower or "p&id" in extracted_text else DocumentSubtype.ENGINEERING_DRAWING,
                confidence=0.90,
                strategy="ENGINEERING_PIPELINE"
            )

        # 4. Technical Documentation Check
        if any(kw in filename_lower or kw in extracted_text for kw in cls.TECHNICAL_KEYWORDS):
            sub = DocumentSubtype.SOP if "sop" in filename_lower else DocumentSubtype.TECHNICAL_SPECIFICATION
            return ClassificationResult(
                category=DocumentCategory.TECHNICAL,
                subtype=sub,
                confidence=0.88,
                strategy="TEXT_PIPELINE"
            )

        # 5. Operational Records Check
        if any(kw in filename_lower or kw in extracted_text for kw in cls.OPERATIONAL_KEYWORDS):
            sub = DocumentSubtype.MAINTENANCE_LOG if "maintenance" in filename_lower else DocumentSubtype.INSPECTION_REPORT
            return ClassificationResult(
                category=DocumentCategory.OPERATIONAL,
                subtype=sub,
                confidence=0.85,
                strategy="TEXT_PIPELINE"
            )

        # 6. Compliance Documents Check
        if any(kw in filename_lower or kw in extracted_text for kw in cls.COMPLIANCE_KEYWORDS):
            return ClassificationResult(
                category=DocumentCategory.COMPLIANCE,
                subtype=DocumentSubtype.SAFETY_PROCEDURE,
                confidence=0.85,
                strategy="TEXT_PIPELINE"
            )

        # Default fallback to General Document
        return ClassificationResult(
            category=DocumentCategory.GENERAL,
            subtype=subtype,
            confidence=0.75,
            strategy="TEXT_PIPELINE"
        )
