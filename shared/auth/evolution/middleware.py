from typing import Optional
from fastapi import Header, HTTPException, status

from shared.auth.evolution.service import evolution_auth_service


async def get_current_evolution_user(authorization: Optional[str] = Header(None)) -> dict:
    """Dependency verifying an Evolution demo session token.
    Strictly denies access to organizational tokens or expired demo sessions.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header. Expected Bearer <evolution_token>.",
        )

    token = authorization.split(" ")[1]
    payload = evolution_auth_service.verify_demo_token(token)

    if payload.get("scope") != "evolution:demo" or payload.get("iss") != "axios-evolution":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Token does not originate from an authorized Evolution demo session.",
        )

    return payload
