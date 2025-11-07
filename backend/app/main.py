from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.router import api_router
from .core.config import settings
from .core.logging import configure_logging

configure_logging()

app = FastAPI(
    title="AOMIGO API",
    version="1.0.0",
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
)

# Minimal CORS setup for local development so the frontend at
# http://localhost:5173 can call the API without a preflight block.
# In production, restrict origins to your deployed frontend domain.
app.add_middleware(
    CORSMiddleware,
    # Local dev: allow both localhost and 127.0.0.1 origins. If you still
    # hit CORS issues during development, change this to ["*"] temporarily.
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/health", tags=["health"])
async def healthcheck() -> dict[str, str]:
    return {"status": "ok", "revision": settings.revision}