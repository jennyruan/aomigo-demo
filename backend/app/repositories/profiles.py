from __future__ import annotations
from typing import Any

from postgrest import APIError
from supabase import Client

from app.db.supabase import get_supabase_client

PROFILE_TABLE = "users_profile"

class ProfilesRepository:
    def __init__(self, client: Client | None = None) -> None:
        self.client = client or get_supabase_client()

    async def get_by_id(self, user_id: str) -> dict[str, Any] | None:
        response = (
            self.client.table(PROFILE_TABLE)
            .select("*")
            .eq("id", user_id)
            .limit(1)
            .execute()
        )

        data = getattr(response, "data", None) or []
        return data[0] if data else None

    async def create(self, user_id: str, attributes: dict[str, Any]) -> dict[str, Any]:
        payload: dict[str, Any] = {"id": user_id, **attributes}

        try:
            response = self.client.table(PROFILE_TABLE).insert(payload).execute()
        except APIError as exc:
            if getattr(exc, "code", None) == "23505":
                raise
            raise

        data = getattr(response, "data", None)
        if data and len(data) > 0:
            return data[0]

        # Some Supabase Python client versions return no data; fetch freshly.
        created = await self.get_by_id(user_id)
        if not created:
            raise RuntimeError("Profile insertion succeeded but record could not be retrieved")
        return created

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