"""
Gateway Router — catch-all route + internal management endpoints.

The catch-all route handles ALL service traffic. Adding a new
microservice requires only a new entry in services.yaml — no code here.

Internal routes (/__gateway/*) expose gateway management surfaces:
  - /__gateway/health          — gateway + all upstream health
  - /__gateway/routes          — active route table
  - /__gateway/metrics         — request counters and latency buckets
  - /__gateway/circuit-breakers — circuit breaker states

The router depends on:
  - ServicesConfig (config)
  - ServiceRegistry (instance lookup)
  - LoadBalancer per service (stored in a dict built at startup)
  - ProxyEngine (HTTP forwarding)
  - CircuitBreaker (fast-fail check)
  - MetricsCollector (request recording)
  - HealthManager (health report)
"""

from __future__ import annotations

import time
from typing import Any

import httpx
from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse

from app.balancer.base import LoadBalancer
from app.balancer.factory import create_balancer
from app.core.config import ServicesConfig, ServiceConfig
from app.core.logging import bind_request_context, get_logger
from app.health.manager import HealthManager
from app.metrics.collector import MetricsCollector
from app.policy.circuit_breaker import CircuitBreaker
from app.policy.retry import execute_with_retry
from app.proxy.engine import ProxyEngine
from app.registry.base import ServiceRegistry

logger = get_logger(__name__)

router = APIRouter()


class GatewayRouter:
    """
    Orchestrator that connects all gateway modules for a single request.

    One GatewayRouter instance is created at startup and stored on
    app.state so all route handlers share it without global state.
    """

    def __init__(
        self,
        config: ServicesConfig,
        registry: ServiceRegistry,
        proxy: ProxyEngine,
        circuit_breaker: CircuitBreaker,
        metrics: MetricsCollector,
        health_manager: HealthManager,
    ) -> None:
        self._config = config
        self._registry = registry
        self._proxy = proxy
        self._circuit_breaker = circuit_breaker
        self._metrics = metrics
        self._health_manager = health_manager

        # One load balancer instance per service (isolated state)
        self._balancers: dict[str, LoadBalancer] = {
            name: create_balancer(svc.load_balancer)
            for name, svc in config.services.items()
        }

    async def handle(self, request: Request) -> Response:
        """
        Main routing entry point for all service traffic.

        1. Resolve service from request path.
        2. Check circuit breaker.
        3. Pick an instance via load balancer.
        4. Forward via proxy with retry policy.
        5. Record metrics.
        """
        path = str(request.url.path)
        svc_config = self._config.resolve_by_path(path)

        if svc_config is None:
            logger.warning("route_not_found", path=path)
            return JSONResponse(
                status_code=404,
                content={
                    "error": "route_not_found",
                    "message": f"No service registered for path: {path}",
                    "path": path,
                },
            )

        request_id = getattr(request.state, "request_id", "-")
        correlation_id = getattr(request.state, "correlation_id", "-")
        bind_request_context(request_id, correlation_id, service=svc_config.name)

        # Fetch available instances from registry
        all_instances = await self._registry.resolve(svc_config.name)
        available = [i for i in all_instances if i.is_available()]

        if not available:
            logger.error(
                "no_available_instances",
                service=svc_config.name,
                total_instances=len(all_instances),
            )
            return JSONResponse(
                status_code=503,
                content={
                    "error": "service_unavailable",
                    "message": f"No healthy instances available for service: {svc_config.name}",
                    "service": svc_config.name,
                },
            )

        balancer = self._balancers[svc_config.name]
        instance = balancer.pick(available)

        # Circuit breaker check
        if self._circuit_breaker.is_open(svc_config.name, instance.url):
            self._metrics.record_circuit_breaker_rejection(svc_config.name)
            logger.warning(
                "circuit_breaker_open",
                service=svc_config.name,
                instance=instance.url,
            )
            return JSONResponse(
                status_code=503,
                content={
                    "error": "circuit_open",
                    "message": "Service circuit breaker is open. Request rejected.",
                    "service": svc_config.name,
                },
            )

        policy = svc_config.policy
        start = time.perf_counter()

        async def _attempt() -> Response:
            return await self._proxy.forward(
                request,
                instance.url,
                timeout_seconds=policy.timeout_seconds,
                request_id=request_id,
                correlation_id=correlation_id,
            )

        try:
            response, succeeded = await execute_with_retry(
                method=request.method,
                max_retries=policy.retries,
                attempt_fn=_attempt,
                service=svc_config.name,
                instance_url=instance.url,
            )
        except httpx.TimeoutException:
            self._circuit_breaker.record_failure(svc_config.name, instance.url)
            duration_ms = int((time.perf_counter() - start) * 1000)
            self._metrics.record_request(
                svc_config.name, status_code=504, duration_ms=duration_ms
            )
            return JSONResponse(
                status_code=504,
                content={
                    "error": "upstream_timeout",
                    "message": "The upstream service did not respond in time.",
                    "service": svc_config.name,
                },
            )
        except httpx.RequestError as exc:
            self._circuit_breaker.record_failure(svc_config.name, instance.url)
            duration_ms = int((time.perf_counter() - start) * 1000)
            self._metrics.record_request(
                svc_config.name, status_code=502, duration_ms=duration_ms
            )
            logger.error(
                "upstream_connection_error",
                service=svc_config.name,
                instance=instance.url,
                error=str(exc),
            )
            return JSONResponse(
                status_code=502,
                content={
                    "error": "upstream_connection_error",
                    "message": "Could not connect to the upstream service.",
                    "service": svc_config.name,
                },
            )

        # Update circuit breaker state based on final response
        if succeeded:
            self._circuit_breaker.record_success(svc_config.name, instance.url)
        else:
            self._circuit_breaker.record_failure(svc_config.name, instance.url)

        duration_ms = int((time.perf_counter() - start) * 1000)
        self._metrics.record_request(
            svc_config.name,
            status_code=response.status_code,
            duration_ms=duration_ms,
        )

        return response

    # ── Internal endpoint handlers ─────────────────────────────────────────

    async def internal_health(self) -> dict[str, Any]:
        upstream_health = await self._health_manager.get_report()
        return {
            "status": "ok",
            "gateway": "healthy",
            "upstreams": upstream_health,
            "circuit_breakers": self._circuit_breaker.all_states(),
        }

    async def internal_routes(self) -> dict[str, Any]:
        definitions = await self._registry.all_definitions()
        routes = []
        for definition in definitions:
            svc_cfg = self._config.get_service(definition.name)
            routes.append(
                {
                    "service": definition.name,
                    "path_prefix": definition.path_prefix,
                    "instances": [
                        {"url": i.url, "status": i.status.value}
                        for i in definition.instances
                    ],
                    "load_balancer": definition.load_balancer_strategy,
                    "policy": {
                        "timeout_seconds": svc_cfg.policy.timeout_seconds if svc_cfg else None,
                        "retries": svc_cfg.policy.retries if svc_cfg else None,
                    },
                }
            )
        return {"routes": routes, "total": len(routes)}

    async def internal_metrics(self) -> dict[str, Any]:
        return self._metrics.snapshot()

    async def internal_circuit_breakers(self) -> dict[str, Any]:
        return {"circuit_breakers": self._circuit_breaker.all_states()}


