from __future__ import annotations
from typing import Literal
from pydantic import BaseModel, Field

class TeachingSessionHistoryItem(BaseModel):
    raw_input: str
    extracted_topics: list[str]

class TeachingSessionCreate(BaseModel):
    session_id: str | None = None
    input_type: Literal["text", "voice", "image"]
    raw_input: str
    extracted_topics: list[str] = Field(default_factory=list)
    follow_up_question: str

class TeachingSessionRecord(BaseModel):
    id: str
    user_id: str
    session_id: str
    input_type: str
    raw_input: str
    extracted_topics: list[str]
    follow_up_question: str | None = None
    user_answer: str | None = None
    quality_score: int | None = None
    created_at: str | None = None

class TeachingSessionAnswerUpdate(BaseModel):
    answer: str
    quality_score: int