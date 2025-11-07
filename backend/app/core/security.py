from __future__ import annotations
from typing import Annotated
from fastapi import Depends, Header, HTTPException, status
from pydantic import BaseModel

class AuthenticatedUser(BaseModel):
    uid: str
    email: str | None = None

async def get_current_user(
    x_user_id: str | None = Header(default=None, alias="X-User-Id"),
    x_user_email: str | None = Header(default=None, alias="X-User-Email"),
) -> AuthenticatedUser:
    if not x_user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing X-User-Id header")

    return AuthenticatedUser(uid=x_user_id, email=x_user_email)

CurrentUser = Annotated[AuthenticatedUser, Depends(get_current_user)]