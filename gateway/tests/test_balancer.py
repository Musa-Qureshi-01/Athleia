"""
Test: Load Balancer
"""
import pytest
from app.balancer.round_robin import RoundRobinBalancer
from app.balancer.factory import create_balancer
from app.registry.models import ServiceInstance, InstanceStatus


def make_instance(url: str) -> ServiceInstance:
    return ServiceInstance(service_name="test", url=url)


def test_round_robin_single_instance():
    lb = RoundRobinBalancer()
    instances = [make_instance("http://a")]
    for _ in range(5):
        assert lb.pick(instances).url == "http://a"


def test_round_robin_two_instances_cycles():
    lb = RoundRobinBalancer()
    a = make_instance("http://a")
    b = make_instance("http://b")
    instances = [a, b]

    results = [lb.pick(instances).url for _ in range(6)]
    # Should alternate a, b, a, b, a, b
    assert results == ["http://a", "http://b", "http://a", "http://b", "http://a", "http://b"]


def test_round_robin_empty_raises():
    lb = RoundRobinBalancer()
    with pytest.raises(ValueError):
        lb.pick([])


def test_round_robin_three_instances_even_distribution():
    lb = RoundRobinBalancer()
    instances = [make_instance(f"http://host-{i}") for i in range(3)]
    results = [lb.pick(instances).url for _ in range(9)]
    for url in ["http://host-0", "http://host-1", "http://host-2"]:
        assert results.count(url) == 3


def test_factory_creates_round_robin():
    lb = create_balancer("round_robin")
    assert isinstance(lb, RoundRobinBalancer)


def test_factory_unknown_strategy_raises():
    with pytest.raises(ValueError, match="Unknown load balancer strategy"):
        create_balancer("magic_routing")
