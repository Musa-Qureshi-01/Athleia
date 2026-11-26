import uuid
import logging
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Query
from sqlalchemy import select, desc

from shared.auth.db import (
    DBDemoRequest,
    DBCareerApplication,
    DBContactInquiry,
    DBEvolutionAccount,
    async_session_factory,
)
from shared.auth.models import (
    DemoRequestCreate,
    CareerApplicationCreate,
    ContactInquiryCreate,
    FormSubmitResponse,
)

logger = logging.getLogger("auth.forms")

forms_router = APIRouter(prefix="/api/v1/forms", tags=["Website Public Forms & Inquiries"])


# ── 1. DEMO REQUEST FORM SUBMISSION ──────────────────────────────────────────
@forms_router.post("/demo", response_model=FormSubmitResponse, summary="Submit Enterprise Demo Request")
async def submit_demo_request(req: DemoRequestCreate):
    """Saves enterprise demo request into isolated demo_requests table.
    STRICT ISOLATION: Unconnected to core authentication or organizational users.
    """
    sub_id = f"demo_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()

    try:
        async with async_session_factory() as session:
            record = DBDemoRequest(
                id=sub_id,
                first_name=req.firstName.strip(),
                last_name=req.lastName.strip(),
                email=str(req.email).lower().strip(),
                company=req.company.strip(),
                company_size=req.companySize,
                phone=req.phone,
                country=req.country or "United States",
                sparked_interest=req.sparkedInterest,
                status="NEW",
                created_at=now,
            )
            session.add(record)
            await session.commit()

        logger.info(f"Demo request saved: id={sub_id}, company={req.company}, email={req.email}")
        return FormSubmitResponse(
            success=True,
            message="Demo request recorded successfully. Our enterprise engineering team will contact you.",
            submission_id=sub_id,
        )
    except Exception as e:
        logger.error(f"Error persisting demo request: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to record demo request.",
        )


# ── 2. CAREER APPLICATION SUBMISSION ─────────────────────────────────────────
@forms_router.post("/career", response_model=FormSubmitResponse, summary="Submit Career Application")
async def submit_career_application(req: CareerApplicationCreate):
    """Saves candidate job application into isolated career_applications table.
    STRICT ISOLATION: Unconnected to core authentication or organizational users.
    """
    sub_id = f"app_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()

    try:
        async with async_session_factory() as session:
            record = DBCareerApplication(
                id=sub_id,
                name=req.name.strip(),
                email=str(req.email).lower().strip(),
                phone=req.phone,
                linkedin=req.linkedin,
                department=req.department,
                portfolio=req.portfolioOrGithub,
                desired_role=req.desiredRole,
                cv_file_name=req.cvFileName or "Resume Attached",
                message=req.messageToAxiosTeam,
                status="PENDING_REVIEW",
                created_at=now,
            )
            session.add(record)
            await session.commit()

        logger.info(f"Career application saved: id={sub_id}, name={req.name}, role={req.desiredRole}")
        return FormSubmitResponse(
            success=True,
            message="Career application received. Thank you for your interest in joining Axios.",
            submission_id=sub_id,
        )
    except Exception as e:
        logger.error(f"Error persisting career application: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to record career application.",
        )


# ── 3. CONTACT INQUIRY SUBMISSION ────────────────────────────────────────────
@forms_router.post("/contact", response_model=FormSubmitResponse, summary="Submit Contact Inquiry")
async def submit_contact_inquiry(req: ContactInquiryCreate):
    """Saves enterprise inquiries into isolated contact_inquiries table.
    STRICT ISOLATION: Unconnected to core authentication or organizational users.
    """
    sub_id = f"inq_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()

    try:
        async with async_session_factory() as session:
            record = DBContactInquiry(
                id=sub_id,
                name=req.name.strip(),
                email=str(req.email).lower().strip(),
                company=req.company,
                phone=req.phone,
                industry=req.industry,
                company_size=req.company_size,
                message=req.message.strip(),
                status="NEW",
                created_at=now,
            )
            session.add(record)
            await session.commit()

        logger.info(f"Contact inquiry saved: id={sub_id}, email={req.email}")
        return FormSubmitResponse(
            success=True,
            message="Contact inquiry received. Our support team will respond shortly.",
            submission_id=sub_id,
        )
    except Exception as e:
        logger.error(f"Error persisting contact inquiry: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to record contact inquiry.",
        )


# ── 4. READ-ONLY AUDIT & TELEMETRY LISTING (FOR KNOWING WHO IS USING) ────────

@forms_router.get("/evaluations", summary="List Evaluation Account Registrations")
async def list_evaluation_accounts(limit: int = Query(50, ge=1, le=200)):
    """Retrieve who is currently evaluating Axios across the Evolution demo sandbox."""
    try:
        async with async_session_factory() as session:
            stmt = select(DBEvolutionAccount).order_by(desc(DBEvolutionAccount.created_at)).limit(limit)
            result = await session.execute(stmt)
            accounts = result.scalars().all()
            return [
                {
                    "session_id": a.session_id,
                    "demo_email": a.demo_email,
                    "full_name": a.full_name,
                    "phone_number": a.phone_number,
                    "demo_organization": a.demo_organization,
                    "evaluation_purpose": a.evaluation_purpose,
                    "queries_used": a.queries_used,
                    "queries_limit": a.queries_limit,
                    "is_active": a.is_active,
                    "created_at": a.created_at,
                    "expires_at": a.expires_at,
                }
                for a in accounts
            ]
    except Exception as e:
        logger.error(f"Error listing evaluation accounts: {e}")
        return []


@forms_router.get("/demo", summary="List Demo Requests")
async def list_demo_requests(limit: int = Query(50, ge=1, le=200)):
    try:
        async with async_session_factory() as session:
            stmt = select(DBDemoRequest).order_by(desc(DBDemoRequest.created_at)).limit(limit)
            result = await session.execute(stmt)
            rows = result.scalars().all()
            return [
                {
                    "id": r.id,
                    "first_name": r.first_name,
                    "last_name": r.last_name,
                    "email": r.email,
                    "company": r.company,
                    "company_size": r.company_size,
                    "phone": r.phone,
                    "country": r.country,
                    "sparked_interest": r.sparked_interest,
                    "status": r.status,
                    "created_at": r.created_at,
                }
                for r in rows
            ]
    except Exception as e:
        logger.error(f"Error listing demo requests: {e}")
        return []
