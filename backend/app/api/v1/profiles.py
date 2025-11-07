from fastapi import APIRouter, status
from app.core.security import CurrentUser
from app.schemas.profiles import ProfileCreate, ProfileRead, ProfileUpdate
from app.services.profiles import ProfilesService
router = APIRouter()
service = ProfilesService()

@router.get("/me", response_model=ProfileRead)
async def read_current_profile(current_user: CurrentUser) -> ProfileRead:
    return await service.get_profile(current_user)

@router.post("/me", response_model=ProfileRead, status_code=status.HTTP_201_CREATED)
async def create_current_profile(current_user: CurrentUser, payload: ProfileCreate | None = None) -> ProfileRead:
    return await service.create_profile(current_user, payload)

@router.patch("/me", response_model=ProfileRead)
async def update_current_profile(current_user: CurrentUser, payload: ProfileUpdate) -> ProfileRead:
    return await service.update_profile(current_user, payload)