from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.websocket.manager import manager
from app.core.logging import logger

ws_router = APIRouter(tags=["Real-Time WebSockets"])

@ws_router.websocket("/ws/notifications")
async def websocket_notifications_endpoint(
    websocket: WebSocket,
    recipient: str = Query("all")
):
    """
    Real-time WebSocket endpoint for receiving immediate in-app notifications.
    Clients connect to /ws/notifications?recipient=admin
    """
    await manager.connect(websocket, recipient=recipient)
    try:
        while True:
            # Keep connection alive & listen for ping frames
            data = await websocket.receive_text()
            logger.debug(f"[WebSocket] Received client heartbeat text: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket, recipient=recipient)
    except Exception as e:
        logger.warning(f"[WebSocket] Exception in connection: {e}")
        manager.disconnect(websocket, recipient=recipient)
