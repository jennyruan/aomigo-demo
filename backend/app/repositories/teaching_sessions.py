from __future__ import annotations
from typing import Any
from supabase import Client
from app.db.supabase import get_supabase_client
TEACHING_TABLE = "teaching_sessions"

class TeachingSessionsRepository:
    def __init__(self, client: Client | None = None) -> None:
        self.client = client or get_supabase_client()

    async def get_by_session_id(self, session_id: str) -> dict[str, Any] | None:
        response = (
            self.client.table(TEACHING_TABLE)
            .select("*")
            .eq("session_id", session_id)
            .limit(1)
            .execute()
        )
        data = getattr(response, "data", None) or []
        return data[0] if data else None

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
        response = self.client.table(TEACHING_TABLE).insert(payload).execute()
        data = getattr(response, "data", None)
        if isinstance(data, list) and data:
            return data[0]
        if isinstance(data, dict) and data:
            return data

        created = await self.get_by_session_id(payload.get("session_id"))
        if not created:
            raise RuntimeError("Teaching session insertion succeeded but record could not be retrieved")
        return created

    async def update_answer(self, session_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        response = (
            self.client.table(TEACHING_TABLE)
            .update(payload)
            .eq("session_id", session_id)
            .execute()
        )

        data = getattr(response, "data", None)
        if isinstance(data, list) and data:
            return data[0]
        if isinstance(data, dict) and data:
            return data

        updated = await self.get_by_session_id(session_id)
        if not updated:
            raise RuntimeError("Teaching session update succeeded but record could not be retrieved")
        return updated