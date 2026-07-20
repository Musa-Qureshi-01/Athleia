"""
Test: Retry Policy
"""
import pytest
from unittest.mock import AsyncMock
from fastapi.responses import JSONResponse

from app.policy.retry import execute_with_retry, is_retryable_method


def test_idempotent_methods():
    assert is_retryable_method("GET") is True
    assert is_retryable_method("HEAD") is True
    assert is_retryable_method("OPTIONS") is True


def test_non_idempotent_methods():
    assert is_retryable_method("POST") is False
    assert is_retryable_method("PUT") is False
    assert is_retryable_method("PATCH") is False
    assert is_retryable_method("DELETE") is False


@pytest.mark.asyncio
async def test_single_attempt_success():
    response = JSONResponse({"ok": True}, status_code=200)
    attempt = AsyncMock(return_value=response)

    result, succeeded = await execute_with_retry(
        method="GET",
        max_retries=2,
        attempt_fn=attempt,
        service="test",
        instance_url="http://host",
    )
    assert succeeded is True
    assert result.status_code == 200
    assert attempt.call_count == 1


@pytest.mark.asyncio
async def test_retries_on_5xx():
    """GET with max_retries=2 should try 3 times total on persistent 500."""
    response_500 = JSONResponse({"error": "server_error"}, status_code=500)
    attempt = AsyncMock(return_value=response_500)

    result, succeeded = await execute_with_retry(
        method="GET",
        max_retries=2,
        attempt_fn=attempt,
        service="test",
        instance_url="http://host",
    )
    assert succeeded is False
    assert attempt.call_count == 3   # 1 initial + 2 retries


@pytest.mark.asyncio
async def test_no_retry_on_post():
    """POST must not be retried even on 500."""
    response_500 = JSONResponse({"error": "server_error"}, status_code=500)
    attempt = AsyncMock(return_value=response_500)

    result, succeeded = await execute_with_retry(
        method="POST",
        max_retries=3,
        attempt_fn=attempt,
        service="test",
        instance_url="http://host",
    )
    assert attempt.call_count == 1  # Never retried


@pytest.mark.asyncio
async def test_succeeds_on_second_attempt():
    """Retry should succeed when second attempt returns 200."""
    call_count = 0

    async def attempt_fn():
        nonlocal call_count
        call_count += 1
        if call_count == 1:
            return JSONResponse({}, status_code=503)
        return JSONResponse({"ok": True}, status_code=200)

    result, succeeded = await execute_with_retry(
        method="GET",
        max_retries=2,
        attempt_fn=attempt_fn,
        service="test",
        instance_url="http://host",
    )
    assert succeeded is True
    assert call_count == 2
