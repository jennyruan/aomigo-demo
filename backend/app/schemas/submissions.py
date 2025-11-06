from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel, Field

class SubmissionAsset(BaseModel):
    id: str
    storage_path: str
    mime_type: str
    size_bytes: int
    created_at: datetime

class SubmissionRead(BaseModel):
    id: str
    user_id: str
    title: str | None = None
    description: str | None = None
    status: str = Field(default="draft")
    submitted_at: datetime | None = None
    updated_at: datetime | None = None
    assets: list[SubmissionAsset] = Field(default_factory=list)

class SubmissionCreate(BaseModel):
    title: str | None = None
    description: str | None = None

class SubmissionUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None