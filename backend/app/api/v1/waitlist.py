from fastapi import APIRouter, HTTPException, status
from app.schemas.waitlist import WaitlistCreate, WaitlistResponse
from app.services.waitlist import WaitlistService

router = APIRouter()
service = WaitlistService()

@router.post("/", response_model=WaitlistResponse, status_code=status.HTTP_201_CREATED)
async def join_waitlist(payload: WaitlistCreate) -> WaitlistResponse:
    try:
        return await service.add_entry(payload)
    except Exception as exc: 
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc