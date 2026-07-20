from typing import List, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from app.domain.enums import RiskSeverity, FailureCategory

class PatternEvaluationResult(BaseModel):
    equipment_id: str
    asset_name: str
    risk_score: float
    failure_probability: float
    detected_patterns: List[str]
    failure_category: FailureCategory
    recommended_priority: RiskSeverity

class DeterministicPatternEngine:
    """
    Evaluates equipment maintenance records deterministically in 0ms 
    without consuming LLM tokens. Calculates risk score metrics.
    """

    def evaluate(
        self,
        equipment_id: str,
        asset_name: str,
        maintenance_records: List[Dict[str, Any]],
        incident_logs: List[Dict[str, Any]],
        last_maintenance_date_str: str = None,
        recommended_interval_days: int = 90
    ) -> PatternEvaluationResult:
        patterns: List[str] = []
        base_score = 10.0

        # 1. Evaluate Repeated Failures
        failure_records = [
            r for r in maintenance_records 
            if r.get("event_type") == "UNPLANNED_OUTAGE" or "failure" in r.get("description", "").lower()
        ]
        num_failures = len(failure_records)

        if num_failures >= 3:
            patterns.append(f"High Failure Recurrence: {num_failures} unplanned outages recorded in recent operating history.")
            base_score += 45.0
        elif num_failures >= 1:
            patterns.append(f"Recent Failure Record: {num_failures} unplanned outage detected.")
            base_score += 25.0

        # 2. Evaluate Incident Intensity
        num_incidents = len(incident_logs)
        if num_incidents >= 2:
            patterns.append(f"Critical Incident Clustering: {num_incidents} safety/operational incidents linked to asset.")
            base_score += 25.0

        # 3. Evaluate Missed Maintenance Window
        days_since_maint = 120
        if last_maintenance_date_str:
            try:
                m_date = datetime.fromisoformat(last_maintenance_date_str.replace("Z", ""))
                days_since_maint = (datetime.utcnow() - m_date).days
            except Exception:
                pass

        if days_since_maint > recommended_interval_days:
            overdue_days = days_since_maint - recommended_interval_days
            patterns.append(f"Overdue Maintenance Window: Asset is {overdue_days} days past mandatory inspection schedule.")
            base_score += min(30.0, overdue_days * 0.5)

        # Cap Risk Score at 99.0
        final_risk_score = round(min(99.0, max(5.0, base_score)), 1)
        failure_prob = round(min(0.98, final_risk_score / 100.0), 2)

        # Determine Category & Priority
        if final_risk_score >= 80.0:
            priority = RiskSeverity.CRITICAL
            category = FailureCategory.MECHANICAL_DEGRADATION
        elif final_risk_score >= 60.0:
            priority = RiskSeverity.HIGH
            category = FailureCategory.MISSED_PREVENTIVE_WINDOW
        elif final_risk_score >= 40.0:
            priority = RiskSeverity.MEDIUM
            category = FailureCategory.OPERATIONAL_ANOMALY
        else:
            priority = RiskSeverity.LOW
            category = FailureCategory.OPERATIONAL_ANOMALY

        if not patterns:
            patterns.append("Normal Operating Rhythm: No critical failure anomalies detected in current log window.")

        return PatternEvaluationResult(
            equipment_id=equipment_id,
            asset_name=asset_name,
            risk_score=final_risk_score,
            failure_probability=failure_prob,
            detected_patterns=patterns,
            failure_category=category,
            recommended_priority=priority
        )
