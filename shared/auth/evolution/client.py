import logging
from typing import Optional
from workos import WorkOSClient
from shared.auth.config import settings

logger = logging.getLogger("auth.evolution.client")

_evolution_workos_client: Optional[WorkOSClient] = None


def get_evolution_workos_client() -> WorkOSClient:
    """Return singleton WorkOS client configured exclusively for Evolution / Demo Users.
    Maintains separate credentials and isolated API configuration from the enterprise production app.
    """
    global _evolution_workos_client
    if _evolution_workos_client is None:
        logger.info("Initializing WorkOS Evolution Demo Client")
        _evolution_workos_client = WorkOSClient(
            api_key=settings.WORKOS_EVOLUTION_API_KEY,
            client_id=settings.WORKOS_EVOLUTION_CLIENT_ID,
        )
    return _evolution_workos_client
