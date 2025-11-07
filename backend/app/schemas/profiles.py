from __future__ import annotations
from datetime import date, datetime
from pydantic import BaseModel, Field

class ProfileBase(BaseModel):
    pet_name: str | None = Field(default=None)
    intelligence: int | None = Field(default=None)
    health: int | None = Field(default=None)
    level: int | None = Field(default=None)
    day_streak: int | None = Field(default=None)
    last_activity_date: date | None = Field(default=None)
    language_preference: str | None = Field(default=None)

class ProfileRead(ProfileBase):
    id: str
    email: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

class ProfileUpdate(ProfileBase):
    pass

class ProfileCreate(ProfileBase):
    pass