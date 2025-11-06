from fastapi import APIRouter, HTTPException, Query, status

from app.core.security import CurrentUser
from app.schemas.teaching import (
    TeachingSessionAnswerUpdate,
    TeachingSessionCreate,
    TeachingSessionHistoryItem,
    TeachingSessionRecord,
)
from app.services.teaching import TeachingService

router = APIRouter()
service = TeachingService()


@router.get("/teaching/history", response_model=list[TeachingSessionHistoryItem])
async def get_teaching_history(
    current_user: CurrentUser,
    limit: int = Query(default=5, ge=1, le=50),
) -> list[TeachingSessionHistoryItem]:
    history = await service.fetch_recent_history(current_user, limit)
    return history


@router.get("/teaching", response_model=list[TeachingSessionRecord])
async def list_teaching_sessions(
    current_user: CurrentUser,
    limit: int | None = Query(default=None, ge=1, le=100),
) -> list[TeachingSessionRecord]:
    sessions = await service.list_sessions(current_user, limit)
    return sessions


@router.post("/teaching", response_model=TeachingSessionRecord, status_code=status.HTTP_201_CREATED)
async def record_teaching_session(
    payload: TeachingSessionCreate,
    current_user: CurrentUser,
) -> TeachingSessionRecord:
    record = await service.record_session(current_user, payload)
    return record


@router.post("/teaching/{session_id}/answer", response_model=TeachingSessionRecord)
async def update_teaching_answer(
    session_id: str,
    payload: TeachingSessionAnswerUpdate,
    current_user: CurrentUser,
) -> TeachingSessionRecord:
    record = await service.update_answer(current_user, session_id, payload)
    if record.user_id != current_user.uid:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    return record