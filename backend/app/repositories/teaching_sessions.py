from __future__ import annotations
from typing import Any
from supabase import Client
from app.db.supabase import get_supabase_client
TEACHING_TABLE = "teaching_sessions"

class TeachingSessionsRepository:
    def __init__(self, client: Client | None = None) -> None:
        self.client = client or get_supabase_client()

    async def fetch_recent(self, user_id: str, limit: int = 5) -> list[dict[str, Any]]:
        response = (
            self.client.table(TEACHING_TABLE)
            .select("raw_input, extracted_topics")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return response.data or []

    async def list_for_user(self, user_id: str, limit: int | None = None) -> list[dict[str, Any]]:
        query = (
            self.client.table(TEACHING_TABLE)
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
        )
        if limit is not None:
            query = query.limit(limit)
        response = query.execute()
        return response.data or []

    async def create(self, payload: dict[str, Any]) -> dict[str, Any]:
        response = self.client.table(TEACHING_TABLE).insert(payload).select("*").single().execute()
        return response.data

    async def update_answer(self, session_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        response = (
            self.client.table(TEACHING_TABLE)
            .update(payload)
            .eq("session_id", session_id)
            .select("*")
            .single()
            .execute()
        )
        return response.data