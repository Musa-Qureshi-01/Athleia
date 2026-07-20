"""
Structured Request/Response Logging Middleware.

Logs every request and response with a consistent set of fields.
The entry and exit log lines are correlated by request_id so they
can be joined in any log aggregation system.

Fields emitted on entry:
  method, path, client_ip, request_id, correlation_id

Fields emitted on exit:
  method, path, status_code, duration_ms, request_id

Errors (5xx from upstream or gateway internal) are logged at ERROR level.
"""

from __future__ import annotations

import time

from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response

from app.core.logging import get_logger

logger = get_logger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Emits structured log lines at request entry and response exit.

    Runs after RequestIDMiddleware so request_id and correlation_id
    are already bound to the structlog context.
    """

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        request_id = getattr(request.state, "request_id", "-")
        client_ip = request.client.host if request.client else "unknown"

        logger.info(
            "request_received",
            method=request.method,
            path=str(request.url.path),
            client_ip=client_ip,
            request_id=request_id,
        )

        start = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception as exc:  # noqa: BLE001
            duration_ms = int((time.perf_counter() - start) * 1000)
            logger.error(
                "request_unhandled_exception",
                method=request.method,
                path=str(request.url.path),
                duration_ms=duration_ms,
                error=str(exc),
                request_id=request_id,
            )
            raise

        duration_ms = int((time.perf_counter() - start) * 1000)
        log_fn = logger.error if response.status_code >= 500 else logger.info

        log_fn(
            "request_completed",
            method=request.method,
            path=str(request.url.path),
            status_code=response.status_code,
            duration_ms=duration_ms,
            request_id=request_id,
        )

        response.headers["x-response-time-ms"] = str(duration_ms)
        return response
