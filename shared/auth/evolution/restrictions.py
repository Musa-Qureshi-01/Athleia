from typing import List


class EvolutionRestrictions:
    """Demo-specific operational boundaries.
    Evolution sessions are strictly sandboxed and forbidden from accessing production configurations or tenant data.
    """
    MAX_DEMO_QUERIES: int = 50
    SESSION_DURATION_HOURS: int = 8

    # Permitted demo capabilities
    PERMITTED_FEATURES: List[str] = [
        "demo:explore_interface",
        "demo:sample_reasoning_query",
        "demo:view_mock_knowledge",
        "demo:test_assistant_chat",
    ]

    # Explicitly restricted operations
    RESTRICTED_FEATURES: List[str] = [
        "org:manage_users",
        "org:assign_roles",
        "org:configure_settings",
        "org:upload_production_documents",
        "org:delete_documents",
        "org:execute_live_compliance_audit",
        "org:view_audit_logs",
        "org:access_production_database",
    ]

    @classmethod
    def is_feature_permitted(cls, feature_name: str) -> bool:
        return feature_name in cls.PERMITTED_FEATURES
