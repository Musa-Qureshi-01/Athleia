"""
Load Balancer Factory.

Creates the correct LoadBalancer implementation from a strategy name
string. One balancer instance is created per service at startup so
state (e.g. round-robin counter) is isolated per service.

Adding a new strategy:
    1. Implement LoadBalancer in a new module.
    2. Add its name → class mapping to _STRATEGIES below.
    No other code changes required.
"""

from __future__ import annotations

from app.balancer.base import LoadBalancer
from app.balancer.round_robin import RoundRobinBalancer

_STRATEGIES: dict[str, type[LoadBalancer]] = {
    "round_robin": RoundRobinBalancer,
    # Future:
    # "least_connections": LeastConnectionsBalancer,
    # "weighted_round_robin": WeightedRoundRobinBalancer,
    # "random": RandomBalancer,
}


def create_balancer(strategy: str) -> LoadBalancer:
    """
    Instantiate the load balancer for the given strategy name.

    Args:
        strategy: Strategy name from services.yaml (e.g. "round_robin").

    Returns:
        A new LoadBalancer instance.

    Raises:
        ValueError: For unknown strategy names.
    """
    cls = _STRATEGIES.get(strategy)
    if cls is None:
        available = ", ".join(sorted(_STRATEGIES))
        raise ValueError(
            f"Unknown load balancer strategy {strategy!r}. "
            f"Available: {available}"
        )
    return cls()
