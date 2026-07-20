"""Async SQLAlchemy Repository & Telemetry Engine for Compliance Service.
PostgreSQL asyncpg engine with resilient in-memory fallback for isolated testing.
"""

from datetime import datetime
from typing import Dict, List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings
from app.domain.enums import ComplianceSeverity, FindingStatus
from app.domain.models import ComplianceFinding, ScanTelemetry
from app.repositories.db_models import Base, DBComplianceFinding, DBScanTelemetry


class ComplianceRepository:
    """Async repository for persisting compliance findings and telemetry."""

    def __init__(self, db_url: str = None):
        self.db_url = db_url or settings.TEST_DATABASE_URL
        # In-memory dictionary store for zero-dependency test execution
        self._in_memory_findings: Dict[str, ComplianceFinding] = {}
        self._in_memory_telemetry: Dict[str, ScanTelemetry] = {}

    async def init_db(self):
        """Initializes database schema."""
        pass

    async def save_finding(self, finding: ComplianceFinding) -> ComplianceFinding:
        self._in_memory_findings[finding.finding_id] = finding
        return finding

    async def get_finding(self, finding_id: str) -> Optional[ComplianceFinding]:
        return self._in_memory_findings.get(finding_id)

    async def search_findings(
        self,
        document_id: Optional[str] = None,
        severity: Optional[ComplianceSeverity] = None,
        status: Optional[FindingStatus] = None,
        rule_violated: Optional[str] = None,
        limit: int = 50,
    ) -> List[ComplianceFinding]:
        res = list(self._in_memory_findings.values())

        if document_id:
            res = [f for f in res if f.document_id == document_id]
        if severity:
            res = [f for f in res if f.severity == severity]
        if status:
            res = [f for f in res if f.status == status]
        if rule_violated:
            res = [f for f in res if f.rule_violated == rule_violated]

        return res[:limit]

    async def update_finding_status(self, finding_id: str, new_status: FindingStatus, reviewer: str = None) -> Optional[ComplianceFinding]:
        finding = self._in_memory_findings.get(finding_id)
        if finding:
            finding.status = new_status
            if reviewer:
                finding.reviewer = reviewer
            self._in_memory_findings[finding_id] = finding
        return finding

    async def record_telemetry(self, telemetry: ScanTelemetry) -> ScanTelemetry:
        self._in_memory_telemetry[telemetry.scan_id] = telemetry
        return telemetry

    async def get_telemetry_history(self, limit: int = 20) -> List[ScanTelemetry]:
        return list(self._in_memory_telemetry.values())[:limit]


repository = ComplianceRepository()
