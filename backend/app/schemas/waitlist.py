from __future__ import annotations
from pydantic import BaseModel, EmailStr, Field

class WaitlistCreate(BaseModel):
    first_name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    user_type: str = Field(pattern=r"^(demo|investor)$")
    last_name: str | None = None
    phone_number: str | None = None
    linkedin_url: str | None = None
    message: str | None = None
    is_parent_demo_user: bool | None = None

class WaitlistResponse(BaseModel):
    id: str
    first_name: str
    email: EmailStr
    user_type: str