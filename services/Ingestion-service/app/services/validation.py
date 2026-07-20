"""Validation Layer for Altheia Industrial Document Intelligence Service.

Enforces ingress security barrier: MIME magic bytes check, file size quota check,
and SHA-256 duplicate collision detection.
"""

import hashlib
import os
from typing import Tuple
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.models import DocumentRecord
from app.domain.taxonomy import MIME_MAGIC_SIGNATURES, SUPPORTED_EXTENSIONS, DocumentSubtype


class ValidationError(Exception):
    def __init__(self, code: str, message: str, details: dict = None):
        self.code = code
        self.message = message
        self.details = details or {}
        super().__init__(message)


class DuplicateDocumentError(Exception):
    def __init__(self, existing_doc_id: str, file_hash: str):
        self.existing_doc_id = existing_doc_id
        self.file_hash = file_hash
        super().__init__(f"Duplicate file detected with hash {file_hash}")


class ValidationService:
    @staticmethod
    def validate_file_meta(filename: str, mime_type: str, file_size: int) -> DocumentSubtype:
        """Validates file extension, mime type whitelist, and size limit."""
        if file_size > settings.MAX_UPLOAD_SIZE_BYTES:
            raise ValidationError(
                code="FILE_TOO_LARGE",
                message=f"File size {file_size} bytes exceeds maximum allowed threshold of {settings.MAX_UPLOAD_SIZE_BYTES} bytes.",
                details={"file_size": file_size, "max_allowed": settings.MAX_UPLOAD_SIZE_BYTES}
            )

        ext = os.path.splitext(filename)[1].lower()
        if ext not in SUPPORTED_EXTENSIONS:
            raise ValidationError(
                code="UNSUPPORTED_EXTENSION",
                message=f"Extension '{ext}' is not supported.",
                details={"extension": ext, "supported": list(SUPPORTED_EXTENSIONS.keys())}
            )

        if mime_type not in settings.ALLOWED_MIME_TYPES:
            raise ValidationError(
                code="UNSUPPORTED_MIME_TYPE",
                message=f"MIME type '{mime_type}' is not allowed.",
                details={"mime_type": mime_type}
            )

        return SUPPORTED_EXTENSIONS[ext]

    @staticmethod
    def validate_magic_bytes(mime_type: str, content: bytes) -> None:
        """Validates binary magic bytes to prevent extension spoofing."""
        expected_signatures = MIME_MAGIC_SIGNATURES.get(mime_type, [])
        if not expected_signatures:
            return  # Text-based files with no fixed binary header

        is_valid = any(content.startswith(sig) for sig in expected_signatures)
        if not is_valid:
            raise ValidationError(
                code="MIME_MAGIC_MISMATCH",
                message=f"File binary header does not match expected MIME signature for '{mime_type}'.",
                details={"mime_type": mime_type}
            )

    @staticmethod
    async def check_duplicate(db: AsyncSession, tenant_id: str, file_hash: str) -> None:
        """Checks SHA-256 duplicate collision in tenant namespace."""
        stmt = select(DocumentRecord).where(
            DocumentRecord.tenant_id == tenant_id,
            DocumentRecord.file_hash == file_hash
        )
        result = await db.execute(stmt)
        existing = result.scalars().first()
        if existing:
            raise DuplicateDocumentError(existing_doc_id=existing.id, file_hash=file_hash)

    @classmethod
    def compute_sha256(cls, content: bytes) -> str:
        """Computes SHA-256 hash of file content bytes."""
        return hashlib.sha256(content).hexdigest()
