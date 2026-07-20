import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from app.domain.models import NotificationCreate, Notification
from app.repositories.notification_repository import repository
from app.websocket.manager import manager

router = APIRouter(prefix="/api/v1/notifications", tags=["Notification Management"])

@router.on_event("startup")
async def startup_event():
    await repository.init_db()

@router.post("", summary="Publish / Create Notification")
async def create_notification(req: NotificationCreate):
    """
    Creates a new notification event, persists it in the repository,
    and broadcasts it in real-time to active WebSocket web clients.
    """
    notif_id = f"notif_{uuid.uuid4().hex[:8]}"
    notification = Notification(
        notification_id=notif_id,
        title=req.title,
        message=req.message,
        type=req.type,
        priority=req.priority,
        source_service=req.source_service,
        recipient=req.recipient,
        correlation_id=req.correlation_id,
        metadata=req.metadata,
    )

    saved = await repository.save_notification(notification)
    
    # Real-time WebSocket Broadcast
    notif_dict = saved.model_dump()
    await manager.broadcast(notif_dict, recipient=req.recipient)

    return saved

@router.get("", summary="List Notifications")
async def list_notifications(
    recipient: Optional[str] = Query("all"),
    limit: int = Query(50, ge=1, le=200),
    is_read: Optional[bool] = Query(None),
):
    notifications = await repository.get_notifications(recipient=recipient, limit=limit, is_read=is_read)
    return {"count": len(notifications), "notifications": notifications}

@router.get("/unread/count", summary="Get Unread Notification Count")
async def get_unread_count(recipient: Optional[str] = Query("all")):
    count = await repository.get_unread_count(recipient=recipient)
    return {"unread_count": count, "recipient": recipient}

@router.get("/{notification_id}", summary="Get Notification Details")
async def get_notification(notification_id: str):
    notif = await repository.get_notification_by_id(notification_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notif

@router.patch("/{notification_id}/read", summary="Mark Notification as Read")
async def mark_read(notification_id: str):
    success = await repository.mark_as_read(notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "success", "notification_id": notification_id, "is_read": True}

@router.patch("/read-all", summary="Mark All Notifications as Read")
async def mark_all_read(recipient: Optional[str] = Query("all")):
    updated_count = await repository.mark_all_as_read(recipient=recipient)
    return {"status": "success", "updated_count": updated_count, "recipient": recipient}

@router.delete("/clear-all", summary="Clear All Notifications")
async def clear_all_notifications():
    """Hard-delete ALL notifications. Super Admin action."""
    deleted = await repository.clear_all_notifications()
    return {"status": "success", "deleted_count": deleted}

@router.delete("/{notification_id}", summary="Delete Notification")
async def delete_notification(notification_id: str):
    success = await repository.delete_notification(notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "success", "deleted_id": notification_id}
