"""
Service Registry data models.

These are the shared data structures used across the registry,
load balancer, and proxy engine. They are deliberately simple
dataclasses — no framework dependencies.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum


class InstanceStatus(str, Enum):
    """Lifecycle state of a single upstream instance."""

    HEALTHY = "healthy"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"


@dataclass
class ServiceInstance:
    """
    A single addressable instance of a downstream service.

    Attributes:
        service_name: Logical service identifier (e.g. "reasoning").
        url: Base URL of the instance (e.g. "http://localhost:8002").
        status: Current health state.
        weight: Relative weight for weighted load balancing (Phase 2).
        metadata: Arbitrary labels for future routing policies.
    """

    service_name: str
    url: str
    status: InstanceStatus = InstanceStatus.UNKNOWN
    weight: int = 1
    metadata: dict[str, str] = field(default_factory=dict)

    def is_available(self) -> bool:
        """True when the instance should receive traffic."""
        return self.status != InstanceStatus.UNHEALTHY

    def __repr__(self) -> str:
        return f"ServiceInstance({self.service_name!r} @ {self.url!r} [{self.status}])"


@dataclass
class ServiceDefinition:
    """
    The full registration record for one logical service.

    A service may have one or more instances behind it.
    The load balancer selects among the available instances.
    """

    name: str
    path_prefix: str
    instances: list[ServiceInstance]
    load_balancer_strategy: str = "round_robin"

    def available_instances(self) -> list[ServiceInstance]:
        """Instances that are not marked UNHEALTHY."""
        return [i for i in self.instances if i.is_available()]
