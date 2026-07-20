"""
Load Balancer Abstract Base Class (Strategy Pattern).

The router calls balancer.pick(instances) and receives one instance.
It never knows which strategy is active. Adding a new strategy
(weighted, least-connections, geographic) requires only a new class
and a factory entry — no router changes.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from app.registry.models import ServiceInstance


class LoadBalancer(ABC):
    """
    Strategy interface for upstream instance selection.

    Implementers must be thread-safe for asyncio usage.

    Implementations:
        RoundRobinBalancer    — current
        LeastConnectionsBalancer — Phase 2
        WeightedRoundRobinBalancer — Phase 2
        RandomBalancer        — Phase 2
    """

    @abstractmethod
    def pick(self, instances: list[ServiceInstance]) -> ServiceInstance:
        """
        Select one instance from the provided list.

        Args:
            instances: Non-empty list of available instances. The caller
                       is responsible for filtering to only available
                       instances before calling this method.

        Returns:
            The selected ServiceInstance.

        Raises:
            ValueError: If instances is empty.
        """
