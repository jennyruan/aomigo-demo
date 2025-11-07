from fastapi import APIRouter
from app.core.security import CurrentUser
from app.services.storage import get_presigned_upload_url

router = APIRouter()

@router.post("/upload-url")
async def request_upload_url(current_user: CurrentUser, filename: str) -> dict[str, str]:
    return get_presigned_upload_url(current_user.uid, filename)