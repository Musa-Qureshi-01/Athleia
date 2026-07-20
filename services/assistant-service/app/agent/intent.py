from app.llm.router import TaskType

class IntentClassifier:
    """
    Intent Classifier Node.
    Categorizes incoming user queries before planning to optimize token usage and latency.
    """
    def classify(self, query: str) -> TaskType:
        q = query.lower()
        if any(w in q for w in ["translate", "language", "in spanish", "in german"]):
            return TaskType.TRANSLATION
        elif any(w in q for w in ["why", "root cause", "diagnose", "troubleshoot", "reasoning", "failure"]):
            return TaskType.COMPLEX_REASONING
        elif any(w in q for w in ["summarize manual", "document", "sop", "pdf", "file"]):
            return TaskType.DOCUMENT_QA
        elif any(w in q for w in ["search", "find", "sop", "procedure", "iso", "osha", "compliance", "maintenance"]):
            return TaskType.SEARCH_SYNTHESIS
        else:
            return TaskType.FAST_CONVERSATION

intent_classifier = IntentClassifier()
