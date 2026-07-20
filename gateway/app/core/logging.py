"""
Structured logging setup for the API Gateway.

Uses structlog with JSON output in production and coloured console output
in development. Every log entry carries a request_id and correlation_id
when called from within a request context.

Fields follow OpenTelemetry semantic conventions so a future OTLP exporter
requires zero log-format changes.

Usage:
    from app.core.logging import get_logger, bind_request_context

    logger = get_logger(__name__)
    logger.info("upstream_response", status=200, duration_ms=45)
"""

from __future__ import annotations

import logging
import sys
from contextvars import ContextVar
from typing import Any

import structlog

# ── Per-request context variables ─────────────────────────────────────────
_request_id_var: ContextVar[str] = ContextVar("request_id", default="-")
_correlation_id_var: ContextVar[str] = ContextVar("correlation_id", default="-")
_service_var: ContextVar[str] = ContextVar("service", default="-")


def bind_request_context(
    request_id: str,
    correlation_id: str,
    service: str = "-",
) -> None:
    """Bind tracing IDs to the current async context."""
    _request_id_var.set(request_id)
    _correlation_id_var.set(correlation_id)
    _service_var.set(service)


def _add_gateway_context(
    logger: Any,  # noqa: ARG001
    method_name: str,  # noqa: ARG001
    event_dict: dict[str, Any],
) -> dict[str, Any]:
    """structlog processor: inject request context from ContextVars."""
    event_dict["request_id"] = _request_id_var.get()
    event_dict["correlation_id"] = _correlation_id_var.get()
    event_dict["service"] = _service_var.get()
    return event_dict


def setup_logging(debug: bool = False) -> None:
    """
    Configure structlog and stdlib logging.

    Call once at application startup via lifespan.
    """
    shared_processors: list[Any] = [
        structlog.contextvars.merge_contextvars,
        _add_gateway_context,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
    ]

    if debug:
        # Development: coloured, human-readable output
        renderer: Any = structlog.dev.ConsoleRenderer(colors=True)
    else:
        # Production: machine-parseable JSON
        renderer = structlog.processors.JSONRenderer()

    structlog.configure(
        processors=[
            *shared_processors,
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    formatter = structlog.stdlib.ProcessorFormatter(
        processor=renderer,
        foreign_pre_chain=shared_processors,
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.handlers = [handler]
    root_logger.setLevel(logging.DEBUG if debug else logging.INFO)

    # Suppress noisy uvicorn access logs — the gateway middleware logs instead
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


def get_logger(name: str) -> structlog.stdlib.BoundLogger:
    """Return a named structlog logger."""
    return structlog.get_logger(name)
