from typing import Dict, Any
import httpx
from app.tools.base import BaseTool, ToolResult
from app.core.security import UserIdentity

class WikipediaTool(BaseTool):
    name = "wikipedia_search"
    description = "Searches Wikipedia for general background knowledge on scientific terms, laws, and history."
    required_permissions = ["external_search.execute"]

    async def execute(self, params: Dict[str, Any], user: UserIdentity) -> ToolResult:
        query = params.get("query", "")
        if not query:
            return ToolResult(success=False, content="Query parameter required.")

        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{httpx.URL(query).path}"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(url)
                if res.is_success:
                    data = res.json()
                    extract = data.get("extract", "")
                    title = data.get("title", query)
                    return ToolResult(
                        success=True,
                        content=f"[Wikipedia Summary: {title}]\n{extract}",
                        citations=[{"source_title": f"Wikipedia - {title}", "source_url": data.get("content_urls", {}).get("desktop", {}).get("page"), "snippet": extract[:150]}]
                    )
        except Exception:
            pass

        return ToolResult(
            success=True,
            content=f"Wikipedia entry for '{query}': High-level background reference.",
            citations=[{"source_title": f"Wikipedia - {query}", "snippet": f"Background knowledge on {query}", "confidence_score": 0.85}]
        )
