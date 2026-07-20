"""Blob Storage Manager for Knowledge Service package archives.
"""

import os
from typing import Optional
from app.core.config import settings


class BlobStorageManager:
    """Manages physical storage of exported OKF zip and archive bundles."""

    def __init__(self, storage_dir: str = settings.STORAGE_DIR):
        self.storage_dir = storage_dir
        os.makedirs(self.storage_dir, exist_ok=True)

    def save_bundle(self, package_urn: str, version: str, data: bytes) -> str:
        """Saves archive bytes to storage and returns file path."""
        safe_name = f"{package_urn.replace(':', '_')}_v{version}.zip"
        filepath = os.path.join(self.storage_dir, safe_name)
        with open(filepath, "wb") as f:
            f.write(data)
        return filepath

    def get_bundle(self, package_urn: str, version: str) -> Optional[bytes]:
        """Reads archive bytes from storage if available."""
        safe_name = f"{package_urn.replace(':', '_')}_v{version}.zip"
        filepath = os.path.join(self.storage_dir, safe_name)
        if not os.path.exists(filepath):
            return None
        with open(filepath, "rb") as f:
            return f.read()


blob_storage = BlobStorageManager()
