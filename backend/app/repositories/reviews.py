from __future__ import annotations
from typing import Any
from supabase import Client
from app.db.supabase import get_supabase_client
REVIEWS_TABLE = "reviews"

class ReviewsRepository:
    def __init__(self, client: Client | None = None) -> None:
        self.client = client or get_supabase_client()

    async def fetch_open(self, user_id: str) -> list[dict[str, Any]]:
        response = (
            self.client.table(REVIEWS_TABLE)
            .select("*")
            .eq("user_id", user_id)
            .is_("completed_at", None)
            .order("scheduled_date", desc=False)
            .execute()
        )
        return response.data or []

    async def create(self, payload: dict[str, Any]) -> dict[str, Any]:
        response = self.client.table(REVIEWS_TABLE).insert(payload).select("*").single().execute()
        return response.data

    async def complete(self, review_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        response = (
            self.client.table(REVIEWS_TABLE)
            .update(payload)
            .eq("id", review_id)
            .select("*")
            .single()
            .execute()
        )
        return response.data

    async def get(self, review_id: str) -> dict[str, Any] | None:
        response = (
            self.client.table(REVIEWS_TABLE)
            .select("*")
            .eq("id", review_id)
            .single()
            .execute()
        )
        return response.data