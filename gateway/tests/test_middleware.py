"""
Test: Middleware — RequestID and SecurityHeaders
"""
import pytest
from httpx import AsyncClient, ASGITransport
from fastapi import FastAPI
from fastapi.responses import JSONResponse

from app.middleware.request_id import RequestIDMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware


def make_app() -> FastAPI:
    app = FastAPI()
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RequestIDMiddleware)

    @app.get("/ping")
    async def ping():
        return JSONResponse({"pong": True})

    return app


@pytest.mark.asyncio
async def test_request_id_generated_when_absent():
    app = make_app()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/ping")
        assert "x-request-id" in r.headers
        assert r.headers["x-request-id"].startswith("req_")


@pytest.mark.asyncio
async def test_request_id_preserved_when_client_sends():
    app = make_app()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/ping", headers={"x-request-id": "my-custom-id"})
        assert r.headers["x-request-id"] == "my-custom-id"


@pytest.mark.asyncio
async def test_correlation_id_always_generated():
    app = make_app()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/ping")
        assert "x-correlation-id" in r.headers
        assert r.headers["x-correlation-id"].startswith("cor_")


@pytest.mark.asyncio
async def test_security_headers_present():
    app = make_app()
    required = [
        "x-content-type-options",
        "x-frame-options",
        "x-xss-protection",
        "referrer-policy",
        "cache-control",
        "strict-transport-security",
    ]
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/ping")
        for header in required:
            assert header in r.headers, f"Missing security header: {header}"


@pytest.mark.asyncio
async def test_x_frame_options_is_deny():
    app = make_app()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/ping")
        assert r.headers["x-frame-options"] == "DENY"


@pytest.mark.asyncio
async def test_x_content_type_is_nosniff():
    app = make_app()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/ping")
        assert r.headers["x-content-type-options"] == "nosniff"
