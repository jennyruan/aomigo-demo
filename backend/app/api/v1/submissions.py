from fastapi import APIRouter
from app.core.security import CurrentUser
from app.schemas.submissions import SubmissionCreate, SubmissionRead, SubmissionUpdate
from app.services.submissions import SubmissionsService

router = APIRouter()
service = SubmissionsService()

@router.get("/", response_model=list[SubmissionRead])
async def list_my_submissions(current_user: CurrentUser) -> list[SubmissionRead]:
    return await service.list_submissions(current_user)

@router.post("/", response_model=SubmissionRead, status_code=201)
async def create_submission(current_user: CurrentUser, payload: SubmissionCreate) -> SubmissionRead:
    return await service.create_submission(current_user, payload)

@router.patch("/{submission_id}", response_model=SubmissionRead)
async def update_submission(
    submission_id: str,
    payload: SubmissionUpdate,
    current_user: CurrentUser,
) -> SubmissionRead:
    return await service.update_submission(current_user, submission_id, payload)