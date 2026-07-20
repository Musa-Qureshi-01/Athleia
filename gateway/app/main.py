"""
Athleia.ai — Enterprise API Gateway
FastAPI Application Entrypoint.

Startup sequence (lifespan):
  1. Configure structured logging
  2. Load services.yaml configuration
  3. Initialise StaticServiceRegistry
  4. Create ProxyEngine (opens httpx connection pool)
  5. Create CircuitBreaker, MetricsCollector
  6. Create GatewayRouter (wires all modules together)
  7. Start HealthManager background task
  8. Attach GatewayRouter to app.state

Shutdown sequence (lifespan teardown):
  1. Stop HealthManager (cancels background task)
  2. Close ProxyEngine (drains connection pool)

Middleware order (outermost to innermost):
  CORSMiddleware
  RequestIDMiddleware       ← generates request_id / correlation_id
  SecurityHeadersMiddleware ← injects security headers
  LoggingMiddleware         ← structured entry + exit logs
  SlidingWindowRateLimiter  ← 429 on exceeded rate
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import services_config, settings
from app.core.logging import get_logger, setup_logging
from app.health.manager import HealthManager
from app.metrics.collector import MetricsCollector
from app.middleware.logging_mw import LoggingMiddleware
from app.middleware.rate_limiter import SlidingWindowRateLimiter
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.policy.circuit_breaker import CircuitBreaker
from app.proxy.engine import ProxyEngine
from app.registry.static import StaticServiceRegistry
from app.router.gateway_router import GatewayRouter, router

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ────────────────────────────────────────────────────────────
    setup_logging(debug=settings.debug)
    logger.info(
        "gateway_starting",
        environment=settings.environment,
        port=settings.gateway_port,
    )

    registry = StaticServiceRegistry(services_config)
    proxy = ProxyEngine()

    circuit_breaker = CircuitBreaker()
    metrics = MetricsCollector()
    health_manager = HealthManager(registry, services_config)

    gateway_router = GatewayRouter(
        config=services_config,
        registry=registry,
        proxy=proxy,
        circuit_breaker=circuit_breaker,
        metrics=metrics,
        health_manager=health_manager,
    )

    app.state.gateway_router = gateway_router

    if settings.health_check_enabled:
        await health_manager.start()

    logger.info("gateway_ready")
    yield

    # ── Shutdown ───────────────────────────────────────────────────────────
    logger.info("gateway_shutting_down")
    await health_manager.stop()
    await proxy.close()
    logger.info("gateway_stopped")


app = FastAPI(
    title="Athleia.ai — Enterprise API Gateway",
    version="1.0.0",
    description=(
        "Single entry point for all Athleia.ai microservice traffic. "
        "Handles routing, rate limiting, circuit breaking, retries, "
        "health checks, and observability."
    ),
    docs_url="/__gateway/docs",
    redoc_url="/__gateway/redoc",
    openapi_url="/__gateway/openapi.json",
    lifespan=lifespan,
)

# ── Middleware registration (order matters: outer → inner) ─────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Restrict in production via env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RequestIDMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(LoggingMiddleware)
app.add_middleware(
    SlidingWindowRateLimiter,
    limit=settings.rate_limit_requests,
    window_seconds=settings.rate_limit_window_seconds,
)

# ── Router ─────────────────────────────────────────────────────────────────
app.include_router(router)


@app.get("/", include_in_schema=False)
async def root():
    return {
        "service": "Athleia.ai API Gateway",
        "version": "1.0.0",
        "environment": settings.environment,
        "health": "/__gateway/health",
        "routes": "/__gateway/routes",
        "metrics": "/__gateway/metrics",
        "docs": "/__gateway/docs",
    }
