"""
Test: Sliding Window Rate Limiter
"""
import asyncio
import pytest
from httpx import AsyncClient, ASGITransport
from fastapi import FastAPI
from fastapi.responses import JSONResponse

from app.middleware.rate_limiter import SlidingWindowRateLimiter


def make_app(limit: int, window: int) -> FastAPI:
    app = FastAPI()
    app.add_middleware(SlidingWindowRateLimiter, limit=limit, window_seconds=window)

    @app.get("/test")
    async def test_route():
        return JSONResponse({"ok": True})

    return app


@pytest.mark.asyncio
async def test_requests_within_limit_pass():
    app = make_app(limit=5, window=60)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        for _ in range(5):
            r = await client.get("/test")
            assert r.status_code == 200


@pytest.mark.asyncio
async def test_request_over_limit_returns_429():
    app = make_app(limit=3, window=60)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        for _ in range(3):
            await client.get("/test")
        r = await client.get("/test")
        assert r.status_code == 429
        body = r.json()
        assert body["error"] == "rate_limit_exceeded"
        assert "retry_after_seconds" in body


@pytest.mark.asyncio
async def test_rate_limit_includes_retry_after_header():
    app = make_app(limit=1, window=60)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        await client.get("/test")
        r = await client.get("/test")
        assert r.status_code == 429
        assert "retry-after" in r.headers


@pytest.mark.asyncio
async def test_gateway_internal_route_is_exempt():
    """/__gateway/* paths must never be rate-limited."""
    from fastapi.responses import JSONResponse as JR

    app = make_app(limit=1, window=60)

    @app.get("/__gateway/health")
    async def health():
        return JR({"ok": True})

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        for _ in range(5):
            r = await client.get("/__gateway/health")
            assert r.status_code == 200
