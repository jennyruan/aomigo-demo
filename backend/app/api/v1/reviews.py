from fastapi import APIRouter, HTTPException, status

from app.core.security import CurrentUser
from app.schemas.reviews import CompleteReviewRequest, ReviewResponse, ScheduleReviewRequest
from app.services.reviews import (
    REVIEW_INTERVALS,
    ReviewNotFoundError,
    ReviewOwnershipError,
    ReviewsService,
)

router = APIRouter()
service = ReviewsService()


@router.get("/open", response_model=list[ReviewResponse])
async def list_open_reviews(current_user: CurrentUser) -> list[ReviewResponse]:
    reviews = await service.list_open(current_user.uid)
    return [ReviewResponse.model_validate(review.model_dump()) for review in reviews]


@router.post("/{review_id}/complete", response_model=ReviewResponse)
async def complete_review(
    review_id: str,
    payload: CompleteReviewRequest,
    current_user: CurrentUser,
) -> ReviewResponse:
    try:
        review = await service.complete_review(
            review_id=review_id,
            user_id=current_user.uid,
            result=payload.result,
            next_review_date=payload.next_review_date,
            next_interval_days=payload.next_interval_days,
        )
        return ReviewResponse.model_validate(review.model_dump())
    except ReviewNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except ReviewOwnershipError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc


@router.post("/schedule", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def schedule_review(
    payload: ScheduleReviewRequest,
    current_user: CurrentUser,
) -> ReviewResponse:
    review = await service.schedule_review(
        user_id=current_user.uid,
        topic_id=payload.topic_id,
        scheduled_date=payload.scheduled_date,
        interval_days=payload.interval_days,
    )
    return ReviewResponse.model_validate(review.model_dump())


@router.get("/intervals", response_model=list[int])
async def list_review_intervals() -> list[int]:
    return REVIEW_INTERVALS