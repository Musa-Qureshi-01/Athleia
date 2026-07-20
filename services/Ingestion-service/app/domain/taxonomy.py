"""Document taxonomy enumerations, MIME signatures, and supported categories for Altheia Industrial Document Intelligence Service.
"""

from enum import Enum, auto
from typing import Dict, List, Set


class DocumentCategory(str, Enum):
    GENERAL = "GENERAL"
    TECHNICAL = "TECHNICAL"
    ENGINEERING = "ENGINEERING"
    OPERATIONAL = "OPERATIONAL"
    COMPLIANCE = "COMPLIANCE"
    SCANNED = "SCANNED"
    FUTURE = "FUTURE"


class DocumentSubtype(str, Enum):
    # General
    PDF = "PDF"
    DOCX = "DOCX"
    PPTX = "PPTX"
    XLSX = "XLSX"
    CSV = "CSV"
    TXT = "TXT"
    MARKDOWN = "MARKDOWN"

    # Technical
    SOP = "SOP"
    WORK_INSTRUCTION = "WORK_INSTRUCTION"
    MAINTENANCE_MANUAL = "MAINTENANCE_MANUAL"
    EQUIPMENT_MANUAL = "EQUIPMENT_MANUAL"
    TECHNICAL_SPECIFICATION = "TECHNICAL_SPECIFICATION"
    EQUIPMENT_DATASHEET = "EQUIPMENT_DATASHEET"
    INSTALLATION_GUIDE = "INSTALLATION_GUIDE"
    TROUBLESHOOTING_GUIDE = "TROUBLESHOOTING_GUIDE"

    # Engineering
    P_AND_ID = "P_AND_ID"
    ENGINEERING_DRAWING = "ENGINEERING_DRAWING"
    MECHANICAL_DRAWING = "MECHANICAL_DRAWING"
    ELECTRICAL_DRAWING = "ELECTRICAL_DRAWING"
    INSTRUMENTATION_DRAWING = "INSTRUMENTATION_DRAWING"
    PFD = "PFD"
    CAD_EXPORT_PDF = "CAD_EXPORT_PDF"
    TECHNICAL_SCHEMATIC = "TECHNICAL_SCHEMATIC"

    # Operational
    MAINTENANCE_LOG = "MAINTENANCE_LOG"
    INSPECTION_REPORT = "INSPECTION_REPORT"
    INCIDENT_REPORT = "INCIDENT_REPORT"
    RCA_REPORT = "RCA_REPORT"
    SHIFT_REPORT = "SHIFT_REPORT"
    WORK_ORDER = "WORK_ORDER"
    ASSET_HISTORY = "ASSET_HISTORY"
    CALIBRATION_REPORT = "CALIBRATION_REPORT"

    # Compliance
    ISO_DOCUMENT = "ISO_DOCUMENT"
    OSHA_DOCUMENT = "OSHA_DOCUMENT"
    SAFETY_PROCEDURE = "SAFETY_PROCEDURE"
    RISK_ASSESSMENT = "RISK_ASSESSMENT"
    AUDIT_REPORT = "AUDIT_REPORT"
    REGULATORY_DOCUMENT = "REGULATORY_DOCUMENT"

    # Scanned / Image
    SCANNED_PDF = "SCANNED_PDF"
    PNG = "PNG"
    JPG = "JPG"
    TIFF = "TIFF"
    BMP = "BMP"
    WEBP = "WEBP"

    # Future
    CAD_NATIVE = "CAD_NATIVE"
    BIM_MODEL = "BIM_MODEL"
    IOT_LOG = "IOT_LOG"
    SENSOR_LOG = "SENSOR_LOG"
    VIDEO_INSPECTION = "VIDEO_INSPECTION"
    AUDIO_MAINTENANCE = "AUDIO_MAINTENANCE"
    MODEL_3D = "MODEL_3D"
    UNKNOWN = "UNKNOWN"


# Supported extensions mapping
SUPPORTED_EXTENSIONS: Dict[str, DocumentSubtype] = {
    ".pdf": DocumentSubtype.PDF,
    ".docx": DocumentSubtype.DOCX,
    ".pptx": DocumentSubtype.PPTX,
    ".xlsx": DocumentSubtype.XLSX,
    ".csv": DocumentSubtype.CSV,
    ".txt": DocumentSubtype.TXT,
    ".md": DocumentSubtype.MARKDOWN,
    ".markdown": DocumentSubtype.MARKDOWN,
    ".png": DocumentSubtype.PNG,
    ".jpg": DocumentSubtype.JPG,
    ".jpeg": DocumentSubtype.JPG,
    ".tiff": DocumentSubtype.TIFF,
    ".tif": DocumentSubtype.TIFF,
    ".bmp": DocumentSubtype.BMP,
    ".webp": DocumentSubtype.WEBP,
}

# Binary MIME Magic Bytes Signatures for Ingress Security Validation
MIME_MAGIC_SIGNATURES: Dict[str, List[bytes]] = {
    "application/pdf": [b"%PDF-"],
    "image/png": [b"\x89PNG\r\n\x1a\n"],
    "image/jpeg": [b"\xff\xd8\xff"],
    "image/tiff": [b"II*\x00", b"MM\x00*"],
    "image/bmp": [b"BM"],
    "image/webp": [b"RIFF"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [b"PK\x03\x04"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [b"PK\x03\x04"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": [b"PK\x03\x04"],
    "text/plain": [],
    "text/csv": [],
    "text/markdown": [],
}
