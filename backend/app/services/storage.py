from __future__ import annotations
from datetime import timedelta
from uuid import uuid4
from app.core.config import settings
from app.db.supabase import get_supabase_client

LOGO_BUCKET = "logo-portal"
DEFAULT_EXPIRY_SECONDS = 60 * 5

def generate_object_path(user_id: str, filename: str) -> str:
    suffix = filename.split(".")[-1]
    return f"{user_id}/{uuid4()}.{suffix}"

def get_presigned_upload_url(user_id: str, filename: str, expires_in: int = DEFAULT_EXPIRY_SECONDS) -> dict[str, str]:
    client = get_supabase_client()
    path = generate_object_path(user_id, filename)
    signed = client.storage().from_(LOGO_BUCKET).create_signed_upload_url(path, expires_in)
    return {"path": path, "url": signed["signedUrl"]}