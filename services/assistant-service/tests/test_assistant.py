import pytest
import asyncio
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.repositories.assistant_repository import repository

@pytest.fixture(autouse=True)
def init_test_db():
    asyncio.run(repository.init_db())

client = TestClient(app)

def test_health_check():
    response = client.get(f"{settings.API_V1_STR}/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_list_models():
    response = client.get(f"{settings.API_V1_STR}/models")
    assert response.status_code == 200
    data = response.json()
    assert "available_models" in data
    assert len(data["available_models"]) > 0

def test_list_tools():
    response = client.get(f"{settings.API_V1_STR}/tools")
    assert response.status_code == 200
    data = response.json()
    assert "tools" in data
    assert len(data["tools"]) > 0

def test_sync_chat_completion():
    payload = {
        "message": "How do I troubleshoot cooling pump pressure drops?",
        "mode": "standard"
    }
    response = client.post(f"{settings.API_V1_STR}/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert "conversation_id" in data
    assert len(data["answer"]) > 0
