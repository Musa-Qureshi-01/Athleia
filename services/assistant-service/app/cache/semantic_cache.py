import hashlib
import time
from typing import Optional, Dict, Any

class SemanticCache:
    """
    In-memory semantic & exact query cache with TTL.
    Avoids duplicate LLM and retrieval calls for identical queries within the session window.
    """
    def __init__(self, ttl_seconds: int = 3600):
        self.ttl_seconds = ttl_seconds
        self._cache: Dict[str, Dict[str, Any]] = {}

    def _hash_key(self, query: str, user_id: str, mode: str) -> str:
        raw = f"{user_id}::{mode}::{query.strip().lower()}"
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    def get(self, query: str, user_id: str, mode: str) -> Optional[Dict[str, Any]]:
        key = self._hash_key(query, user_id, mode)
        entry = self._cache.get(key)
        if not entry:
            return None

        # Check expiration
        if time.time() - entry["timestamp"] > self.ttl_seconds:
            del self._cache[key]
            return None

        return entry["data"]

    def set(self, query: str, user_id: str, mode: str, data: Dict[str, Any]):
        key = self._hash_key(query, user_id, mode)
        self._cache[key] = {
            "timestamp": time.time(),
            "data": data
        }

    def clear(self):
        self._cache.clear()

semantic_cache = SemanticCache()
