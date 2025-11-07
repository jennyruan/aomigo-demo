from __future__ import annotations
from typing import Any
from uuid import uuid4
from supabase import Client
from app.db.supabase import get_supabase_client
SUBMISSION_TABLE = "design_submissions"
ASSET_TABLE = "design_assets"

class SubmissionsRepository:
    def __init__(self, client: Client | None = None) -> None:
        self.client = client or get_supabase_client()

    async def list_for_user(self, user_id: str) -> list[dict[str, Any]]:
        response = (
            self.client.table(SUBMISSION_TABLE)
            .select("*, design_assets(*)")
            .eq("user_id", user_id)
            .order("updated_at", desc=True)
            .execute()
        )
        return response.data or []

    async def create(self, user_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        submission_id = payload.setdefault("id", str(uuid4()))
        payload["user_id"] = user_id
        response = self.client.table(SUBMISSION_TABLE).insert(payload).select("*").single().execute()
        return response.data

    async def update(self, user_id: str, submission_id: str, updates: dict[str, Any]) -> dict[str, Any]:
        response = (
            self.client.table(SUBMISSION_TABLE)
            .update(updates)
            .eq("user_id", user_id)
            .eq("id", submission_id)
            .select("*")
            .single()
            .execute()
        )
        return response.data