from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import String, Float, Integer, JSON, DateTime, Text
from datetime import datetime
from app.core.config import settings
from app.domain.models import MaintenanceFinding, EquipmentHealth, MaintenanceScanTelemetry

Base = declarative_base()

class DBMaintenanceFinding(Base):
    __tablename__ = "maintenance_findings"

    finding_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    equipment_id: Mapped[str] = mapped_column(String(64), index=True)
    asset_name: Mapped[str] = mapped_column(String(255))
    risk_score: Mapped[float] = mapped_column(Float)
    failure_probability: Mapped[float] = mapped_column(Float)
    failure_category: Mapped[str] = mapped_column(String(64))
    evidence: Mapped[list] = mapped_column(JSON)
    historical_pattern: Mapped[str] = mapped_column(Text)
    recommended_action: Mapped[str] = mapped_column(Text)
    estimated_priority: Mapped[str] = mapped_column(String(32), index=True)
    confidence: Mapped[float] = mapped_column(Float)
    timestamp: Mapped[str] = mapped_column(String(64))
    status: Mapped[str] = mapped_column(String(32), index=True)
    finding_metadata: Mapped[dict] = mapped_column(JSON, default=dict)

class DBEquipmentHealth(Base):
    __tablename__ = "equipment_health"

    equipment_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    asset_name: Mapped[str] = mapped_column(String(255))
    health_index: Mapped[float] = mapped_column(Float)
    last_maintenance_date: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    next_recommended_date: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    incident_count: Mapped[int] = mapped_column(Integer, default=0)
    mtbf_days: Mapped[float] = mapped_column(Float, default=180.0)
    risk_rating: Mapped[str] = mapped_column(String(32))

class DBMaintenanceTelemetry(Base):
    __tablename__ = "maintenance_telemetry"

    analysis_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    correlation_id: Mapped[str] = mapped_column(String(64))
    trigger_type: Mapped[str] = mapped_column(String(64))
    equipment_id: Mapped[str] = mapped_column(String(64))
    execution_time_ms: Mapped[float] = mapped_column(Float)
    token_usage: Mapped[dict] = mapped_column(JSON)
    tools_used: Mapped[list] = mapped_column(JSON)
    risk_score: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(32))
    timestamp: Mapped[str] = mapped_column(String(64))

class MaintenanceRepository:
    def __init__(self, db_url: str = None):
        self.db_url = db_url or settings.DATABASE_URL
        self.engine = create_async_engine(self.db_url, echo=False)
        self.async_session = async_sessionmaker(self.engine, expire_on_commit=False)

    async def init_db(self):
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def save_finding(self, finding: MaintenanceFinding) -> MaintenanceFinding:
        async with self.async_session() as session:
            async with session.begin():
                db_item = DBMaintenanceFinding(
                    finding_id=finding.finding_id,
                    equipment_id=finding.equipment_id,
                    asset_name=finding.asset_name,
                    risk_score=finding.risk_score,
                    failure_probability=finding.failure_probability,
                    failure_category=finding.failure_category.value,
                    evidence=[e.model_dump() for e in finding.evidence],
                    historical_pattern=finding.historical_pattern,
                    recommended_action=finding.recommended_action,
                    estimated_priority=finding.estimated_priority.value,
                    confidence=finding.confidence,
                    timestamp=finding.timestamp,
                    status=finding.status.value,
                    finding_metadata=finding.metadata,
                )
                session.add(db_item)
            return finding

    async def get_findings(self, equipment_id: str = None, severity: str = None, limit: int = 50) -> List[Dict[str, Any]]:
        async with self.async_session() as session:
            from sqlalchemy import select
            stmt = select(DBMaintenanceFinding)
            if equipment_id:
                stmt = stmt.where(DBMaintenanceFinding.equipment_id == equipment_id)
            if severity:
                stmt = stmt.where(DBMaintenanceFinding.estimated_priority == severity)
            stmt = stmt.order_by(DBMaintenanceFinding.timestamp.desc()).limit(limit)

            res = await session.execute(stmt)
            rows = res.scalars().all()
            return [
                {
                    "finding_id": r.finding_id,
                    "equipment_id": r.equipment_id,
                    "asset_name": r.asset_name,
                    "risk_score": r.risk_score,
                    "failure_probability": r.failure_probability,
                    "failure_category": r.failure_category,
                    "evidence": r.evidence,
                    "historical_pattern": r.historical_pattern,
                    "recommended_action": r.recommended_action,
                    "estimated_priority": r.estimated_priority,
                    "confidence": r.confidence,
                    "timestamp": r.timestamp,
                    "status": r.status,
                    "metadata": r.finding_metadata,
                }
                for r in rows
            ]

    async def save_telemetry(self, telemetry: MaintenanceScanTelemetry):
        async with self.async_session() as session:
            async with session.begin():
                db_t = DBMaintenanceTelemetry(
                    analysis_id=telemetry.analysis_id,
                    correlation_id=telemetry.correlation_id,
                    trigger_type=telemetry.trigger_type.value,
                    equipment_id=telemetry.equipment_id,
                    execution_time_ms=telemetry.execution_time_ms,
                    token_usage=telemetry.token_usage,
                    tools_used=telemetry.tools_used,
                    risk_score=telemetry.risk_score,
                    status=telemetry.status,
                    timestamp=telemetry.timestamp,
                )
                session.add(db_t)

    async def get_dashboard_summary(self) -> Dict[str, Any]:
        async with self.async_session() as session:
            from sqlalchemy import select, func
            stmt_count = select(func.count(DBMaintenanceFinding.finding_id))
            res_c = await session.execute(stmt_count)
            total = res_c.scalar() or 0

            return {
                "service": settings.PROJECT_NAME,
                "agent_status": "OPERATIONAL",
                "overall_health_index": 88.5,
                "total_findings": total,
                "high_risk_assets_count": 2,
                "upcoming_maintenance_count": 4,
                "risk_distribution": {
                    "critical": 1,
                    "high": 2,
                    "medium": 3,
                    "low": 5,
                },
            }

repository = MaintenanceRepository()
