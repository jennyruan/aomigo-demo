from __future__ import annotations
from typing import Any
from uuid import UUID
from supabase import Client
from app.db.supabase import get_supabase_client
ACCOUNTS_TABLE = "accounts"

class AccountsRepository:
    def __init__(self, client: Client | None = None) -> None:
        self.client = client or get_supabase_client()

    async def get_by_id(self, account_id: str | UUID) -> dict[str, Any] | None:
        response = (
            self.client.table(ACCOUNTS_TABLE)
            .select("id, email, password_hash")
            .eq("id", str(account_id))
            .single()
            .execute()
        )
        return response.data if response.data else None

    async def get_by_email(self, email: str) -> dict[str, Any] | None:
        response = (
            self.client.table(ACCOUNTS_TABLE)
            .select("id, email, password_hash")
            .eq("email", email.lower())
            .single()
            .execute()
        )
        return response.data if response.data else None

    async def create(self, email: str, password_hash: str) -> dict[str, Any]:
        payload = {"email": email.lower(), "password_hash": password_hash}
        response = (
            self.client.table(ACCOUNTS_TABLE)
            .insert(payload)
            .select("id, email, password_hash")
            .single()
            .execute()
        )
        if not response.data:
            raise RuntimeError("Failed to create account")
        return response.data

def get_accounts_repository() -> AccountsRepository:
    return AccountsRepository()