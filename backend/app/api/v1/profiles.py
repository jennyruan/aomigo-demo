from fastapi import APIRouter
from app.core.security import CurrentUser
from app.schemas.profiles import ProfileRead, ProfileUpdate
from app.services.profiles import ProfilesService
router = APIRouter()
service = ProfilesService()

@router.get("/me", response_model=ProfileRead)
async def read_current_profile(current_user: CurrentUser) -> ProfileRead:
    return await service.get_or_create_profile(current_user)

@router.patch("/me", response_model=ProfileRead)
async def update_current_profile(current_user: CurrentUser, payload: ProfileUpdate) -> ProfileRead:
    return await service.update_profile(current_user, payload)