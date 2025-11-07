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
        response = self.client.table(REVIEWS_TABLE).insert(payload).execute()
        data = getattr(response, "data", None)
        if isinstance(data, list) and data:
            return data[0]
        if isinstance(data, dict) and data:
            return data

        review_id = payload.get("id")
        if review_id:
            existing = await self.get(review_id)
            if existing:
                return existing

        fallback = (
            self.client.table(REVIEWS_TABLE)
            .select("*")
            .eq("user_id", payload.get("user_id"))
            .eq("topic_id", payload.get("topic_id"))
            .eq("scheduled_date", payload.get("scheduled_date"))
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
        fallback_data = getattr(fallback, "data", None) or []
        if fallback_data:
            return fallback_data[0]

        raise RuntimeError("Review insertion succeeded but record could not be retrieved")

    async def complete(self, review_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        response = (
            self.client.table(REVIEWS_TABLE)
            .update(payload)
            .eq("id", review_id)
            .execute()
        )

        data = getattr(response, "data", None)
        if isinstance(data, list) and data:
            return data[0]
        if isinstance(data, dict) and data:
            return data

        existing = await self.get(review_id)
        if not existing:
            raise RuntimeError("Review update succeeded but record could not be retrieved")
        return existing

    async def get(self, review_id: str) -> dict[str, Any] | None:
        response = (
            self.client.table(REVIEWS_TABLE)
            .select("*")
            .eq("id", review_id)
            .single()
            .execute()
        )
        return response.data