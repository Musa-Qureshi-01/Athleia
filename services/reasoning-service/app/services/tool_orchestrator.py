"""Tool Orchestrator and 4-Tier Knowledge Priority Dispatcher for Athleia Reasoning Service.
"""

from typing import Any, Callable, Dict, List, Optional
from app.core.config import settings
from app.core.logging import logger
from app.schemas.tools import KnowledgePriority, ToolExecutionResult, ToolMetadata, ToolType


class ToolOrchestrator:
    """Registry and orchestrator for internal, industrial, reasoning, evaluation, and external tools."""

    def __init__(self):
        self._registry: Dict[str, ToolMetadata] = {}
        self._handlers: Dict[str, Callable] = {}
        self._register_default_tools()

    def _register_default_tools(self):
        # 1. Internal Retrieval Tools (Priority 1)
        self.register_tool(
            ToolMetadata(
                name="semantic_search",
                tool_type=ToolType.INTERNAL_RETRIEVAL,
                description="Dense vector semantic search over internal enterprise documents and P&IDs",
                knowledge_priority=KnowledgePriority.PRIORITY_1_ENTERPRISE,
                enabled=True
            )
        )
        self.register_tool(
            ToolMetadata(
                name="keyword_search",
                tool_type=ToolType.INTERNAL_RETRIEVAL,
                description="BM25 keyword search over equipment tags and document titles",
                knowledge_priority=KnowledgePriority.PRIORITY_1_ENTERPRISE,
                enabled=True
            )
        )
        self.register_tool(
            ToolMetadata(
                name="hybrid_search",
                tool_type=ToolType.INTERNAL_RETRIEVAL,
                description="Reciprocal Rank Fusion (RRF) dense + sparse hybrid search",
                knowledge_priority=KnowledgePriority.PRIORITY_1_ENTERPRISE,
                enabled=True
            )
        )

        # 2. Industrial Tools (Priority 2)
        self.register_tool(
            ToolMetadata(
                name="equipment_lookup",
                tool_type=ToolType.INDUSTRIAL_LOOKUP,
                description="Lookup asset specifications, equipment IDs, and instrument tags",
                knowledge_priority=KnowledgePriority.PRIORITY_2_STRUCTURED_DB,
                enabled=True
            )
        )

        # 3. Optional External Tools (Priority 4 - Disabled by default)
        self.register_tool(
            ToolMetadata(
                name="web_search",
                tool_type=ToolType.EXTERNAL_KNOWLEDGE,
                description="Supplemental web search for non-internal general information",
                knowledge_priority=KnowledgePriority.PRIORITY_4_WEB_SEARCH,
                enabled=settings.ENABLE_WEB_SEARCH
            )
        )

    def register_tool(self, metadata: ToolMetadata, handler: Optional[Callable] = None):
        """Registers a tool metadata and optional execution handler."""
        self._registry[metadata.name] = metadata
        if handler:
            self._handlers[metadata.name] = handler

    def get_registered_tools(self, allow_external: bool = False) -> List[ToolMetadata]:
        """Returns enabled tools filtered by external knowledge safety controls."""
        tools = []
        for meta in self._registry.values():
            if not meta.enabled:
                continue
            if meta.knowledge_priority == KnowledgePriority.PRIORITY_4_WEB_SEARCH and not allow_external:
                continue
            tools.append(meta)
        return tools

    def determine_tool_pipeline(self, query: str, allow_external: bool = False) -> List[str]:
        """Determines minimum required tool execution pipeline following 4-tier Knowledge Priority."""
        pipeline = ["hybrid_search"]  # Always start with Priority 1 Enterprise Retrieval

        # Add industrial lookup if query mentions equipment tag
        if any(keyword in query.upper() for keyword in ["P-", "PT-", "VLV-", "TK-", "HEX-", "FT-", "TT-"]):
            pipeline.append("equipment_lookup")

        # Allow external web search ONLY if explicitly enabled and allowed
        if allow_external and settings.ENABLE_EXTERNAL_TOOLS and settings.ENABLE_WEB_SEARCH:
            pipeline.append("web_search")

        return pipeline


tool_orchestrator = ToolOrchestrator()
