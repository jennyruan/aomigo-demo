from __future__ import annotations
from typing import Any
from app.core.security import AuthenticatedUser
from app.repositories.profiles import ProfilesRepository
from app.schemas.profiles import ProfileRead, ProfileUpdate

class ProfilesService:
    def __init__(self, repository: ProfilesRepository | None = None) -> None:
        self.repository = repository or ProfilesRepository()

    async def get_or_create_profile(self, user: AuthenticatedUser) -> ProfileRead:
        profile = await self.repository.get_by_id(user.uid)
        if not profile:
            profile = await self.repository.create_default(user.uid, user.email)
        return ProfileRead.model_validate(profile)

    async def update_profile(self, user: AuthenticatedUser, payload: ProfileUpdate) -> ProfileRead:
        updated = await self.repository.update(user.uid, payload.model_dump(exclude_unset=True))
        return ProfileRead.model_validate(updated)