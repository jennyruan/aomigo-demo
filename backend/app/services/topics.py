from __future__ import annotations
from datetime import UTC, datetime
from pydantic import BaseModel
from app.repositories.topics import TopicsRepository

class TopicModel(BaseModel):
    id: str
    user_id: str
    topic_name: str
    depth: int | None = None
    last_reviewed: str | None = None

class TopicsService:
    def __init__(self, repository: TopicsRepository | None = None) -> None:
        self.repository = repository or TopicsRepository()

    async def find_or_create(self, user_id: str, topic_name: str) -> TopicModel:
        existing = await self.repository.find_by_name(user_id, topic_name)
        timestamp = datetime.now(UTC).isoformat()
        if existing:
            updated = await self.repository.update_topic(existing["id"], {
                "depth": (existing.get("depth") or 0) + 1,
                "last_reviewed": timestamp,
            })
            return TopicModel.model_validate(updated)

        created = await self.repository.create(
            {
                "user_id": user_id,
                "topic_name": topic_name,
                "depth": 1,
                "last_reviewed": timestamp,
            }
        )
        return TopicModel.model_validate(created)

    async def touch_last_reviewed(self, topic_id: str) -> TopicModel:
        timestamp = datetime.now(UTC).isoformat()
        updated = await self.repository.touch_last_reviewed(topic_id, timestamp)
        return TopicModel.model_validate(updated)

    async def list_for_user(self, user_id: str, limit: int | None = None) -> list[TopicModel]:
        rows = await self.repository.list_for_user(user_id, limit)
        return [TopicModel.model_validate(row) for row in rows]

    async def get_topic(self, topic_id: str) -> TopicModel:
        row = await self.repository.get_by_id(topic_id)
        if not row:
            raise TopicNotFoundError(topic_id)
        return TopicModel.model_validate(row)

__all__ = ["TopicsService", "TopicModel", "TopicNotFoundError"]


class TopicNotFoundError(Exception):
    def __init__(self, topic_id: str) -> None:
        super().__init__(f"Topic {topic_id} not found")
        self.topic_id = topic_id