"""App package adapter for run_services orchestration."""
import sys
from pathlib import Path

# Add project root to sys.path so 'shared' and 'auth' modules resolve
_root = Path(__file__).resolve().parent.parent.parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from shared.auth.main import app

__all__ = ["app"]
