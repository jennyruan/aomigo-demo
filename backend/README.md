# AOMIGO FastAPI Service

This backend moves all critical business logic out of the Vite frontend into a typed, testable FastAPI application.

## Features

- Firebase authentication verification for every request
- Supabase Postgres + Storage integration via repository and service layers
- Modular routers per feature (auth, profiles, submissions, reviews, sessions)
- Spaced-repetition review lifecycle (schedule, complete, list) handled server-side
- Structured logging and typed request/response contracts
- Ready for deployment on Render, Fly.io, or any container-based platform

## Getting started

```bash
# inside backend directory
poetry install
poetry run uvicorn app.main:app --reload
```

Environment variables (use `.env` locally):

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE`
- `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` *(optional until AI features are moved)*

## Project structure

```
app/
  main.py          # FastAPI instance, router registration
  api/             # Versioned HTTP endpoints
  core/            # Settings, logging, dependencies
  services/        # Business logic (per feature)
  repositories/    # Data access combined with Supabase clients
  schemas/         # Pydantic models for I/O contracts
  db/              # Connections and migrations helpers
```

Run the test suite:

```bash
poetry run pytest
# or, if you're using the bundled virtualenv
./venv/bin/python -m pytest
```

## Reviews API

- `GET /api/v1/reviews/open` — return the caller's pending reviews ordered by scheduled date.
- `POST /api/v1/reviews/{review_id}/complete` — mark a review done, record the result, and auto-schedule the next interval.
- `POST /api/v1/reviews/schedule` — create a new review for a topic at a specific interval (useful for onboarding or manual scheduling).
- `GET /api/v1/reviews/intervals` — expose the spaced-repetition interval sequence used by the service.

Format and lint:

```bash
poetry run black app
poetry run ruff check app
```
