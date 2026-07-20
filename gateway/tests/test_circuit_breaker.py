"""
Test: Circuit Breaker
"""
import time
import pytest
from app.policy.circuit_breaker import CircuitBreaker, CircuitState


def make_cb(threshold=3, cooldown=1.0) -> CircuitBreaker:
    return CircuitBreaker(failure_threshold=threshold, cooldown_seconds=cooldown)


def test_initial_state_is_closed():
    cb = make_cb()
    assert not cb.is_open("svc", "http://host")


def test_does_not_open_before_threshold():
    cb = make_cb(threshold=3)
    cb.record_failure("svc", "http://host")
    cb.record_failure("svc", "http://host")
    assert not cb.is_open("svc", "http://host")


def test_opens_at_threshold():
    cb = make_cb(threshold=3)
    for _ in range(3):
        cb.record_failure("svc", "http://host")
    assert cb.is_open("svc", "http://host")


def test_success_resets_closed():
    cb = make_cb(threshold=3)
    for _ in range(3):
        cb.record_failure("svc", "http://host")
    assert cb.is_open("svc", "http://host")
    cb.record_success("svc", "http://host")
    assert not cb.is_open("svc", "http://host")


def test_transitions_half_open_after_cooldown():
    cb = make_cb(threshold=2, cooldown=0.05)
    cb.record_failure("svc", "http://host")
    cb.record_failure("svc", "http://host")
    assert cb.is_open("svc", "http://host")

    time.sleep(0.1)
    # After cooldown, is_open should allow the probe (return False)
    assert not cb.is_open("svc", "http://host")


def test_half_open_failure_reopens():
    cb = make_cb(threshold=2, cooldown=0.05)
    cb.record_failure("svc", "http://host")
    cb.record_failure("svc", "http://host")
    time.sleep(0.1)

    # Move to HALF-OPEN
    assert not cb.is_open("svc", "http://host")
    # Probe fails
    cb.record_failure("svc", "http://host")
    # Should be OPEN again
    assert cb.is_open("svc", "http://host")


def test_independent_instances():
    """Failures on one instance do not affect another."""
    cb = make_cb(threshold=2)
    cb.record_failure("svc", "http://a")
    cb.record_failure("svc", "http://a")
    assert cb.is_open("svc", "http://a")
    assert not cb.is_open("svc", "http://b")


def test_all_states_returns_dict():
    cb = make_cb()
    cb.record_failure("svc", "http://host")
    states = cb.all_states()
    assert isinstance(states, dict)
    assert len(states) == 1
