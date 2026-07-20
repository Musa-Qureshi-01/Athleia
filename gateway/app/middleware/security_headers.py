"""
Security Headers Middleware.

Injects HTTP security headers on every response. These headers harden
the API surface against common web vulnerabilities.

Headers applied:
  Strict-Transport-Security — enforce HTTPS in production
  X-Content-Type-Options    — prevent MIME sniffing
  X-Frame-Options           — prevent clickjacking
  X-XSS-Protection          — legacy XSS filter (belt and suspenders)
  Referrer-Policy           — limit referrer leakage
  Cache-Control             — prevent caching of API responses
  Permissions-Policy        — disable unused browser features

Note: CORS is handled separately by FastAPI's CORSMiddleware which
must run before this middleware so its headers are not overwritten.
"""

from __future__ import annotations

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response


_SECURITY_HEADERS: dict[str, str] = {
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "x-xss-protection": "1; mode=block",
    "referrer-policy": "strict-origin-when-cross-origin",
    "cache-control": "no-store, no-cache, must-revalidate",
    "permissions-policy": "geolocation=(), microphone=(), camera=()",
    "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Appends security headers to every outgoing response."""

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        response = await call_next(request)
        for header, value in _SECURITY_HEADERS.items():
            response.headers[header] = value
        return response
