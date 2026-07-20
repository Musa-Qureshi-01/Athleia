"""Base Tool class for Compliance Intelligence Service.
Every capability is exposed as an independent tool.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseComplianceTool(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        pass

    @abstractmethod
    async def run(self, **kwargs) -> Any:
        pass
