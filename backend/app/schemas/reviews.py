from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel, Field

class ReviewResponse(BaseModel):
    id: str
    user_id: str
    topic_id: str
    scheduled_date: datetime
    interval_days: int
    completed_at: datetime | None = None
    result: str | None = None
    next_review_date: datetime | None = None

class CompleteReviewRequest(BaseModel):
    result: str = Field(..., description="Outcome label for the review attempt")
    next_review_date: datetime = Field(..., description="When the next review should be scheduled")
    next_interval_days: int = Field(..., gt=0, description="Spacing interval in days until the next review")

class ScheduleReviewRequest(BaseModel):
    topic_id: str = Field(..., description="Identifier of the topic being reviewed")
    scheduled_date: datetime = Field(..., description="When the review should be attempted")
    interval_days: int = Field(..., gt=0, description="Spacing interval in days until this review")

__all__ = ["ReviewResponse", "CompleteReviewRequest", "ScheduleReviewRequest"]