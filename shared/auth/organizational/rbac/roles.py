from enum import Enum


class SystemRole(str, Enum):
    """Organisational enterprise roles."""
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    EMPLOYEE = "EMPLOYEE"
    AUDITOR = "AUDITOR"


# Role hierarchy score for privilege comparison
ROLE_HIERARCHY = {
    SystemRole.SUPER_ADMIN: 100,
    SystemRole.ADMIN: 80,
    SystemRole.MANAGER: 60,
    SystemRole.AUDITOR: 40,
    SystemRole.EMPLOYEE: 20,
}
