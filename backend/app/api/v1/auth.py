from fastapi import APIRouter
from app.core.security import CurrentUser
from app.schemas.auth import SessionResponse

router = APIRouter()

@router.get("/session", response_model=SessionResponse)
async def read_session(current_user: CurrentUser) -> SessionResponse:
    return SessionResponse(uid=current_user.uid, email=current_user.email)