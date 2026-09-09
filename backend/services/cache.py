"""Minimal thread-safe TTL cache.

Both outbound integrations - GitHub and the demo status probes - are shared
across every visitor, so caching happens here rather than per browser. One
request every fifteen minutes keeps GitHub's rate limit irrelevant no matter how
much traffic the site gets.
"""

from __future__ import annotations

import threading
import time
from typing import Any, Callable


class TTLCache:
    def __init__(self, ttl: int):
        self._ttl = max(ttl, 1)
        self._entries: dict[str, tuple[float, Any]] = {}
        self._lock = threading.Lock()

    def get(self, key: str) -> Any | None:
        with self._lock:
            entry = self._entries.get(key)
            if entry is None:
                return None

            expires_at, value = entry
            if time.monotonic() >= expires_at:
                self._entries.pop(key, None)
                return None

            return value

    def set(self, key: str, value: Any) -> None:
        with self._lock:
            self._entries[key] = (time.monotonic() + self._ttl, value)

    def get_or_compute(self, key: str, producer: Callable[[], Any]) -> Any:
        """Return the cached value, or compute, store, and return a fresh one.

        The producer runs outside the lock: it performs network I/O, and holding
        the lock across a multi-second request would serialize every caller
        behind it.
        """
        cached = self.get(key)
        if cached is not None:
            return cached

        value = producer()
        self.set(key, value)
        return value

    def clear(self) -> None:
        with self._lock:
            self._entries.clear()
