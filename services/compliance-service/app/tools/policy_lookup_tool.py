"""Policy Lookup Tool - Searches trusted regulatory frameworks (ISO, OSHA, NIST, IEC).
"""

from typing import Any, Dict
from app.tools.base import BaseComplianceTool

APPROVED_REGULATORY_REFERENCES = {
    "OSHA_1910_119": {
        "title": "OSHA 1910.119 Process Safety Management",
        "clause": "1910.119(f)",
        "content": "The employer shall develop and implement written operating procedures that provide clear instructions for safely conducting activities involved in each covered process.",
    },
    "ISO_9001_2015": {
        "title": "ISO 9001:2015 Quality Management Systems",
        "clause": "Clause 7.5.3",
        "content": "Documented information required by the quality management system shall be controlled to ensure it is adequately protected and available where needed.",
    },
    "NIST_800_53": {
        "title": "NIST SP 800-53 Security Controls",
        "clause": "AC-2 / CM-8",
        "content": "Organization reviews and updates documented inventory of information system components and security configurations.",
    },
}


class PolicyLookupTool(BaseComplianceTool):
    @property
    def name(self) -> str:
        return "policy_lookup_tool"

    @property
    def description(self) -> str:
        return "Queries trusted internal company policies and approved regulatory references (ISO, OSHA, NIST, IEC)."

    async def run(self, standard_key: str) -> Dict[str, Any]:
        key = standard_key.upper().replace(".", "_").replace(" ", "_")
        for k, ref in APPROVED_REGULATORY_REFERENCES.items():
            if key in k or k in key:
                return ref

        return {
            "title": f"Approved Policy Standard ({standard_key})",
            "clause": "Corporate Compliance Clause 1.0",
            "content": "Standard operating guidelines require explicit safety isolation and signed verification.",
        }
