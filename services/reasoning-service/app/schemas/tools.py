"""Tool Schemas and 4-Tier Knowledge Priority Enums for Athleia Reasoning Service.
"""

from enum import Enum
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class KnowledgePriority(str, Enum):
    """4-Tier Knowledge Priority Hierarchy."""
    PRIORITY_1_ENTERPRISE = "PRIORITY_1_ENTERPRISE"        # Highest Trust: Internal SOPs, P&IDs, Manuals, Knowledge Graph
    PRIORITY_2_STRUCTURED_DB = "PRIORITY_2_STRUCTURED_DB"    # Priority 2: Maintenance history, asset inventory
    PRIORITY_3_APPROVED_STANDARDS = "PRIORITY_3_APPROVED_STANDARDS"  # Priority 3: ISO, OSHA, NIST, IEEE, Manufacturer Specs
    PRIORITY_4_WEB_SEARCH = "PRIORITY_4_WEB_SEARCH"        # Priority 4: Supplemental Web Search (Disabled by default)


class ToolType(str, Enum):
    INTERNAL_RETRIEVAL = "INTERNAL_RETRIEVAL"
    INDUSTRIAL_LOOKUP = "INDUSTRIAL_LOOKUP"
    REASONING_ENGINE = "REASONING_ENGINE"
    EVALUATION_GUARDRAIL = "EVALUATION_GUARDRAIL"
    EXTERNAL_KNOWLEDGE = "EXTERNAL_KNOWLEDGE"


class ToolMetadata(BaseModel):
    name: str
    tool_type: ToolType
    description: str
    knowledge_priority: KnowledgePriority
    enabled: bool = True


class ToolExecutionResult(BaseModel):
    tool_name: str
    status: str = "SUCCESS"  # SUCCESS, FAILED, SKIPPED
    result_data: Dict[str, Any] = Field(default_factory=dict)
    error_message: Optional[str] = None
    execution_time_ms: int = 0
