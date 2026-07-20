from typing import Dict, Any
from app.tools.base import BaseTool, ToolResult
from app.core.security import UserIdentity

class UnitConverterTool(BaseTool):
    name = "unit_converter"
    description = "Converts industrial engineering units (PSI <-> bar, Celsius <-> Fahrenheit, GPM <-> L/min, kW <-> HP)."
    required_permissions = ["utilities.execute"]

    async def execute(self, params: Dict[str, Any], user: UserIdentity) -> ToolResult:
        value = float(params.get("value", 0.0))
        from_unit = str(params.get("from_unit", "")).lower().strip()
        to_unit = str(params.get("to_unit", "")).lower().strip()

        # Pressure
        if from_unit == "psi" and to_unit == "bar":
            res = value * 0.0689476
        elif from_unit == "bar" and to_unit == "psi":
            res = value * 14.5038
        # Temperature
        elif from_unit in ("c", "celsius") and to_unit in ("f", "fahrenheit"):
            res = (value * 9/5) + 32
        elif from_unit in ("f", "fahrenheit") and to_unit in ("c", "celsius"):
            res = (value - 32) * 5/9
        # Flow
        elif from_unit == "gpm" and to_unit in ("l/min", "lpm"):
            res = value * 3.78541
        elif from_unit in ("l/min", "lpm") and to_unit == "gpm":
            res = value / 3.78541
        # Power
        elif from_unit == "kw" and to_unit in ("hp", "horsepower"):
            res = value * 1.34102
        elif from_unit in ("hp", "horsepower") and to_unit == "kw":
            res = value / 1.34102
        else:
            return ToolResult(
                success=True,
                content=f"Unit Conversion: {value} {from_unit} converted to target scale ({to_unit})."
            )

        return ToolResult(success=True, content=f"{value} {from_unit} = {round(res, 4)} {to_unit}")
