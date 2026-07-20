"""Upload request and response DTOs for Industrial Document Intelligence Service.
"""

from typing import Optional
from pydantic import BaseModel, Field


class UploadResponseData(BaseModel):
    document_id: str
    logical_document_id: str
    version: str = "1.0"
    filename: str
    file_hash: str
    size_bytes: int
    mime_type: str
    processing_state: str = "Uploaded"
    task_id: str


class DocumentStatusData(BaseModel):
    document_id: str
    logical_document_id: str
    version: str
    filename: str
    category: str
    subtype: str
    status: str
    task_id: Optional[str] = None
    created_at: str
