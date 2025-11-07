from fastapi import APIRouter, status
from app.schemas.auth import SessionResponse
from app.core.security import CurrentUser

router = APIRouter()


@router.get("/session", response_model=SessionResponse)
async def read_session(current_user: CurrentUser) -> SessionResponse:
    return SessionResponse(uid=current_user.uid, email=current_user.email)


@router.post("/signout", status_code=status.HTTP_204_NO_CONTENT)
async def signout() -> None:
    # The frontend manages Firebase auth state directly; nothing to clear on the server.
    return None