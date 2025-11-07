from __future__ import annotations
from typing import Any
from uuid import uuid4
from supabase import Client
from app.db.supabase import get_supabase_client
WAITLIST_TABLE = "waitlist"

class WaitlistRepository:
    def __init__(self, client: Client | None = None) -> None:
        self.client = client or get_supabase_client()

    async def insert(self, payload: dict[str, Any]) -> dict[str, Any]:
        payload.setdefault("id", str(uuid4()))
        response = self.client.table(WAITLIST_TABLE).upsert(payload, on_conflict="email").select("*").single().execute()
        return response.data