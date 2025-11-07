from __future__ import annotations
from typing import Any
from fastapi import HTTPException, status

from app.core.security import AuthenticatedUser
from app.repositories.profiles import ProfilesRepository
from app.schemas.profiles import ProfileCreate, ProfileRead, ProfileUpdate


class ProfilesService:
    def __init__(self, repository: ProfilesRepository | None = None) -> None:
        self.repository = repository or ProfilesRepository()

    async def get_profile(self, user: AuthenticatedUser) -> ProfileRead:
        profile = await self.repository.get_by_id(user.uid)
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
        enriched = {**profile}
        if user.email is not None:
            enriched.setdefault("email", user.email)
        return ProfileRead.model_validate(enriched)

    async def create_profile(self, user: AuthenticatedUser, payload: ProfileCreate | None = None) -> ProfileRead:
        existing = await self.repository.get_by_id(user.uid)
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Profile already exists")

        attributes: dict[str, Any] = {}
        if payload is not None:
            attributes = payload.model_dump(exclude_unset=True)

        created = await self.repository.create(user.uid, attributes)
        enriched = {**created}
        if user.email is not None:
            enriched.setdefault("email", user.email)
        return ProfileRead.model_validate(enriched)

    async def update_profile(self, user: AuthenticatedUser, payload: ProfileUpdate) -> ProfileRead:
        existing = await self.repository.get_by_id(user.uid)
        if not existing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

        updated = await self.repository.update(user.uid, payload.model_dump(exclude_unset=True))
        enriched = {**updated}
        if user.email is not None:
            enriched.setdefault("email", user.email)
        return ProfileRead.model_validate(enriched)