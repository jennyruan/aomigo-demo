from __future__ import annotations
from datetime import UTC, datetime, timedelta
from typing import Sequence
from uuid import uuid4
from app.core.security import AuthenticatedUser
from app.repositories.reviews import ReviewsRepository
from app.repositories.teaching_sessions import TeachingSessionsRepository
from app.repositories.topics import TopicsRepository
from app.schemas.teaching import (
    TeachingSessionAnswerUpdate,
    TeachingSessionCreate,
    TeachingSessionHistoryItem,
    TeachingSessionRecord,
)
from app.services.reviews import ReviewsService
from app.services.topics import TopicsService

class TeachingService:
    def __init__(
        self,
        teaching_repository: TeachingSessionsRepository | None = None,
        topics_repository: TopicsRepository | None = None,
        reviews_repository: ReviewsRepository | None = None,
    ) -> None:
        self.teaching_repository = teaching_repository or TeachingSessionsRepository()
        self.topics_service = TopicsService(topics_repository)
        self.reviews_service = ReviewsService(reviews_repository)

    async def fetch_recent_history(self, user: AuthenticatedUser, limit: int) -> list[TeachingSessionHistoryItem]:
        rows = await self.teaching_repository.fetch_recent(user.uid, limit)
        return [TeachingSessionHistoryItem.model_validate(row) for row in rows]

    async def record_session(
        self,
        user: AuthenticatedUser,
        payload: TeachingSessionCreate,
    ) -> TeachingSessionRecord:
        session_id = payload.session_id or f"session-{uuid4()}"
        row = await self.teaching_repository.create(
            {
                "user_id": user.uid,
                "session_id": session_id,
                "input_type": payload.input_type,
                "raw_input": payload.raw_input,
                "extracted_topics": payload.extracted_topics,
                "follow_up_question": payload.follow_up_question,
            }
        )

        await self._ensure_topics_and_reviews(user.uid, payload.extracted_topics)

        return TeachingSessionRecord.model_validate(row)

    async def update_answer(
        self,
        user: AuthenticatedUser,
        session_id: str,
        payload: TeachingSessionAnswerUpdate,
    ) -> TeachingSessionRecord:
        intelligence_gain = payload.quality_score // 10
        health_change = 3 if payload.quality_score > 70 else 1

        row = await self.teaching_repository.update_answer(
            session_id,
            {
                "user_answer": payload.answer,
                "quality_score": payload.quality_score,
                "intelligence_gain": intelligence_gain,
                "health_change": health_change,
            },
        )

        return TeachingSessionRecord.model_validate(row)

    async def _ensure_topics_and_reviews(self, user_id: str, topics: Sequence[str]) -> None:
        if not topics:
            return

        for name in topics:
            topic = await self.topics_service.find_or_create(user_id, name)
            initial_time = datetime.now(UTC) + timedelta(minutes=10)
            await self.reviews_service.schedule_review(
                user_id=user_id,
                topic_id=topic.id,
                scheduled_date=initial_time,
                interval_days=0,
            )

    async def list_sessions(self, user: AuthenticatedUser, limit: int | None = None) -> list[TeachingSessionRecord]:
        rows = await self.teaching_repository.list_for_user(user.uid, limit)
        return [TeachingSessionRecord.model_validate(row) for row in rows]

teaching_service = TeachingService()