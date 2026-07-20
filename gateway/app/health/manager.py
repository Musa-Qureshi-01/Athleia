"""
Health Manager.

Runs a background asyncio task that periodically probes every registered
service instance's health endpoint. Results are written back to the
ServiceRegistry so the load balancer can exclude unhealthy instances.

Probe logic:
  - GET {instance_url}{health_path}
  - HTTP 200 → HEALTHY
  - Any other status or timeout → UNHEALTHY
  - Probe timeout: 5 seconds (short — health checks must be fast)

The health manager is started in the gateway's lifespan context manager
and stopped on shutdown.
"""

from __future__ import annotations

import asyncio

import httpx

from app.core.config import ServicesConfig
from app.core.logging import get_logger
from app.registry.base import ServiceRegistry

logger = get_logger(__name__)

_PROBE_TIMEOUT = 5.0  # seconds per health probe


class HealthManager:
    """
    Async background poller for upstream service health.

    Args:
        registry: ServiceRegistry to update after each probe.
        config: ServicesConfig for health check paths and intervals.
    """

    def __init__(self, registry: ServiceRegistry, config: ServicesConfig) -> None:
        self._registry = registry
        self._config = config
        self._task: asyncio.Task | None = None
        self._client = httpx.AsyncClient(timeout=_PROBE_TIMEOUT)

    async def start(self) -> None:
        """Start the background polling loop."""
        logger.info("health_manager_starting")
        self._task = asyncio.create_task(self._polling_loop(), name="health_manager")

    async def stop(self) -> None:
        """Cancel the background polling loop and close the HTTP client."""
        if self._task and not self._task.done():
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        await self._client.aclose()
        logger.info("health_manager_stopped")

    async def _polling_loop(self) -> None:
        """Main loop: probe all instances, sleep, repeat."""
        while True:
            await self._probe_all()
            # Use the shortest interval across all services
            min_interval = min(
                (
                    self._config.services[name].health_check.interval_seconds
                    for name in self._config.services
                ),
                default=30,
            )
            await asyncio.sleep(min_interval)

    async def _probe_all(self) -> None:
        """Probe every instance of every service concurrently."""
        definitions = await self._registry.all_definitions()
        tasks = []
        for definition in definitions:
            svc_cfg = self._config.get_service(definition.name)
            if svc_cfg is None:
                continue
            health_path = svc_cfg.health_check.path
            for instance in definition.instances:
                tasks.append(
                    self._probe_instance(
                        definition.name, instance.url, health_path
                    )
                )
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    async def _probe_instance(
        self, service: str, instance_url: str, health_path: str
    ) -> None:
        """Probe one instance and update the registry with the result."""
        url = instance_url.rstrip("/") + health_path
        try:
            response = await self._client.get(url)
            healthy = response.status_code == 200
        except Exception as exc:  # noqa: BLE001
            healthy = False
            logger.warning(
                "health_probe_failed",
                service=service,
                instance=instance_url,
                error=str(exc),
            )
        else:
            log_fn = logger.debug if healthy else logger.warning
            log_fn(
                "health_probe_result",
                service=service,
                instance=instance_url,
                healthy=healthy,
                status_code=response.status_code if healthy else None,
            )

        await self._registry.update_instance_status(
            service, instance_url, healthy=healthy
        )

    async def get_report(self) -> dict[str, object]:
        """Return a summary of all known instance health states."""
        definitions = await self._registry.all_definitions()
        report: dict[str, object] = {}
        for definition in definitions:
            instances = []
            for inst in definition.instances:
                instances.append(
                    {"url": inst.url, "status": inst.status.value}
                )
            report[definition.name] = instances
        return report
