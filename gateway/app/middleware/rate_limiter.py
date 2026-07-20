"""
Rate Limiter Middleware — Sliding Window Algorithm.

Limits requests per client IP address using an in-memory sliding window.
Each IP's request timestamps are stored in a deque. On each request:
  1. Remove timestamps older than the window.
  2. If remaining count >= limit → return 429 with Retry-After.
  3. Otherwise → append current timestamp and proceed.

Storage backend: asyncio-safe in-memory dict.
Future backend: Replace _store with a Redis client — no algorithm change.

Configuration: Loaded from GatewaySettings (env vars).
"""

from __future__ import annotations

import time
from collections import deque

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

# Internal endpoints are exempt from rate limiting
_EXEMPT_PREFIXES: tuple[str, ...] = ("/__gateway/",)


class SlidingWindowRateLimiter(BaseHTTPMiddleware):
    """
    Per-IP sliding window rate limiter.

    One deque per IP address stores request timestamps. asyncio's
    single-threaded model means no locking is required.
    """

    def __init__(self, app, *, limit: int, window_seconds: int) -> None:
        super().__init__(app)
        self._limit = limit
        self._window = window_seconds
        # ip → deque of float timestamps
        self._store: dict[str, deque[float]] = {}

    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP, respecting X-Forwarded-For from upstream proxy."""
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        if request.client:
            return request.client.host
        return "unknown"

    def _is_exempt(self, path: str) -> bool:
        return any(path.startswith(prefix) for prefix in _EXEMPT_PREFIXES)

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        if not settings.rate_limit_enabled or self._is_exempt(request.url.path):
            return await call_next(request)

        client_ip = self._get_client_ip(request)
        now = time.monotonic()
        window_start = now - self._window

        timestamps = self._store.setdefault(client_ip, deque())

        # Evict timestamps outside the current window
        while timestamps and timestamps[0] < window_start:
            timestamps.popleft()

        if len(timestamps) >= self._limit:
            oldest = timestamps[0]
            retry_after = int(self._window - (now - oldest)) + 1

            logger.warning(
                "rate_limit_exceeded",
                client_ip=client_ip,
                request_count=len(timestamps),
                limit=self._limit,
                retry_after=retry_after,
            )

            return JSONResponse(
                status_code=429,
                content={
                    "error": "rate_limit_exceeded",
                    "message": "Too many requests. Please slow down.",
                    "retry_after_seconds": retry_after,
                },
                headers={"Retry-After": str(retry_after)},
            )

        timestamps.append(now)
        return await call_next(request)
