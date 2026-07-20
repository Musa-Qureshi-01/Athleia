"""Package Lifecycle State Machine for Knowledge Service.
"""

from typing import Dict, Set
from app.core.errors import InvalidStateTransitionError
from app.domain.enums import PackageLifecycleState
from app.domain.models import OKFPackage


class LifecycleService:
    """Enforces legal lifecycle transitions for enterprise knowledge packages."""

    # Allowed state transitions graph
    ALLOWED_TRANSITIONS: Dict[PackageLifecycleState, Set[PackageLifecycleState]] = {
        PackageLifecycleState.DRAFT: {PackageLifecycleState.VALIDATED, PackageLifecycleState.ARCHIVED},
        PackageLifecycleState.VALIDATED: {PackageLifecycleState.PUBLISHED, PackageLifecycleState.DRAFT, PackageLifecycleState.ARCHIVED},
        PackageLifecycleState.PUBLISHED: {PackageLifecycleState.DEPRECATED, PackageLifecycleState.ARCHIVED},
        PackageLifecycleState.DEPRECATED: {PackageLifecycleState.ARCHIVED},
        PackageLifecycleState.ARCHIVED: set(),  # Terminal state
    }

    @classmethod
    def transition(cls, package: OKFPackage, target_state: PackageLifecycleState) -> OKFPackage:
        """Transitions package to target_state if valid, else raises InvalidStateTransitionError."""
        current_state = package.state
        if target_state == current_state:
            return package

        allowed = cls.ALLOWED_TRANSITIONS.get(current_state, set())
        if target_state not in allowed:
            raise InvalidStateTransitionError(
                f"Cannot transition package '{package.package_urn}' from '{current_state.value}' to '{target_state.value}'. "
                f"Allowed transitions from '{current_state.value}' are: {[s.value for s in allowed]}"
            )

        package.state = target_state
        return package


lifecycle_service = LifecycleService()
