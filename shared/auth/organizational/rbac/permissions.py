from typing import Dict, Set
from shared.auth.organizational.rbac.roles import SystemRole


class Permission:
    # Knowledge & Search
    KNOWLEDGE_SEARCH = "search_knowledge"
    DOCUMENTS_VIEW = "view_documents"
    DOCUMENTS_UPLOAD = "upload_documents"
    DOCUMENTS_DELETE = "delete_documents"

    # AI Reasoning
    REASONING_EXECUTE = "use_ai_reasoning"
    REASONING_VIEW = "view_reasoning_history"

    # Compliance & Audit
    COMPLIANCE_VIEW = "view_compliance_findings"
    COMPLIANCE_TRIGGER = "trigger_compliance_agent"
    AUDIT_LOGS_VIEW = "view_audit_logs"

    # Maintenance
    MAINTENANCE_VIEW = "view_maintenance_findings"
    MAINTENANCE_TRIGGER = "trigger_predictive_maintenance_agent"

    # Notifications & Analytics
    NOTIFICATIONS_RECEIVE = "receive_notifications"
    REPORTS_VIEW = "view_reports"
    ANALYTICS_VIEW = "view_team_analytics"

    # Administration
    USERS_MANAGE = "manage_users"
    ROLES_ASSIGN = "assign_roles"
    ORG_CONFIGURE = "configure_organization"
    METRICS_VIEW = "view_system_metrics"


# Permission Mappings per Role
BASE_EMPLOYEE_PERMISSIONS: Set[str] = {
    Permission.KNOWLEDGE_SEARCH,
    Permission.REASONING_EXECUTE,
    Permission.DOCUMENTS_VIEW,
    Permission.MAINTENANCE_VIEW,
    Permission.COMPLIANCE_VIEW,
    Permission.NOTIFICATIONS_RECEIVE,
}

AUDITOR_PERMISSIONS: Set[str] = {
    Permission.KNOWLEDGE_SEARCH,
    Permission.DOCUMENTS_VIEW,
    Permission.COMPLIANCE_VIEW,
    Permission.AUDIT_LOGS_VIEW,
    Permission.REPORTS_VIEW,
    Permission.METRICS_VIEW,
}

MANAGER_PERMISSIONS: Set[str] = BASE_EMPLOYEE_PERMISSIONS | {
    Permission.REPORTS_VIEW,
    Permission.ANALYTICS_VIEW,
    Permission.REASONING_VIEW,
}

ADMIN_PERMISSIONS: Set[str] = MANAGER_PERMISSIONS | AUDITOR_PERMISSIONS | {
    Permission.DOCUMENTS_UPLOAD,
    Permission.COMPLIANCE_TRIGGER,
    Permission.MAINTENANCE_TRIGGER,
    Permission.USERS_MANAGE,
    Permission.ROLES_ASSIGN,
    Permission.ORG_CONFIGURE,
    Permission.DOCUMENTS_DELETE,
    Permission.METRICS_VIEW,
}

SUPER_ADMIN_PERMISSIONS: Set[str] = ADMIN_PERMISSIONS | {
    Permission.AUDIT_LOGS_VIEW,
}

ROLE_PERMISSION_MAP: Dict[SystemRole, Set[str]] = {
    SystemRole.EMPLOYEE: BASE_EMPLOYEE_PERMISSIONS,
    SystemRole.AUDITOR: AUDITOR_PERMISSIONS,
    SystemRole.MANAGER: MANAGER_PERMISSIONS,
    SystemRole.ADMIN: ADMIN_PERMISSIONS,
    SystemRole.SUPER_ADMIN: SUPER_ADMIN_PERMISSIONS,
}
