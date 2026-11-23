import logging
from typing import Optional
from workos import WorkOSClient
from shared.auth.config import settings

logger = logging.getLogger("auth.organizational.client")

_org_workos_client: Optional[WorkOSClient] = None


def get_organizational_workos_client() -> WorkOSClient:
    """Return singleton WorkOS client configured for Organisational Identity & SSO."""
    global _org_workos_client
    if _org_workos_client is None:
        logger.info("Initializing WorkOS Organisational Client")
        _org_workos_client = WorkOSClient(
            api_key=settings.WORKOS_ORGANIZATIONAL_API_KEY,
            client_id=settings.WORKOS_ORGANIZATIONAL_CLIENT_ID,
        )
    return _org_workos_client
