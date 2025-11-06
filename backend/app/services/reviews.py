from __future__ import annotations
from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel

from app.repositories.reviews import ReviewsRepository
from app.services.topics import TopicsService

REVIEW_INTERVALS = [0, 1, 3, 7, 14, 30, 60]

class ReviewModel(BaseModel):
    id: str
    user_id: str
    topic_id: str
    scheduled_date: datetime
    interval_days: int
    completed_at: datetime | None = None
    result: str | None = None
    next_review_date: datetime | None = None

def _ensure_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=UTC)
    return dt.astimezone(UTC)


class ReviewsService:
    def __init__(
        self,
        repository: ReviewsRepository | None = None,
        topics_service: TopicsService | None = None,
    ) -> None:
        self.repository = repository or ReviewsRepository()
        self.topics_service = topics_service or TopicsService()

    async def list_open(self, user_id: str) -> list[ReviewModel]:
        rows = await self.repository.fetch_open(user_id)
        return [ReviewModel.model_validate(row) for row in rows]

    async def get(self, review_id: str) -> ReviewModel:
        row = await self.repository.get(review_id)
        if not row:
            raise ReviewNotFoundError(review_id)
        return ReviewModel.model_validate(row)

    async def schedule_review(
        self,
        user_id: str,
        topic_id: str,
        scheduled_date: datetime,
        interval_days: int,
    ) -> ReviewModel:
        payload = {
            "user_id": user_id,
            "topic_id": topic_id,
            "scheduled_date": _ensure_utc(scheduled_date).isoformat(),
            "interval_days": interval_days,
        }
        row = await self.repository.create(payload)
        return ReviewModel.model_validate(row)

    async def complete_review(
        self,
        review_id: str,
        user_id: str,
        result: str,
        next_review_date: datetime,
        next_interval_days: int,
        extras: dict[str, Any] | None = None,
    ) -> ReviewModel:
        current = await self.get(review_id)
        if current.user_id != user_id:
            raise ReviewOwnershipError(review_id, user_id)
        await self.repository.complete(
            review_id,
            {
                "completed_at": datetime.now(UTC).isoformat(),
                "result": result,
                "next_review_date": _ensure_utc(next_review_date).isoformat(),
                **(extras or {}),
            },
        )
        await self.schedule_review(
            user_id=current.user_id,
            topic_id=current.topic_id,
            scheduled_date=_ensure_utc(next_review_date),
            interval_days=next_interval_days,
        )
        await self.topics_service.touch_last_reviewed(current.topic_id)
        return await self.get(review_id)

__all__ = [
    "ReviewsService",
    "ReviewModel",
    "REVIEW_INTERVALS",
    "ReviewNotFoundError",
    "ReviewOwnershipError",
]

class ReviewNotFoundError(Exception):
    def __init__(self, review_id: str) -> None:
        super().__init__(f"Review {review_id} not found")
        self.review_id = review_id

class ReviewOwnershipError(Exception):
    def __init__(self, review_id: str, user_id: str) -> None:
        super().__init__(f"Review {review_id} does not belong to user {user_id}")
        self.review_id = review_id
        self.user_id = user_id