from fastapi import APIRouter, Depends, status

from shared.auth.models import (
    EvolutionTokenRequest,
    EvolutionTokenResponse,
    EvolutionStatusResponse,
)
from shared.auth.evolution.service import evolution_auth_service
from shared.auth.evolution.middleware import get_current_evolution_user

evolution_router = APIRouter(prefix="/api/v1/auth/evolution", tags=["Evolution Demo Authentication"])


@evolution_router.post("/token", response_model=EvolutionTokenResponse, summary="Issue Evolution Demo Token")
async def issue_demo_token(req: EvolutionTokenRequest):
    """Launch an isolated Evolution demo workspace with restricted quota and privileges."""
    return await evolution_auth_service.issue_demo_token(req)


@evolution_router.get("/verify", summary="Verify Evolution Demo Session")
async def verify_demo_session(evo_user: dict = Depends(get_current_evolution_user)):
    """Validates active demo token and returns session claims."""
    return {
        "valid": True,
        "session_id": evo_user.get("session_id"),
        "role": evo_user.get("role"),
        "scope": evo_user.get("scope"),
        "demo_user": evo_user.get("email"),
    }


@evolution_router.get("/status", response_model=EvolutionStatusResponse, summary="Get Demo Quota & Constraints")
async def get_demo_status(evo_user: dict = Depends(get_current_evolution_user)):
    session_id = evo_user.get("session_id", "")
    return evolution_auth_service.get_session_status(session_id)
