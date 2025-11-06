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
        return response.data

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
        return response.data

    async def update_topic(self, topic_id: str, updates: dict[str, Any]) -> dict[str, Any]:
        response = (
            self.client.table(TOPICS_TABLE)
            .update(updates)
            .eq("id", topic_id)
            .select("*")
            .single()
            .execute()
        )
        return response.data

    async def create(self, payload: dict[str, Any]) -> dict[str, Any]:
        response = self.client.table(TOPICS_TABLE).insert(payload).select("*").single().execute()
        return response.data

    async def touch_last_reviewed(self, topic_id: str, timestamp: str) -> dict[str, Any]:
        response = (
            self.client.table(TOPICS_TABLE)
            .update({"last_reviewed": timestamp})
            .eq("id", topic_id)
            .select("*")
            .single()
            .execute()
        )
        return response.data