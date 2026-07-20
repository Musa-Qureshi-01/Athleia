import json
from typing import Dict, List
from fastapi import WebSocket
from app.core.logging import logger

class ConnectionManager:
    """
    Manages active WebSocket client connections for real-time notification broadcasting.
    """

    def __init__(self):
        # Maps recipient/user_id -> List of active WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, recipient: str = "all"):
        await websocket.accept()
        if recipient not in self.active_connections:
            self.active_connections[recipient] = []
        self.active_connections[recipient].append(websocket)
        logger.info(f"[WebSocket] Connected client session for recipient: '{recipient}' (Total: {len(self.active_connections[recipient])})")

    def disconnect(self, websocket: WebSocket, recipient: str = "all"):
        if recipient in self.active_connections:
            if websocket in self.active_connections[recipient]:
                self.active_connections[recipient].remove(websocket)
            if not self.active_connections[recipient]:
                del self.active_connections[recipient]
        logger.info(f"[WebSocket] Disconnected client session for recipient: '{recipient}'")

    async def send_personal_message(self, message_dict: dict, websocket: WebSocket):
        await websocket.send_text(json.dumps(message_dict))

    async def broadcast(self, message_dict: dict, recipient: str = "all"):
        payload = json.dumps(message_dict)
        recipients_to_notify = [recipient]
        if recipient != "all":
            recipients_to_notify.append("all")

        count = 0
        for target in recipients_to_notify:
            if target in self.active_connections:
                for connection in self.active_connections[target]:
                    try:
                        await connection.send_text(payload)
                        count += 1
                    except Exception as e:
                        logger.warning(f"[WebSocket] Error broadcasting message: {e}")

        logger.info(f"[WebSocket] Broadcasted notification '{message_dict.get('notification_id')}' to {count} active sessions.")

manager = ConnectionManager()
