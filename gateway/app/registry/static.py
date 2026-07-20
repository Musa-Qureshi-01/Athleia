"""
Static Service Registry.

Reads service definitions from services.yaml at startup and holds them
in memory. Health status is updated in-place by the HealthManager.

This is the Phase 1 discovery backend. To switch to Consul or Kubernetes,
implement ServiceRegistry with a new class and change REGISTRY_BACKEND
in the environment — no router or balancer code changes required.
"""

from __future__ import annotations

from app.core.config import ServicesConfig
from app.core.logging import get_logger
from app.registry.base import ServiceRegistry
from app.registry.models import InstanceStatus, ServiceDefinition, ServiceInstance

logger = get_logger(__name__)


class StaticServiceRegistry(ServiceRegistry):
    """
    In-memory service registry backed by services.yaml.

    Thread-safety: Instance status mutations are not lock-protected because
    asyncio is single-threaded. If the gateway moves to a threaded model,
    add asyncio.Lock around _definitions mutations.
    """

    def __init__(self, config: ServicesConfig) -> None:
        self._definitions: dict[str, ServiceDefinition] = {}
        self._build_from_config(config)

    def _build_from_config(self, config: ServicesConfig) -> None:
        """Populate registry from parsed ServicesConfig."""
        for name, svc_cfg in config.services.items():
            instances = [
                ServiceInstance(
                    service_name=name,
                    url=url,
                    status=InstanceStatus.UNKNOWN,
                )
                for url in svc_cfg.instances
            ]
            definition = ServiceDefinition(
                name=name,
                path_prefix=svc_cfg.path_prefix,
                instances=instances,
                load_balancer_strategy=svc_cfg.load_balancer,
            )
            self._definitions[name] = definition
            logger.info(
                "registry_service_registered",
                service=name,
                prefix=svc_cfg.path_prefix,
                instance_count=len(instances),
            )

    async def resolve(self, service_name: str) -> list[ServiceInstance]:
        definition = self._definitions.get(service_name)
        if definition is None:
            logger.warning("registry_service_not_found", service=service_name)
            return []
        return definition.instances

    async def get_definition(self, service_name: str) -> ServiceDefinition | None:
        return self._definitions.get(service_name)

    async def all_definitions(self) -> list[ServiceDefinition]:
        return list(self._definitions.values())

    async def update_instance_status(
        self,
        service_name: str,
        instance_url: str,
        *,
        healthy: bool,
    ) -> None:
        definition = self._definitions.get(service_name)
        if definition is None:
            return

        new_status = InstanceStatus.HEALTHY if healthy else InstanceStatus.UNHEALTHY

        for instance in definition.instances:
            if instance.url == instance_url:
                if instance.status != new_status:
                    logger.info(
                        "registry_instance_status_changed",
                        service=service_name,
                        instance=instance_url,
                        old_status=instance.status,
                        new_status=new_status,
                    )
                    instance.status = new_status
                return

        logger.warning(
            "registry_instance_not_found",
            service=service_name,
            instance=instance_url,
        )
