import re

class SmartTitleGenerator:
    """
    Smart Chat Title Generator.
    Extracts high-value industrial topic titles from initial prompt messages.
    """
    def generate_title(self, prompt: str) -> str:
        clean = prompt.strip()
        if not clean:
            return "General Query"

        # Heuristic rules for common industrial query patterns
        if "pump" in clean.lower():
            if "pressure" in clean.lower():
                return "Pump Pressure Troubleshooting"
            return "Cooling Pump Maintenance"
        elif "compliance" in clean.lower() or "iso" in clean.lower() or "osha" in clean.lower():
            return "ISO & Compliance Audit Q&A"
        elif "maintenance" in clean.lower() or "mtbf" in clean.lower():
            return "Predictive Maintenance Review"
        elif "lockout" in clean.lower() or "tagout" in clean.lower() or "safety" in clean.lower():
            return "Safety Isolation & Lockout SOP"
        elif "boiler" in clean.lower() or "turbine" in clean.lower():
            return "Turbine & Boiler Inspection"
        elif "compressor" in clean.lower():
            return "Compressor Operations Guide"

        # Clean fallback snippet
        words = clean.split()
        short_title = " ".join(words[:5])
        short_title = re.sub(r'[^\w\s-]', '', short_title).title()
        return short_title if len(short_title) > 3 else "Industrial Inquiry"

title_generator = SmartTitleGenerator()
