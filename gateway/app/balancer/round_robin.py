"""
Round Robin Load Balancer.

Cycles through available instances in order. Uses an atomic counter
per-balancer instance so state is isolated per service (the factory
creates one balancer per service).

Thread safety: itertools.count is not atomic under threads, but since
asyncio runs on a single thread this is safe. If gateway moves to
multi-process, replace with a Redis counter.
"""

from __future__ import annotations

import itertools

from app.balancer.base import LoadBalancer
from app.registry.models import ServiceInstance


class RoundRobinBalancer(LoadBalancer):
    """
    Distributes requests evenly across all available instances in order.

    State: One counter per balancer instance (one per service).
    """

    def __init__(self) -> None:
        self._counter = itertools.count()

    def pick(self, instances: list[ServiceInstance]) -> ServiceInstance:
        if not instances:
            raise ValueError("Cannot pick from an empty instance list.")
        index = next(self._counter) % len(instances)
        return instances[index]
