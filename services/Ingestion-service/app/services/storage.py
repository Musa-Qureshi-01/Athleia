"""Storage Manager & Providers for Altheia Industrial Document Intelligence Service.

Supports pluggable Local File Storage and Amazon S3 Cloud Object Storage.
"""

from abc import ABC, abstractmethod
import os
import aiofiles
import boto3
from botocore.exceptions import BotoCoreError, ClientError

from app.core.config import settings
from app.core.logging import logger


class BaseStorageProvider(ABC):
    @abstractmethod
    async def save_raw_file(self, tenant_id: str, file_hash: str, filename: str, content: bytes) -> str:
        """Persists file payload and returns storage URI."""
        pass

    @abstractmethod
    async def read_raw_file(self, storage_path: str) -> bytes:
        """Reads file payload from storage URI."""
        pass


class LocalStorageProvider(BaseStorageProvider):
    def get_storage_path(self, tenant_id: str, file_hash: str, filename: str) -> str:
        hash_prefix = file_hash[:2]
        ext = os.path.splitext(filename)[1].lower()
        dir_path = os.path.join(settings.STORAGE_BASE_DIR, tenant_id, hash_prefix)
        os.makedirs(dir_path, exist_ok=True)
        return os.path.join(dir_path, f"{file_hash}{ext}")

    async def save_raw_file(self, tenant_id: str, file_hash: str, filename: str, content: bytes) -> str:
        target_path = self.get_storage_path(tenant_id, file_hash, filename)
        async with aiofiles.open(target_path, "wb") as f:
            await f.write(content)
        return target_path

    async def read_raw_file(self, storage_path: str) -> bytes:
        if not os.path.exists(storage_path):
            raise FileNotFoundError(f"Local storage path {storage_path} does not exist.")
        async with aiofiles.open(storage_path, "rb") as f:
            return await f.read()


class S3StorageProvider(BaseStorageProvider):
    def __init__(self):
        kwargs = {"region_name": settings.AWS_REGION}
        if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
            kwargs["aws_access_key_id"] = settings.AWS_ACCESS_KEY_ID
            kwargs["aws_secret_access_key"] = settings.AWS_SECRET_ACCESS_KEY
        self.s3_client = boto3.client("s3", **kwargs)
        self.bucket = settings.AWS_S3_BUCKET_NAME

    def get_object_key(self, tenant_id: str, file_hash: str, filename: str) -> str:
        ext = os.path.splitext(filename)[1].lower()
        hash_prefix = file_hash[:2]
        return f"raw/{tenant_id}/{hash_prefix}/{file_hash}{ext}"

    async def save_raw_file(self, tenant_id: str, file_hash: str, filename: str, content: bytes) -> str:
        object_key = self.get_object_key(tenant_id, file_hash, filename)
        try:
            self.s3_client.put_object(
                Bucket=self.bucket,
                Key=object_key,
                Body=content
            )
            s3_uri = f"s3://{self.bucket}/{object_key}"
            logger.info("s3_file_persisted", s3_uri=s3_uri, bucket=self.bucket, object_key=object_key)
            return s3_uri
        except (BotoCoreError, ClientError) as e:
            logger.warn("s3_upload_failed_fallback_local", error=str(e), bucket=self.bucket)
            # Safe fallback to local storage provider if S3 bucket permissions/credentials fail locally
            local_provider = LocalStorageProvider()
            return await local_provider.save_raw_file(tenant_id, file_hash, filename, content)

    async def read_raw_file(self, storage_path: str) -> bytes:
        if storage_path.startswith("s3://"):
            # Parse s3://bucket/key
            path_parts = storage_path.replace("s3://", "").split("/", 1)
            bucket = path_parts[0]
            key = path_parts[1]
            try:
                response = self.s3_client.get_object(Bucket=bucket, Key=key)
                return response["Body"].read()
            except (BotoCoreError, ClientError) as e:
                raise FileNotFoundError(f"Could not retrieve S3 object {storage_path}: {str(e)}")
        else:
            local_provider = LocalStorageProvider()
            return await local_provider.read_raw_file(storage_path)


class StorageManager:
    @classmethod
    def get_provider(cls) -> BaseStorageProvider:
        if settings.STORAGE_BACKEND.lower() == "s3":
            return S3StorageProvider()
        return LocalStorageProvider()

    @classmethod
    async def save_raw_file(cls, tenant_id: str, file_hash: str, filename: str, content: bytes) -> str:
        provider = cls.get_provider()
        return await provider.save_raw_file(tenant_id, file_hash, filename, content)

    @classmethod
    async def read_raw_file(cls, storage_path: str) -> bytes:
        provider = cls.get_provider()
        return await provider.read_raw_file(storage_path)
