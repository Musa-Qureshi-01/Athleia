"""
Test: Static Service Registry
"""

import pytest
from app.registry.models import InstanceStatus, ServiceInstance, ServiceDefinition
from app.registry.static import StaticServiceRegistry


class _FakeServicesConfig:
    """Minimal mock of ServicesConfig for registry tests."""

    class _PolicyMock:
        timeout_seconds = 30
        retries = 1

        class circuit_breaker:
            failure_threshold = 5
            cooldown_seconds = 30

    class _HealthMock:
        path = "/health"
        interval_seconds = 30

    class _SvcConfig:
        def __init__(self, name, prefix, instances):
            self.path_prefix = prefix
            # Mirror what real ServiceConfig does: extract URL strings from dicts
            self.instances = [
                inst["url"] if isinstance(inst, dict) else inst
                for inst in instances
            ]
            self.load_balancer = "round_robin"
            self.policy = _FakeServicesConfig._PolicyMock()
            self.health_check = _FakeServicesConfig._HealthMock()

    def __init__(self, services_dict):
        self.services = {
            name: self._SvcConfig(name, cfg["prefix"], cfg["instances"])
            for name, cfg in services_dict.items()
        }


def make_registry(services=None):
    if services is None:
        services = {
            "reasoning": {
                "prefix": "/api/v1/reason",
                "instances": [{"url": "http://localhost:8002"}],
            },
            "retrieval": {
                "prefix": "/api/v1/retrieve",
                "instances": [
                    {"url": "http://localhost:8001"},
                    {"url": "http://localhost:8011"},
                ],
            },
        }
    config = _FakeServicesConfig(services)
    return StaticServiceRegistry(config)


@pytest.mark.asyncio
async def test_resolve_known_service():
    registry = make_registry()
    instances = await registry.resolve("reasoning")
    assert len(instances) == 1
    assert instances[0].url == "http://localhost:8002"


@pytest.mark.asyncio
async def test_resolve_unknown_service_returns_empty():
    registry = make_registry()
    instances = await registry.resolve("does_not_exist")
    assert instances == []


@pytest.mark.asyncio
async def test_resolve_returns_all_instances():
    registry = make_registry()
    instances = await registry.resolve("retrieval")
    assert len(instances) == 2


@pytest.mark.asyncio
async def test_update_instance_status_healthy():
    registry = make_registry()
    await registry.update_instance_status(
        "reasoning", "http://localhost:8002", healthy=True
    )
    instances = await registry.resolve("reasoning")
    assert instances[0].status == InstanceStatus.HEALTHY


@pytest.mark.asyncio
async def test_update_instance_status_unhealthy():
    registry = make_registry()
    await registry.update_instance_status(
        "reasoning", "http://localhost:8002", healthy=False
    )
    instances = await registry.resolve("reasoning")
    assert instances[0].status == InstanceStatus.UNHEALTHY


@pytest.mark.asyncio
async def test_update_status_unknown_instance_is_silent():
    """Updating a non-existent instance URL should not raise."""
    registry = make_registry()
    await registry.update_instance_status(
        "reasoning", "http://does-not-exist:9999", healthy=True
    )


@pytest.mark.asyncio
async def test_all_definitions_returns_all_services():
    registry = make_registry()
    definitions = await registry.all_definitions()
    names = {d.name for d in definitions}
    assert "reasoning" in names
    assert "retrieval" in names


@pytest.mark.asyncio
async def test_get_definition_known_service():
    registry = make_registry()
    defn = await registry.get_definition("retrieval")
    assert defn is not None
    assert defn.name == "retrieval"


@pytest.mark.asyncio
async def test_get_definition_unknown_service():
    registry = make_registry()
    defn = await registry.get_definition("nonexistent")
    assert defn is None
