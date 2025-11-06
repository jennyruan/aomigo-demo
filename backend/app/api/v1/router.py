from fastapi import APIRouter
from . import auth, profiles, reviews, sessions, storage, submissions, topics, waitlist

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(submissions.router, prefix="/submissions", tags=["submissions"])
api_router.include_router(storage.router, prefix="/storage", tags=["storage"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
api_router.include_router(topics.router, prefix="/topics", tags=["topics"])
api_router.include_router(waitlist.router, prefix="/waitlist", tags=["waitlist"])
