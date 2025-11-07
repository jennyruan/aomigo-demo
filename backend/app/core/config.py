from functools import lru_cache
from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")
    env: str = Field(default="development", validation_alias="ENV")
    revision: str = Field(default="local", validation_alias="GIT_REVISION")
    supabase_url: str = 'https://cyvdlvnwwvlmnafifwae.supabase.co'
    supabase_service_role: str = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5dmRsdm53d3ZsbW5hZmlmd2FlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQzNTE1OSwiZXhwIjoyMDc4MDExMTU5fQ.gvwyPfJdmqLvaYIitllVdVwFhI2mGleXzvgRl94yFs0'
    supabase_anon_key: str = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5dmRsdm53d3ZsbW5hZmlmd2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MzUxNTksImV4cCI6MjA3ODAxMTE1OX0.94wFJw0YpjpcqPcmkZLqLOp4ZXxqlkf4qsiMVQUKhso'
    openai_api_key: Optional[str] = Field(default=None, validation_alias="OPENAI_API_KEY")

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()