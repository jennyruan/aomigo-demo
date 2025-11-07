from __future__ import annotations
"""Legacy auth service placeholder.

The project now relies entirely on client-managed Firebase authentication.
Server-side password management has been removed, so this module intentionally
provides no functionality but remains to avoid import errors until consumers
are fully updated.
"""

from __future__ import annotations


class AuthService:
    async def register(self, *args, **kwargs):  # pragma: no cover - compatibility shim
        raise RuntimeError("Server-managed authentication has been removed. Use Firebase on the client.")

    async def authenticate(self, *args, **kwargs):  # pragma: no cover - compatibility shim
        raise RuntimeError("Server-managed authentication has been removed. Use Firebase on the client.")