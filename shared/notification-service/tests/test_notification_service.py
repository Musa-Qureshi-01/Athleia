import pytest
import asyncio
from fastapi.testclient import TestClient
from app.main import app
from app.repositories.notification_repository import repository
from app.domain.enums import NotificationType, NotificationPriority

client = TestClient(app)

@pytest.fixture(autouse=True, scope="module")
def setup_database():
    asyncio.run(repository.init_db())

def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["status"] == "healthy"
    assert "Notification" in json_data["service"]

def test_create_and_list_notifications():
    payload = {
        "title": "Critical Safety Violation Detected",
        "message": "SOP cooling water procedure missing mandatory safety section.",
        "type": "CRITICAL",
        "priority": "URGENT",
        "source_service": "compliance-service",
        "recipient": "admin",
        "correlation_id": "corr_test_101",
    }
    res = client.post("/api/v1/notifications", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "notification_id" in data
    notif_id = data["notification_id"]
    assert data["title"] == payload["title"]
    assert data["is_read"] is False

    # Get list
    res_list = client.get("/api/v1/notifications?recipient=admin")
    assert res_list.status_code == 200
    list_data = res_list.json()
    assert list_data["count"] > 0

    # Get unread count
    res_unread = client.get("/api/v1/notifications/unread/count?recipient=admin")
    assert res_unread.status_code == 200
    assert res_unread.json()["unread_count"] > 0

    # Mark read
    res_read = client.patch(f"/api/v1/notifications/{notif_id}/read")
    assert res_read.status_code == 200
    assert res_read.json()["is_read"] is True

    # Delete
    res_del = client.delete(f"/api/v1/notifications/{notif_id}")
    assert res_del.status_code == 200
