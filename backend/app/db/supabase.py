from typing import Any
from supabase import Client, create_client
from app.core.config import settings
_supabase_client: Client | None = None

def get_supabase_client() -> Client:
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = create_client(settings.supabase_url, settings.supabase_service_role)
    return _supabase_client

def table(table_name: str):
    client = get_supabase_client()
    return client.table(table_name)

def storage(bucket_name: str):
    client = get_supabase_client()
    return client.storage().from_(bucket_name)