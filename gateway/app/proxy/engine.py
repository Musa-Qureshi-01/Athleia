"""
Reverse Proxy Engine.

Handles the core forwarding responsibility:
  1. Build the upstream URL from the instance URL + original path + query string.
  2. Rewrite the Host header to the upstream host.
  3. Strip hop-by-hop headers that must not be forwarded.
  4. Forward the request body unchanged.
  5. Stream the upstream response back to the client.
  6. Inject gateway tracing headers into the upstream request.

The ProxyEngine holds a shared httpx.AsyncClient per engine instance.
The client is created once at gateway startup (via lifespan) and reused
across requests to enable connection pooling.

Connection pool settings:
  - max_connections: 200 (configurable)
  - max_keepalive_connections: 50
  - keepalive_expiry: 30s

These are conservative defaults. Tune based on observed p99 concurrency.
"""

from __future__ import annotations

import httpx
from fastapi import Request, Response

from app.core.logging import get_logger

logger = get_logger(__name__)

# Headers that must not be forwarded between hops (RFC 7230 §6.1)
_HOP_BY_HOP_HEADERS: frozenset[str] = frozenset(
    [
        "connection",
        "keep-alive",
        "proxy-authenticate",
        "proxy-authorization",
        "te",
        "trailers",
        "transfer-encoding",
        "upgrade",
        # Additional headers the gateway itself manages
        "host",
    ]
)


def _filter_headers(headers: dict[str, str]) -> dict[str, str]:
    """Remove hop-by-hop and gateway-managed headers from a header dict."""
    return {
        k: v
        for k, v in headers.items()
        if k.lower() not in _HOP_BY_HOP_HEADERS
    }


class ProxyEngine:
    """
    Async reverse proxy using a shared httpx.AsyncClient.

    One ProxyEngine instance is shared across the entire gateway process.
    The underlying client maintains a connection pool per upstream host.
    """

    def __init__(
        self,
        max_connections: int = 200,
        max_keepalive_connections: int = 50,
        keepalive_expiry: float = 30.0,
    ) -> None:
        limits = httpx.Limits(
            max_connections=max_connections,
            max_keepalive_connections=max_keepalive_connections,
            keepalive_expiry=keepalive_expiry,
        )
        self._client = httpx.AsyncClient(
            limits=limits,
            follow_redirects=False,  # Gateway does not follow redirects
            http2=False,             # H2 for intra-cluster: Phase 2
        )

    async def forward(
        self,
        incoming: Request,
        upstream_base_url: str,
        *,
        timeout_seconds: float = 30.0,
        request_id: str = "-",
        correlation_id: str = "-",
    ) -> Response:
        """
        Forward an incoming FastAPI request to an upstream service.

        Args:
            incoming: The original client request.
            upstream_base_url: Base URL of the chosen upstream instance
                               (e.g. "http://localhost:8002").
            timeout_seconds: Per-request timeout applied to the upstream call.
            request_id: Propagated X-Request-ID.
            correlation_id: Propagated X-Correlation-ID.

        Returns:
            A FastAPI Response containing the upstream status, headers, body.

        Raises:
            httpx.TimeoutException: When the upstream does not respond in time.
            httpx.RequestError: On network-level failures.
        """
        # Build target URL: upstream_base + original path + query string
        target_url = (
            upstream_base_url.rstrip("/")
            + str(incoming.url.path)
        )
        if incoming.url.query:
            target_url = f"{target_url}?{incoming.url.query}"

        # Prepare forwarded headers
        upstream_host = httpx.URL(upstream_base_url).host
        forwarded_headers = _filter_headers(dict(incoming.headers))
        forwarded_headers["host"] = upstream_host
        forwarded_headers["x-request-id"] = request_id
        forwarded_headers["x-correlation-id"] = correlation_id
        forwarded_headers["x-forwarded-for"] = (
            incoming.client.host if incoming.client else "unknown"
        )
        forwarded_headers["x-forwarded-proto"] = incoming.url.scheme

        body = await incoming.body()

        logger.debug(
            "proxy_forwarding",
            method=incoming.method,
            target=target_url,
            request_id=request_id,
        )

        upstream_response = await self._client.request(
            method=incoming.method,
            url=target_url,
            headers=forwarded_headers,
            content=body,
            timeout=timeout_seconds,
        )

        # Build response headers — strip hop-by-hop from upstream
        response_headers = _filter_headers(dict(upstream_response.headers))
        response_headers["x-gateway-request-id"] = request_id
        response_headers["x-gateway-correlation-id"] = correlation_id
        response_headers["x-upstream-url"] = target_url

        return Response(
            content=upstream_response.content,
            status_code=upstream_response.status_code,
            headers=response_headers,
            media_type=upstream_response.headers.get("content-type"),
        )

    async def close(self) -> None:
        """Gracefully close the underlying HTTP client connection pool."""
        await self._client.aclose()
