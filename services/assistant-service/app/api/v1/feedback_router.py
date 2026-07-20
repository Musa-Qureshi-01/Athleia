from fastapi import APIRouter, Depends
from app.core.security import parse_user_token, UserIdentity
from app.schemas.feedback import FeedbackCreate, FeedbackResponse
from app.repositories.assistant_repository import repository

router = APIRouter(prefix="/feedback", tags=["User Feedback"])

@router.post("", response_model=FeedbackResponse, summary="Submit Message Rating & Feedback")
async def submit_feedback(
    req: FeedbackCreate,
    user: UserIdentity = Depends(parse_user_token)
):
    fid = await repository.save_feedback(
        user_id=user.user_id,
        message_id=req.message_id,
        rating=req.rating,
        comment=req.comment
    )
    return FeedbackResponse(status="success", feedback_id=fid, message_id=req.message_id)
