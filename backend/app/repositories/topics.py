from __future__ import annotations
from typing import Any
from supabase import Client
from app.db.supabase import get_supabase_client
TOPICS_TABLE = "topics"

class TopicsRepository:
    def __init__(self, client: Client | None = None) -> None:
        self.client = client or get_supabase_client()

    async def find_by_name(self, user_id: str, topic_name: str) -> dict[str, Any] | None:
        response = (
            self.client.table(TOPICS_TABLE)
            .select("*")
            .eq("user_id", user_id)
            .eq("topic_name", topic_name)
            .maybe_single()
            .execute()
        )
        if not response:
            return None
        return getattr(response, "data", None)

    async def list_for_user(self, user_id: str, limit: int | None = None) -> list[dict[str, Any]]:
        query = self.client.table(TOPICS_TABLE).select("*").eq("user_id", user_id).order("depth", desc=True)
        if limit is not None:
            query = query.limit(limit)
        response = query.execute()
        return response.data or []

    async def get_by_id(self, topic_id: str) -> dict[str, Any] | None:
        response = (
            self.client.table(TOPICS_TABLE)
            .select("*")
            .eq("id", topic_id)
            .maybe_single()
            .execute()
        )
        if not response:
            return None
        return getattr(response, "data", None)

    async def update_topic(self, topic_id: str, updates: dict[str, Any]) -> dict[str, Any]:
        response = (
            self.client.table(TOPICS_TABLE)
            .update(updates)
            .eq("id", topic_id)
            .execute()
        )

        data = getattr(response, "data", None)
        if isinstance(data, list) and data:
            return data[0]
        if isinstance(data, dict) and data:
            return data

        refreshed = await self.get_by_id(topic_id)
        if not refreshed:
            raise RuntimeError("Topic update succeeded but record could not be retrieved")
        return refreshed

    async def create(self, payload: dict[str, Any]) -> dict[str, Any]:
        response = self.client.table(TOPICS_TABLE).insert(payload).execute()
        data = getattr(response, "data", None)
        if isinstance(data, list) and data:
            return data[0]
        if isinstance(data, dict) and data:
            return data

        created = await self.find_by_name(payload["user_id"], payload["topic_name"])
        if not created:
            raise RuntimeError("Topic insertion succeeded but record could not be retrieved")
        return created

    async def touch_last_reviewed(self, topic_id: str, timestamp: str) -> dict[str, Any]:
        response = (
            self.client.table(TOPICS_TABLE)
            .update({"last_reviewed": timestamp})
            .eq("id", topic_id)
            .execute()
        )

        data = getattr(response, "data", None)
        if isinstance(data, list) and data:
            return data[0]
        if isinstance(data, dict) and data:
            return data

        refreshed = await self.get_by_id(topic_id)
        if not refreshed:
            raise RuntimeError("Topic update succeeded but record could not be retrieved")
        return refreshed