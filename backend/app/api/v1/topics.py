from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.security import CurrentUser
from app.schemas.topics import TopicResponse
from app.services.topics import TopicNotFoundError, TopicsService

router = APIRouter()
service = TopicsService()


@router.get("/", response_model=list[TopicResponse])
async def list_topics(
    current_user: CurrentUser,
    limit: int | None = Query(default=None, ge=1, le=100),
) -> list[TopicResponse]:
    topics = await service.list_for_user(current_user.uid, limit)
    return [TopicResponse.model_validate(topic.model_dump()) for topic in topics]


@router.get("/{topic_id}", response_model=TopicResponse)
async def get_topic(topic_id: str, current_user: CurrentUser) -> TopicResponse:
    try:
        topic = await service.get_topic(topic_id)
    except TopicNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    if topic.user_id != current_user.uid:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")

    return TopicResponse.model_validate(topic.model_dump())
