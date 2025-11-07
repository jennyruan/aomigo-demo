from __future__ import annotations
from app.repositories.waitlist import WaitlistRepository
from app.schemas.waitlist import WaitlistCreate, WaitlistResponse

class WaitlistService:
    def __init__(self, repository: WaitlistRepository | None = None) -> None:
        self.repository = repository or WaitlistRepository()

    async def add_entry(self, payload: WaitlistCreate) -> WaitlistResponse:
        row = await self.repository.insert(payload.model_dump(exclude_none=True))
        return WaitlistResponse.model_validate(row)