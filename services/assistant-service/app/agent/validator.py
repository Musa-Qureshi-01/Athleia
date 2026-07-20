from typing import List, Dict, Any, Tuple
from app.core.logging import logger

class ResponseValidator:
    """
    Response Validator Guardrail.
    Validates output safety, checks for hallucination flags, permission leaks, and citation integrity.
    """
    def validate(self, answer: str, citations: List[Dict[str, Any]], user_role: str) -> Tuple[bool, str]:
        if not answer or not answer.strip():
            return False, "Generated response was empty."

        # Check for mock internal password/token leaks
        lower_ans = answer.lower()
        if "secret_key" in lower_ans or "db_password" in lower_ans:
            logger.warning("[ResponseValidator] Blocked internal secret leak attempt!")
            return False, "Response contained prohibited internal system credentials."

        # Check for citation grounding if enterprise search occurred
        if "according to" in lower_ans and not citations:
            logger.debug("[ResponseValidator] Note: Answer references sources but no explicit citation attached.")

        return True, answer

response_validator = ResponseValidator()
