"""
Gateway Configuration System.

All configuration is sourced from environment variables and the services.yaml
file. Hardcoded values are not permitted anywhere in the gateway codebase.

Usage:
    from app.core.config import settings, services_config
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class GatewaySettings(BaseSettings):
    """Primary settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Runtime ────────────────────────────────────────────
    environment: str = Field(default="development")
    debug: bool = Field(default=False)

    # ── Gateway network ────────────────────────────────────
    gateway_host: str = Field(default="0.0.0.0")
    gateway_port: int = Field(default=8000)
    gateway_log_level: str = Field(default="info")

    # ── Service registry ───────────────────────────────────
    registry_backend: str = Field(default="static")
    services_config_path: str = Field(default="config/services.yaml")

    # ── Rate limiting ──────────────────────────────────────
    rate_limit_enabled: bool = Field(default=True)
    rate_limit_requests: int = Field(default=100)
    rate_limit_window_seconds: int = Field(default=60)

    # ── Health checks ──────────────────────────────────────
    health_check_enabled: bool = Field(default=True)
    health_check_interval_seconds: int = Field(default=30)

    # ── Proxy ──────────────────────────────────────────────
    max_request_body_bytes: int = Field(default=10 * 1024 * 1024)  # 10 MB

    @field_validator("environment")
    @classmethod
    def validate_environment(cls, v: str) -> str:
        allowed = {"development", "staging", "production"}
        if v not in allowed:
            raise ValueError(f"environment must be one of {allowed}")
        return v

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


class CircuitBreakerPolicy:
    """Per-service circuit breaker configuration."""

    def __init__(self, raw: dict[str, Any]) -> None:
        self.failure_threshold: int = raw.get("failure_threshold", 5)
        self.cooldown_seconds: int = raw.get("cooldown_seconds", 30)


class RoutePolicy:
    """Per-service routing policy parsed from services.yaml."""

    def __init__(self, raw: dict[str, Any]) -> None:
        self.timeout_seconds: float = float(raw.get("timeout_seconds", 30))
        self.retries: int = int(raw.get("retries", 1))
        self.circuit_breaker = CircuitBreakerPolicy(
            raw.get("circuit_breaker", {})
        )


class HealthCheckConfig:
    """Health check configuration for a service."""

    def __init__(self, raw: dict[str, Any]) -> None:
        self.path: str = raw.get("path", "/health")
        self.interval_seconds: int = int(raw.get("interval_seconds", 30))


class ServiceConfig:
    """Complete configuration for one downstream service."""

    def __init__(self, name: str, raw: dict[str, Any]) -> None:
        self.name: str = name
        self.path_prefix: str = raw["path_prefix"]
        self.instances: list[str] = [
            inst["url"] for inst in raw.get("instances", [])
        ]
        self.load_balancer: str = raw.get("load_balancer", "round_robin")
        self.policy = RoutePolicy(raw.get("policy", {}))
        self.health_check = HealthCheckConfig(raw.get("health_check", {}))

    def __repr__(self) -> str:
        return (
            f"ServiceConfig(name={self.name!r}, "
            f"prefix={self.path_prefix!r}, "
            f"instances={self.instances})"
        )


class ServicesConfig:
    """
    Parsed representation of the full services.yaml config.

    Provides O(1) prefix-based service lookup used by the router.
    """

    def __init__(self, raw: dict[str, Any]) -> None:
        gateway_raw = raw.get("gateway", {})
        self.gateway_port: int = int(gateway_raw.get("port", 8000))
        self.max_request_body_bytes: int = int(
            gateway_raw.get("max_request_body_bytes", 10 * 1024 * 1024)
        )

        # Build service map keyed by service name
        services_raw: dict[str, Any] = raw.get("services", {})
        self._services: dict[str, ServiceConfig] = {
            name: ServiceConfig(name, svc_raw)
            for name, svc_raw in services_raw.items()
        }

        # Build prefix → service name index for O(1) routing
        self._prefix_index: dict[str, str] = {
            svc.path_prefix: name
            for name, svc in self._services.items()
        }

    @property
    def services(self) -> dict[str, ServiceConfig]:
        return self._services

    def get_service(self, name: str) -> ServiceConfig | None:
        return self._services.get(name)

    def resolve_by_path(self, path: str) -> ServiceConfig | None:
        """
        Find the service whose path_prefix is the longest prefix of `path`.
        Returns None if no service claims this path.
        """
        matched: ServiceConfig | None = None
        matched_len = 0
        for prefix, name in self._prefix_index.items():
            if path.startswith(prefix) and len(prefix) > matched_len:
                matched = self._services[name]
                matched_len = len(prefix)
        return matched

    def all_prefixes(self) -> list[str]:
        return list(self._prefix_index.keys())


def _load_services_config(path: str) -> ServicesConfig:
    config_path = Path(path)
    if not config_path.exists():
        raise FileNotFoundError(
            f"Services config not found: {config_path.resolve()}"
        )
    with config_path.open("r", encoding="utf-8") as fh:
        raw = yaml.safe_load(fh)
    return ServicesConfig(raw or {})


# ── Module-level singletons ────────────────────────────────────────────────
settings = GatewaySettings()
services_config: ServicesConfig = _load_services_config(
    settings.services_config_path
)
