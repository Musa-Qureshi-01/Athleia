"""
Request ID & Correlation ID Middleware.

Every request entering the gateway receives:
  - X-Request-ID:     Preserved from client if sent, generated otherwise.
                      Clients should store this and use it in support tickets.
  - X-Correlation-ID: Always generated fresh by the gateway for each hop.
                      Used to trace a single request across multiple services.

Both IDs are bound to the structlog context so they appear in every log
entry generated during that request's lifecycle without explicit passing.
"""

from __future__ import annotations

import uuid

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.core.logging import bind_request_context


class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Injects X-Request-ID and X-Correlation-ID into the request state
    and response headers. Binds both to the structlog context.
    """

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        # Preserve client-supplied request ID, otherwise generate one
        request_id = (
            request.headers.get("x-request-id")
            or f"req_{uuid.uuid4().hex[:12]}"
        )
        # Correlation ID is always fresh — it identifies this gateway hop
        correlation_id = f"cor_{uuid.uuid4().hex[:12]}"

        # Store on request state for downstream middleware and handlers
        request.state.request_id = request_id
        request.state.correlation_id = correlation_id

        # Bind to structlog context for this asyncio task
        bind_request_context(request_id=request_id, correlation_id=correlation_id)

        response = await call_next(request)

        response.headers["x-request-id"] = request_id
        response.headers["x-correlation-id"] = correlation_id

        return response