# ── Route declarations ─────────────────────────────────────────────────────

@router.get("/__gateway/health", include_in_schema=False)
async def gateway_health(request: Request) -> JSONResponse:
    gw: GatewayRouter = request.app.state.gateway_router
    data = await gw.internal_health()
    return JSONResponse(content=data)


@router.get("/__gateway/routes", include_in_schema=False)
async def gateway_routes(request: Request) -> JSONResponse:
    gw: GatewayRouter = request.app.state.gateway_router
    data = await gw.internal_routes()
    return JSONResponse(content=data)


@router.get("/__gateway/metrics", include_in_schema=False)
async def gateway_metrics(request: Request) -> JSONResponse:
    gw: GatewayRouter = request.app.state.gateway_router
    data = await gw.internal_metrics()
    return JSONResponse(content=data)


@router.get("/__gateway/circuit-breakers", include_in_schema=False)
async def gateway_circuit_breakers(request: Request) -> JSONResponse:
    gw: GatewayRouter = request.app.state.gateway_router
    data = await gw.internal_circuit_breakers()
    return JSONResponse(content=data)


# ── Catch-all proxy route ──────────────────────────────────────────────────

@router.api_route(
    "/{service_path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    include_in_schema=False,
)
async def proxy_catch_all(request: Request, service_path: str) -> Response:  # noqa: ARG001
    gw: GatewayRouter = request.app.state.gateway_router
    return await gw.handle(request)
