from __future__ import annotations
from typing import Any
from supabase import Client
from app.db.supabase import get_supabase_client
PROFILE_TABLE = "profiles"

class ProfilesRepository:
    def __init__(self, client: Client | None = None) -> None:
        self.client = client or get_supabase_client()

    async def get_by_id(self, user_id: str) -> dict[str, Any] | None:
        response = self.client.table(PROFILE_TABLE).select("*").eq("id", user_id).single().execute()
        return response.data if response.data else None

    async def create_default(self, user_id: str, email: str | None) -> dict[str, Any]:
        payload = {
            "id": user_id,
            "pet_name": "AOMIGO",
            "intelligence": 0,
            "health": 100,
            "level": 1,
            "day_streak": 0,
            "last_activity_date": None,
            "language_preference": "en",
            "email": email,
        }
        response = self.client.table(PROFILE_TABLE).upsert(payload, on_conflict="id").execute()
        return response.data[0]

    async def update(self, user_id: str, updates: dict[str, Any]) -> dict[str, Any]:
        response = (
            self.client.table(PROFILE_TABLE)
            .update(updates)
            .eq("id", user_id)
            .select("*")
            .single()
            .execute()
        )
        return response.data