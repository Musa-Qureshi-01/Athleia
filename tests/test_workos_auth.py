import os
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from unittest.mock import AsyncMock
from contextlib import asynccontextmanager
from shared.auth.main import app

@asynccontextmanager
async def dummy_lifespan(app):
    yield

app.router.lifespan_context = dummy_lifespan
from shared.auth.config import settings
from shared.auth.models import (
    UserRole,
    UserStatus,
    UserLoginRequest,
    UserRegisterRequest,
    EvolutionTokenRequest,
)
from shared.auth.organizational.service import org_auth_service, hash_password
from shared.auth.organizational.rbac.roles import SystemRole
from shared.auth.organizational.rbac.permissions import Permission
from shared.auth.organizational.rbac.enforcer import (
    get_role_permissions,
    has_permission,
    enforce_permission,
)
from shared.auth.evolution.service import evolution_auth_service
from shared.auth.evolution.restrictions import EvolutionRestrictions


import httpx

@pytest.fixture
async def async_client():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_health_endpoints(async_client):
    res = await async_client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "WorkOS" in data["auth_providers"]["organizational"]
    assert "WorkOS" in data["auth_providers"]["evolution"]


def test_rbac_roles_and_permissions():
    # Employee permissions
    emp_perms = get_role_permissions(SystemRole.EMPLOYEE)
    assert Permission.KNOWLEDGE_SEARCH in emp_perms
    assert Permission.REASONING_EXECUTE in emp_perms
    assert Permission.USERS_MANAGE not in emp_perms

    # Manager permissions
    mgr_perms = get_role_permissions(SystemRole.MANAGER)
    assert Permission.REPORTS_VIEW in mgr_perms
    assert Permission.USERS_MANAGE not in mgr_perms

    # Admin permissions
    admin_perms = get_role_permissions(SystemRole.ADMIN)
    assert Permission.USERS_MANAGE in admin_perms
    assert Permission.ROLES_ASSIGN in admin_perms
    assert Permission.COMPLIANCE_TRIGGER in admin_perms

    # Auditor permissions
    auditor_perms = get_role_permissions(SystemRole.AUDITOR)
    assert Permission.AUDIT_LOGS_VIEW in auditor_perms
    assert Permission.COMPLIANCE_VIEW in auditor_perms
    assert Permission.DOCUMENTS_UPLOAD not in auditor_perms


def test_organizational_token_generation_and_validation():
    token = org_auth_service.create_access_token(
        user_id="user_test_123",
        email="admin@axios.ai",
        role="ADMIN",
        full_name="Admin User",
        org="Axios Enterprise",
    )
    assert token is not None

    payload = org_auth_service.verify_token(token)
    assert payload["sub"] == "user_test_123"
    assert payload["email"] == "admin@axios.ai"
    assert payload["role"] == "ADMIN"
    assert payload["scope"] == "organizational"
    assert payload["iss"] == "axios-organizational"


def test_evolution_token_generation_and_validation():
    req = EvolutionTokenRequest(demo_email="tester@evolution.demo", demo_organization="Test Org")
    evo_res = evolution_auth_service.issue_demo_token(req)

    assert evo_res.access_token is not None
    assert evo_res.role == "EVOLUTION_GUEST"
    assert evo_res.scope == "evolution:demo"
    assert evo_res.queries_remaining == EvolutionRestrictions.MAX_DEMO_QUERIES

    payload = evolution_auth_service.verify_demo_token(evo_res.access_token)
    assert payload["role"] == "EVOLUTION_GUEST"
    assert payload["scope"] == "evolution:demo"
    assert payload["iss"] == "axios-evolution"


@pytest.mark.asyncio
async def test_strict_isolation_boundaries(async_client):
    """Ensure Evolution demo token CANNOT access organizational endpoints,
    and Organizational token CANNOT access Evolution endpoints.
    """
    # 1. Create Evolution demo token
    req = EvolutionTokenRequest(demo_email="attacker@evolution.demo")
    evo_token = evolution_auth_service.issue_demo_token(req).access_token

    # Attempt to access organizational endpoint (/api/v1/auth/me) with Evolution token
    res_org = await async_client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {evo_token}"},
    )
    # Must be 401 Unauthorized or 403 Forbidden
    assert res_org.status_code in [401, 403], f"Security breach! Evolution token accepted: {res_org.json()}"

    # 2. Create Organizational token
    org_token = org_auth_service.create_access_token(
        user_id="org_user_1",
        email="user@axios.ai",
        role="EMPLOYEE",
        full_name="Org User",
        org="Axios Org",
    )

    # Attempt to access Evolution endpoint with Organizational token
    res_evo = await async_client.get(
        "/api/v1/auth/evolution/verify",
        headers={"Authorization": f"Bearer {org_token}"},
    )
    assert res_evo.status_code in [401, 403], f"Security breach! Org token accepted on evolution: {res_evo.json()}"


@pytest.mark.asyncio
async def test_evolution_endpoints(async_client):
    # Issue demo token via API
    res = await async_client.post(
        "/api/v1/auth/evolution/token",
        json={"demo_email": "evaluator@test.com", "purpose": "Testing"},
    )
    assert res.status_code == 200
    data = res.json()
    token = data["access_token"]
    assert data["role"] == "EVOLUTION_GUEST"

    # Verify session via API
    verify_res = await async_client.get(
        "/api/v1/auth/evolution/verify",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert verify_res.status_code == 200
    assert verify_res.json()["valid"] is True

    # Check status and quota constraints
    status_res = await async_client.get(
        "/api/v1/auth/evolution/status",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert status_res.status_code == 200
    status_data = status_res.json()
    assert "org:manage_users" in status_data["features_restricted"]
    assert "demo:sample_reasoning_query" in status_data["features_permitted"]


def test_separate_database_tables():
    from shared.auth.db import DBOrganizationalUser, DBEvolutionAccount
    assert DBOrganizationalUser.__tablename__ == "organizational_users"
    assert DBEvolutionAccount.__tablename__ == "evolution_accounts"
    # Ensure tables are strictly distinct
    assert DBOrganizationalUser.__tablename__ != DBEvolutionAccount.__tablename__


def test_dual_workos_credentials():
    assert settings.WORKOS_ORGANIZATIONAL_CLIENT_ID == "client_01M83EW3M730XZFTTJMK02KSCR"
    assert settings.WORKOS_EVOLUTION_CLIENT_ID == "client_01M846R43S9ZVQ162VKTV9ATXQ"
    # Ensure clients are strictly isolated and not pointing to the same application
    assert settings.WORKOS_ORGANIZATIONAL_CLIENT_ID != settings.WORKOS_EVOLUTION_CLIENT_ID


if __name__ == "__main__":
    pytest.main(["-v", __file__])
