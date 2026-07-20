from app.tools.registry import tool_registry
from app.tools.enterprise.enterprise_search import EnterpriseSearchTool
from app.tools.enterprise.knowledge_tool import KnowledgeTool
from app.tools.enterprise.reasoning_tool import GroundedReasoningTool
from app.tools.enterprise.compliance_tool import ComplianceTool
from app.tools.enterprise.maintenance_tool import MaintenanceTool
from app.tools.enterprise.ingestion_tool import IngestionDocumentTool
from app.tools.external.wikipedia_tool import WikipediaTool
from app.tools.external.duckduckgo_tool import DuckDuckGoTool
from app.tools.external.calculator_tool import CalculatorTool
from app.tools.external.unit_converter import UnitConverterTool
from app.tools.external.translation_tool import TranslationTool

# Register default enterprise & external tools
tool_registry.register(EnterpriseSearchTool())
tool_registry.register(KnowledgeTool())
tool_registry.register(GroundedReasoningTool())
tool_registry.register(ComplianceTool())
tool_registry.register(MaintenanceTool())
tool_registry.register(IngestionDocumentTool())
tool_registry.register(WikipediaTool())
tool_registry.register(DuckDuckGoTool())
tool_registry.register(CalculatorTool())
tool_registry.register(UnitConverterTool())
tool_registry.register(TranslationTool())
