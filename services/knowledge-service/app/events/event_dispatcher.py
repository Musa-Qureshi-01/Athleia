"""Event Dispatcher for Knowledge Service event-driven architecture.
"""

from datetime import datetime
from typing import Any, Dict, List
from app.core.logging import logger


class EventDispatcher:
    """Emits domain events for Knowledge Graph, Retrieval, and Audit services."""

    def __init__(self):
        self.subscribers: List[Any] = []

    async def emit_knowledge_created(self, package_urn: str, version: str, domain: str, document_count: int):
        """Emits KnowledgeCreated event."""
        payload = {
            "event_type": "KnowledgeCreated",
            "package_urn": package_urn,
            "version": version,
            "domain": domain,
            "document_count": document_count,
            "timestamp": datetime.utcnow().isoformat(),
        }
        logger.info("event_emitted", **payload)

    async def emit_knowledge_published(self, package_urn: str, version: str, tenant_id: str):
        """Emits KnowledgePublished event for Retrieval and Knowledge Graph indexing."""
        payload = {
            "event_type": "KnowledgePublished",
            "package_urn": package_urn,
            "version": version,
            "tenant_id": tenant_id,
            "timestamp": datetime.utcnow().isoformat(),
        }
        logger.info("event_emitted", **payload)

    async def emit_knowledge_archived(self, package_urn: str, version: str):
        """Emits KnowledgeArchived event."""
        payload = {
            "event_type": "KnowledgeArchived",
            "package_urn": package_urn,
            "version": version,
            "timestamp": datetime.utcnow().isoformat(),
        }
        logger.info("event_emitted", **payload)


event_dispatcher = EventDispatcher()
