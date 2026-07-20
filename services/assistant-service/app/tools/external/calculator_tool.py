import math
from typing import Dict, Any
from app.tools.base import BaseTool, ToolResult
from app.core.security import UserIdentity

class CalculatorTool(BaseTool):
    name = "calculator"
    description = "Evaluates mathematical expressions, engineering formulas, MTBF statistics, and percentages safely."
    required_permissions = ["utilities.execute"]

    async def execute(self, params: Dict[str, Any], user: UserIdentity) -> ToolResult:
        expression = params.get("expression", "")
        if not expression:
            return ToolResult(success=False, content="Expression required.")

        allowed_names = {
            "sin": math.sin, "cos": math.cos, "tan": math.tan,
            "sqrt": math.sqrt, "log": math.log, "pi": math.pi, "e": math.e
        }
        try:
            # Safe eval with restricted globals/locals
            res = eval(expression, {"__builtins__": None}, allowed_names)
            return ToolResult(success=True, content=f"Result: {expression} = {res}")
        except Exception as e:
            return ToolResult(success=False, content=f"Calculation error in '{expression}': {str(e)}")
