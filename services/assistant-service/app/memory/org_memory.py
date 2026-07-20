from typing import Dict, Any, Optional
from app.clients.gateway_client import gateway_client

class OrgMemoryManager:
    """
    Layer 3 Memory: Organization Context Memory.
    Delegates directly to Knowledge Service / Ingestion Service on demand.
    Never duplicates enterprise knowledge inside Assistant local memory.
    """
    async def fetch_org_context(self, query: str, user_token: Optional[str] = None) -> Dict[str, Any]:
        headers = {"Authorization": f"Bearer {user_token}"} if user_token else None
        try:
            res = await gateway_client.search_enterprise_knowledge(query=query, limit=3, headers=headers)
            return {
                "org_knowledge_found": True,
                "snippets": [r.get("content", "") for r in res.get("results", [])]
            }
        except Exception:
            return {"org_knowledge_found": False, "snippets": []}

org_memory = OrgMemoryManager()
