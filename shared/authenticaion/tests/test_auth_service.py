import pytest
import asyncio
import uuid
from fastapi.testclient import TestClient
from app.main import app
from app.repositories.auth_repository import repository
from app.core.config import settings

client = TestClient(app)

@pytest.fixture(autouse=True, scope="module")
def setup_database():
    asyncio.run(repository.init_db())

def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "Authentication" in data["service"]

def test_superadmin_bootstrap_login():
    payload = {
        "email": settings.SUPERADMIN_EMAIL,
        "password": settings.SUPERADMIN_PASSWORD,
    }
    res = client.post("/api/v1/auth/login", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["role"] == "SUPER_ADMIN"

    # Get Me
    headers = {"Authorization": f"Bearer {data['access_token']}"}
    res_me = client.get("/api/v1/auth/me", headers=headers)
    assert res_me.status_code == 200
    me_data = res_me.json()
    assert me_data["email"] == settings.SUPERADMIN_EMAIL
    assert "upload_documents" in me_data["permissions"]

def test_registration_and_otp_verification_flow():
    unique_suffix = uuid.uuid4().hex[:6]
    test_email = f"engineer_{unique_suffix}@athleia.ai"
    reg_payload = {
        "email": test_email,
        "password": "SecureTestPassword123!",
        "full_name": "Test Field Engineer",
        "organization": "Athleia Energy",
    }
    res_reg = client.post("/api/v1/auth/register", json=reg_payload)
    assert res_reg.status_code == 200
    assert res_reg.json()["status"] == "success"

    # Unverified login attempt should fail with HTTP 403
    res_unverified = client.post("/api/v1/auth/login", json={
        "email": test_email,
        "password": "SecureTestPassword123!",
    })
    assert res_unverified.status_code == 403

    user = asyncio.run(repository.get_user_by_email(test_email))
    assert user is not None
    assert user.role == "EMPLOYEE"
    assert user.is_verified is False
