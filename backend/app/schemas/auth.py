from __future__ import annotations
from pydantic import BaseModel

class SessionResponse(BaseModel):
    uid: str
    email: str | None = None