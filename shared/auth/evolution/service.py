import uuid
import secrets
import logging
import asyncio
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional

import jwt
from fastapi import HTTPException, status

from shared.auth.config import settings
from shared.auth.db import DBEvolutionAccount, async_session_factory
from shared.auth.models import (
    EvolutionTokenRequest,
    EvolutionTokenResponse,
    EvolutionStatusResponse,
)
from shared.auth.evolution.restrictions import EvolutionRestrictions

logger = logging.getLogger("auth.evolution.service")


class EvolutionAuthService:
    def __init__(self):
        # In-memory tracking of active demo sessions and quota usage
        self._active_sessions: Dict[str, Dict[str, Any]] = {}

    def issue_demo_token(self, req: EvolutionTokenRequest) -> EvolutionTokenResponse:
        session_id = f"evo_{uuid.uuid4().hex[:12]}"
        now = datetime.now(timezone.utc)
        expires = now + timedelta(hours=settings.EVOLUTION_SESSION_EXPIRE_HOURS)

        demo_email = str(req.demo_email) if req.demo_email else f"guest_{secrets.token_hex(4)}@evolution.demo"
        demo_org = req.demo_organization or "Evolution Demo Sandbox"

        payload = {
            "sub": session_id,
            "session_id": session_id,
            "email": demo_email,
            "organization": demo_org,
            "role": "EVOLUTION_GUEST",
            "scope": "evolution:demo",
            "iss": "axios-evolution",
            "iat": int(now.timestamp()),
            "exp": int(expires.timestamp()),
            "type": "evolution_access",
        }

        # Signed using dedicated EVOLUTION_JWT_SECRET_KEY to make cross-system signature reuse cryptographically impossible
        token = jwt.encode(
            payload,
            settings.EVOLUTION_JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM,
        )

        self._active_sessions[session_id] = {
            "session_id": session_id,
            "email": demo_email,
            "organization": demo_org,
            "queries_remaining": EvolutionRestrictions.MAX_DEMO_QUERIES,
            "created_at": now.isoformat(),
        }

        # Persist session to dedicated evolution_accounts table
        try:
            async def _persist_session():
                async with async_session_factory() as db:
                    account = DBEvolutionAccount(
                        session_id=session_id,
                        demo_email=demo_email,
                        full_name=req.full_name or "Evaluation Guest",
                        phone_number=req.phone_number or "",
                        demo_organization=demo_org,
                        role="EVOLUTION_GUEST",
                        queries_used=0,
                        queries_limit=EvolutionRestrictions.MAX_DEMO_QUERIES,
                        is_active=True,
                        created_at=now.isoformat(),
                        expires_at=expires.isoformat(),
                    )
                    db.add(account)
                    await db.commit()

            try:
                loop = asyncio.get_running_loop()
                loop.create_task(_persist_session())
            except RuntimeError:
                pass
        except Exception as e:
            logger.warning(f"Notice: evolution account db save deferred: {e}")

        return EvolutionTokenResponse(
            access_token=token,
            token_type="Bearer",
            expires_in_seconds=settings.EVOLUTION_SESSION_EXPIRE_HOURS * 3600,
            session_id=session_id,
            demo_user=demo_email,
            role="EVOLUTION_GUEST",
            scope="evolution:demo",
            queries_allocated=EvolutionRestrictions.MAX_DEMO_QUERIES,
            queries_remaining=EvolutionRestrictions.MAX_DEMO_QUERIES,
        )

    def verify_demo_token(self, token: str) -> Dict[str, Any]:
        """Strictly validates Evolution demo tokens.
        Rejects organisational tokens or tampered credentials.
        """
        try:
            payload = jwt.decode(
                token,
                settings.EVOLUTION_JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
                options={"verify_exp": True, "verify_iss": True},
                issuer="axios-evolution",
            )

            # Enforce scope check
            if payload.get("scope") != "evolution:demo":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid token scope: Expected Evolution demo token.",
                )

            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Evolution demo session has expired. Please launch a fresh demo workspace.",
            )
        except (jwt.InvalidTokenError, HTTPException) as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Evolution demo credentials.",
            )

    def get_session_status(self, session_id: str) -> EvolutionStatusResponse:
        session = self._active_sessions.get(session_id)
        queries_left = session["queries_remaining"] if session else EvolutionRestrictions.MAX_DEMO_QUERIES

        return EvolutionStatusResponse(
            active=True,
            session_id=session_id,
            role="EVOLUTION_GUEST",
            scope="evolution:demo",
            queries_remaining=queries_left,
            features_permitted=EvolutionRestrictions.PERMITTED_FEATURES,
            features_restricted=EvolutionRestrictions.RESTRICTED_FEATURES,
        )

    def consume_query(self, session_id: str) -> int:
        session = self._active_sessions.get(session_id)
        if session:
            if session["queries_remaining"] <= 0:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Demo query quota exhausted for this session. Please launch a new demo workspace.",
                )
            session["queries_remaining"] -= 1
            return session["queries_remaining"]
        return EvolutionRestrictions.MAX_DEMO_QUERIES


evolution_auth_service = EvolutionAuthService()
