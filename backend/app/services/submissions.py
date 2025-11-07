from __future__ import annotations
from app.core.security import AuthenticatedUser
from app.repositories.submissions import SubmissionsRepository
from app.schemas.submissions import SubmissionCreate, SubmissionRead, SubmissionUpdate

class SubmissionsService:
    def __init__(self, repository: SubmissionsRepository | None = None) -> None:
        self.repository = repository or SubmissionsRepository()

    async def list_submissions(self, user: AuthenticatedUser) -> list[SubmissionRead]:
        rows = await self.repository.list_for_user(user.uid)
        return [SubmissionRead.model_validate(row) for row in rows]

    async def create_submission(self, user: AuthenticatedUser, payload: SubmissionCreate) -> SubmissionRead:
        row = await self.repository.create(user.uid, payload.model_dump(exclude_unset=True))
        return SubmissionRead.model_validate(row)

    async def update_submission(
        self, user: AuthenticatedUser, submission_id: str, payload: SubmissionUpdate
    ) -> SubmissionRead:
        row = await self.repository.update(user.uid, submission_id, payload.model_dump(exclude_unset=True))
        return SubmissionRead.model_validate(row)