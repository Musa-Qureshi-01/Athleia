"""
ServiceRegistry Abstract Base Class.

Every discovery backend (static config, Consul, Kubernetes DNS) must
implement this interface. The router and load balancer depend only on
this contract — they never import a concrete implementation.

This decoupling is the key design principle of the gateway:
    Changing the service discovery mechanism is a configuration change,
    not a code change.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from app.registry.models import ServiceDefinition, ServiceInstance


class ServiceRegistry(ABC):
    """
    Abstract contract for all service discovery backends.

    Implementers:
        StaticServiceRegistry  — reads services.yaml (current)
        ConsulServiceRegistry  — Consul HTTP API (future)
        KubernetesServiceRegistry — K8s Endpoints API (future)
    """

    @abstractmethod
    async def resolve(self, service_name: str) -> list[ServiceInstance]:
        """
        Return all known instances for the given service name.

        Returns an empty list (not an exception) when the service
        is not registered. Callers must handle the empty case.
        """

    @abstractmethod
    async def get_definition(self, service_name: str) -> ServiceDefinition | None:
        """Return the full service definition, or None if not found."""

    @abstractmethod
    async def all_definitions(self) -> list[ServiceDefinition]:
        """Return every registered service definition."""

    @abstractmethod
    async def update_instance_status(
        self,
        service_name: str,
        instance_url: str,
        *,
        healthy: bool,
    ) -> None:
        """
        Update the health status of one instance.

        Called by the HealthManager after each probe. The registry
        marks the instance HEALTHY or UNHEALTHY so the load balancer
        can exclude it from rotation.
        """
