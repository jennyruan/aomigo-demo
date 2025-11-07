from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class TopicResponse(BaseModel):
    id: str
    user_id: str
    topic_name: str
    depth: int | None = Field(default=None)
    last_reviewed: datetime | None = Field(default=None)
    created_at: datetime | None = Field(default=None)
    updated_at: datetime | None = Field(default=None)


__all__ = ["TopicResponse"]
