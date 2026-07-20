"""
In-process Metrics Collector.

Tracks request throughput, error rates, and latency histograms.
The data structure mirrors Prometheus counter/histogram semantics so
adding a Prometheus exposition endpoint (/metrics) requires only
translating these structures into prometheus_client format — no
counter renaming or logic changes.

Current implementation: in-memory (resets on restart).
Future: Replace counters with prometheus_client.Counter/Histogram
        and expose via /metrics for Prometheus scraping.
"""

from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass, field


@dataclass
class ServiceMetrics:
    """Per-service request metrics."""

    total_requests: int = 0
    successful_requests: int = 0
    failed_requests: int = 0
    circuit_breaker_rejections: int = 0
    rate_limit_rejections: int = 0
    # Simple latency buckets (ms): <50, <200, <500, <1000, <5000, ≥5000
    latency_buckets: dict[str, int] = field(
        default_factory=lambda: {
            "lt_50ms": 0,
            "lt_200ms": 0,
            "lt_500ms": 0,
            "lt_1000ms": 0,
            "lt_5000ms": 0,
            "ge_5000ms": 0,
        }
    )


class MetricsCollector:
    """
    Single-instance metrics store for the gateway process.

    One MetricsCollector is created at startup and injected into the
    router. Metrics are written on every proxied request.
    """

    def __init__(self) -> None:
        self._services: dict[str, ServiceMetrics] = defaultdict(ServiceMetrics)
        self._gateway_requests: int = 0
        self._gateway_errors: int = 0

    def _svc(self, service: str) -> ServiceMetrics:
        return self._services[service]

    def record_request(
        self,
        service: str,
        *,
        status_code: int,
        duration_ms: int,
    ) -> None:
        """Record a completed upstream request."""
        self._gateway_requests += 1
        m = self._svc(service)
        m.total_requests += 1

        if status_code < 500:
            m.successful_requests += 1
        else:
            m.failed_requests += 1
            self._gateway_errors += 1

        # Bucket the latency
        if duration_ms < 50:
            m.latency_buckets["lt_50ms"] += 1
        elif duration_ms < 200:
            m.latency_buckets["lt_200ms"] += 1
        elif duration_ms < 500:
            m.latency_buckets["lt_500ms"] += 1
        elif duration_ms < 1000:
            m.latency_buckets["lt_1000ms"] += 1
        elif duration_ms < 5000:
            m.latency_buckets["lt_5000ms"] += 1
        else:
            m.latency_buckets["ge_5000ms"] += 1

    def record_circuit_breaker_rejection(self, service: str) -> None:
        self._svc(service).circuit_breaker_rejections += 1
        self._gateway_errors += 1

    def record_rate_limit_rejection(self) -> None:
        self._gateway_errors += 1

    def snapshot(self) -> dict[str, object]:
        """Return a JSON-serialisable snapshot of all metrics."""
        return {
            "gateway": {
                "total_requests": self._gateway_requests,
                "total_errors": self._gateway_errors,
            },
            "services": {
                name: {
                    "total_requests": m.total_requests,
                    "successful_requests": m.successful_requests,
                    "failed_requests": m.failed_requests,
                    "circuit_breaker_rejections": m.circuit_breaker_rejections,
                    "rate_limit_rejections": m.rate_limit_rejections,
                    "latency_buckets": m.latency_buckets,
                }
                for name, m in self._services.items()
            },
        }
