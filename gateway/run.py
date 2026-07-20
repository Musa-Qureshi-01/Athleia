"""Gateway process launcher."""
import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.gateway_host,
        port=settings.gateway_port,
        reload=settings.debug,
        log_config=None,   # structlog handles all logging
        access_log=False,  # gateway middleware logs requests instead
    )
