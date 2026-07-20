"""
Retry Policy — idempotent requests only.

Rules:
  • Only GET, HEAD, OPTIONS are retried (idempotent by definition).
  • POST, PUT, PATCH, DELETE are NEVER retried — the upstream may have
    already processed the request and retrying could cause side effects
    (double charges, duplicate records, conflicting writes).
  • Retries use exponential backoff with a hard cap per attempt.
  • A request is retried only on: timeout, network error, or 5xx response.
  • 4xx responses are NOT retried — they indicate client errors.

This module does not call the proxy directly. It provides the retry
execution logic that the router calls with a pre-built coroutine factory.
"""

from __future__ import annotations

import asyncio
from typing import Awaitable, Callable, TypeVar

import httpx
from fastapi import Response

from app.core.logging import get_logger

logger = get_logger(__name__)

T = TypeVar("T")

# HTTP methods safe to retry
_IDEMPOTENT_METHODS: frozenset[str] = frozenset({"GET", "HEAD", "OPTIONS"})

# Base delay between retries (seconds); doubles each attempt
_BASE_DELAY_SECONDS = 0.5
_MAX_DELAY_SECONDS = 4.0


def is_retryable_method(method: str) -> bool:
    """Return True if this HTTP method may be retried on failure."""
    return method.upper() in _IDEMPOTENT_METHODS


def is_retryable_status(status_code: int) -> bool:
    """Return True if the upstream status code warrants a retry."""
    return status_code >= 500


async def execute_with_retry(
    method: str,
    max_retries: int,
    attempt_fn: Callable[[], Awaitable[Response]],
    *,
    service: str,
    instance_url: str,
) -> tuple[Response, bool]:
    """
    Execute attempt_fn up to (1 + max_retries) times.

    Args:
        method: HTTP method string (used to gate retry eligibility).
        max_retries: Maximum number of retry attempts after the first.
        attempt_fn: Zero-argument async callable that performs one proxy call.
        service: Service name for logging context.
        instance_url: Instance URL for logging context.

    Returns:
        Tuple of (Response, did_succeed) where did_succeed is True if
        the final attempt returned a non-5xx response.
    """
    if not is_retryable_method(method) or max_retries == 0:
        # Non-idempotent or retries disabled — single attempt only
        try:
            response = await attempt_fn()
            succeeded = not is_retryable_status(response.status_code)
            return response, succeeded
        except (httpx.TimeoutException, httpx.RequestError) as exc:
            logger.warning(
                "proxy_request_failed_no_retry",
                service=service,
                instance=instance_url,
                error=str(exc),
            )
            raise

    last_response: Response | None = None
    last_exception: Exception | None = None

    for attempt in range(max_retries + 1):
        try:
            response = await attempt_fn()

            if not is_retryable_status(response.status_code):
                if attempt > 0:
                    logger.info(
                        "retry_succeeded",
                        service=service,
                        instance=instance_url,
                        attempt=attempt,
                        status_code=response.status_code,
                    )
                return response, True

            last_response = response
            logger.warning(
                "retry_upstream_error",
                service=service,
                instance=instance_url,
                attempt=attempt,
                status_code=response.status_code,
                max_retries=max_retries,
            )

        except (httpx.TimeoutException, httpx.RequestError) as exc:
            last_exception = exc
            logger.warning(
                "retry_network_error",
                service=service,
                instance=instance_url,
                attempt=attempt,
                error=str(exc),
                max_retries=max_retries,
            )

        # Backoff before next attempt (not after the last)
        if attempt < max_retries:
            delay = min(_BASE_DELAY_SECONDS * (2**attempt), _MAX_DELAY_SECONDS)
            await asyncio.sleep(delay)

    # All attempts exhausted
    if last_exception is not None:
        raise last_exception

    return last_response, False  # type: ignore[return-value]
