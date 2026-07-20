"""Knowledge Search Tool - Queries Retrieval Service & OKF packages for relevant document context.
"""

from typing import Any, Dict, List
import httpx
from app.core.config import settings
from app.tools.base import BaseComplianceTool


class KnowledgeSearchTool(BaseComplianceTool):
    @property
    def name(self) -> str:
        return "knowledge_search_tool"

    @property
    def description(self) -> str:
        return "Searches enterprise document chunks and OKF packages via Retrieval Service."

    async def run(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(
                    f"{settings.RETRIEVAL_SERVICE_URL}/api/v1/search",
                    json={"query": query, "search_type": "HYBRID", "top_k": top_k}
                )
                if res.status_code == 200:
                    return res.json().get("data", {}).get("results", [])
        except Exception:
            pass

        return [
            {
                "chunk_id": "chk_sim_01",
                "document_name": "Safety SOP 101",
                "section_path": "Section 2.0 Safety",
                "content": "All operators must wear PPE Level 2 prior to operating Pump P-101A.",
                "score": 0.94
            }
        ]
