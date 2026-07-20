import httpx
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger

class GatewayClient:
    """
    Typed Internal Microservice SDK Client.
    Routes calls through the API Gateway (Port 8000) or direct fallback service URLs,
    attaching correlation IDs and user authentication headers.
    """
    def __init__(self):
        self.gateway_url = settings.GATEWAY_URL

    async def _request(
        self,
        method: str,
        path: str,
        direct_base_url: str,
        json_data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
        timeout_seconds: float = 30.0
    ) -> Dict[str, Any]:
        req_headers = headers.copy() if headers else {}

        # 1. Try Gateway first
        gateway_endpoint = f"{self.gateway_url}{path}"
        try:
            async with httpx.AsyncClient(timeout=timeout_seconds) as client:
                res = await client.request(
                    method,
                    gateway_endpoint,
                    json=json_data,
                    params=params,
                    headers=req_headers
                )
                if res.is_success:
                    return res.json()
        except Exception as e:
            logger.debug(f"[GatewayClient] Gateway request to {gateway_endpoint} failed ({e}). Attempting direct fallback...")

        # 2. Direct Service Fallback
        direct_endpoint = f"{direct_base_url}{path}"
        async with httpx.AsyncClient(timeout=timeout_seconds) as client:
            res = await client.request(
                method,
                direct_endpoint,
                json=json_data,
                params=params,
                headers=req_headers
            )
            if not res.is_success:
                logger.error(f"[GatewayClient] Direct service call failed ({res.status_code}): {res.text[:200]}")
                raise httpx.HTTPStatusError(f"Service returned {res.status_code}", request=res.request, response=res)
            return res.json()

    # ── Service Methods ─────────────────────────────────────────────

    async def search_enterprise_knowledge(
        self,
        query: str,
        limit: int = 5,
        headers: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Queries Retrieval Service via Gateway /api/v1/retrieve/search."""
        return await self._request(
            method="POST",
            path="/api/v1/retrieve/search",
            direct_base_url=settings.RETRIEVAL_SERVICE_URL,
            json_data={"query": query, "top_k": limit},
            headers=headers
        )

    async def get_grounded_reasoning(
        self,
        query: str,
        context_documents: Optional[list] = None,
        headers: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Queries Grounded Reasoning Service via Gateway /api/v1/reason."""
        return await self._request(
            method="POST",
            path="/api/v1/reason",
            direct_base_url=settings.REASONING_SERVICE_URL,
            json_data={"query": query, "context_documents": context_documents or []},
            headers=headers,
            timeout_seconds=60.0
        )

    async def get_compliance_findings(
        self,
        headers: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Queries Compliance Service via Gateway /api/v1/compliance/findings."""
        return await self._request(
            method="GET",
            path="/api/v1/compliance/findings",
            direct_base_url=settings.COMPLIANCE_SERVICE_URL,
            headers=headers
        )

    async def get_maintenance_findings(
        self,
        headers: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Queries Maintenance Service via Gateway /api/v1/maintenance/findings."""
        return await self._request(
            method="GET",
            path="/api/v1/maintenance/findings",
            direct_base_url=settings.MAINTENANCE_SERVICE_URL,
            headers=headers
        )

    async def list_knowledge_packages(
        self,
        headers: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Queries Knowledge Service via Gateway /api/v1/knowledge/packages."""
        return await self._request(
            method="GET",
            path="/api/v1/knowledge/packages",
            direct_base_url=settings.KNOWLEDGE_SERVICE_URL,
            headers=headers
        )

gateway_client = GatewayClient()
