"""
Circuit Breaker — per upstream instance.

Implements the canonical three-state machine:

  CLOSED   — Normal operation. Failures are counted.
  OPEN     — Fast-fail all requests. No upstream calls made.
  HALF-OPEN — One probe request allowed. Success → CLOSED. Failure → OPEN.

State is keyed by (service_name, instance_url) so each instance has its
own independent circuit. One misbehaving instance does not block other
healthy instances of the same service.

Storage: in-process dict. Multiple gateway replicas will not share state.
Future: Replace _circuits with a Redis backend to synchronise across
instances without changing any caller code.
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field
from enum import Enum

from app.core.logging import get_logger

logger = get_logger(__name__)


class CircuitState(str, Enum):
    CLOSED = "closed"       # Passing traffic normally
    OPEN = "open"           # Fast-failing all requests
    HALF_OPEN = "half_open" # Allowing one probe


@dataclass
class _CircuitData:
    state: CircuitState = CircuitState.CLOSED
    failure_count: int = 0
    last_failure_time: float = 0.0
    last_transition_time: float = field(default_factory=time.monotonic)


class CircuitBreaker:
    """
    Per-instance circuit breaker with configurable thresholds.

    Args:
        failure_threshold: Consecutive failures before opening the circuit.
        cooldown_seconds: Time in OPEN state before moving to HALF-OPEN.
    """

    def __init__(
        self,
        failure_threshold: int = 5,
        cooldown_seconds: float = 30.0,
    ) -> None:
        self._failure_threshold = failure_threshold
        self._cooldown_seconds = cooldown_seconds
        # key: (service_name, instance_url)
        self._circuits: dict[tuple[str, str], _CircuitData] = {}

    def _key(self, service: str, instance_url: str) -> tuple[str, str]:
        return (service, instance_url)

    def _get_or_create(self, key: tuple[str, str]) -> _CircuitData:
        if key not in self._circuits:
            self._circuits[key] = _CircuitData()
        return self._circuits[key]

    def is_open(self, service: str, instance_url: str) -> bool:
        """
        Return True if the circuit is OPEN (request should be rejected).
        Transitions OPEN → HALF-OPEN when the cooldown has elapsed.
        """
        key = self._key(service, instance_url)
        circuit = self._get_or_create(key)

        if circuit.state == CircuitState.CLOSED:
            return False

        if circuit.state == CircuitState.OPEN:
            elapsed = time.monotonic() - circuit.last_failure_time
            if elapsed >= self._cooldown_seconds:
                circuit.state = CircuitState.HALF_OPEN
                logger.info(
                    "circuit_half_open",
                    service=service,
                    instance=instance_url,
                    elapsed_seconds=round(elapsed, 1),
                )
                return False  # Allow the probe request through
            return True  # Still in cooldown

        # HALF-OPEN: allow one probe
        return False

    def record_success(self, service: str, instance_url: str) -> None:
        """
        Call after a successful upstream response.
        Resets failure counter and closes the circuit.
        """
        key = self._key(service, instance_url)
        circuit = self._get_or_create(key)

        if circuit.state != CircuitState.CLOSED:
            logger.info(
                "circuit_closed",
                service=service,
                instance=instance_url,
                previous_state=circuit.state,
            )

        circuit.state = CircuitState.CLOSED
        circuit.failure_count = 0

    def record_failure(self, service: str, instance_url: str) -> None:
        """
        Call after a failed upstream response (5xx, timeout, network error).
        Opens the circuit once the failure threshold is reached.
        """
        key = self._key(service, instance_url)
        circuit = self._get_or_create(key)

        circuit.failure_count += 1
        circuit.last_failure_time = time.monotonic()

        if circuit.state == CircuitState.HALF_OPEN:
            # Probe failed — reopen immediately
            circuit.state = CircuitState.OPEN
            logger.warning(
                "circuit_reopened",
                service=service,
                instance=instance_url,
                reason="half_open_probe_failed",
            )
            return

        if (
            circuit.state == CircuitState.CLOSED
            and circuit.failure_count >= self._failure_threshold
        ):
            circuit.state = CircuitState.OPEN
            logger.error(
                "circuit_opened",
                service=service,
                instance=instance_url,
                failure_count=circuit.failure_count,
                threshold=self._failure_threshold,
            )

    def all_states(self) -> dict[str, dict[str, str]]:
        """Return a summary of all circuit states for the health endpoint."""
        result: dict[str, dict[str, str]] = {}
        for (service, instance), data in self._circuits.items():
            key = f"{service}:{instance}"
            result[key] = {
                "state": data.state,
                "failure_count": str(data.failure_count),
            }
        return result
