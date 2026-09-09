"""Liveness probes for the deployed project demos.

This is the home server integration point. Each project's ``service.key`` from
the frontend data file maps to a ``PROJECT_SERVICE_<KEY>`` environment variable
holding the real URL. The browser sends the key; the server resolves it, probes
it, and returns nothing but a status word.

Two reasons it has to work this way:

* A browser cannot probe an arbitrary origin - cross-origin requests to a
  service that does not send CORS headers fail, and a failure is
  indistinguishable from the service being down.
* The home server's address never needs to appear in the published bundle.
"""

from __future__ import annotations

import logging

import requests

from ..core.config import Config
from .cache import TTLCache

logger = logging.getLogger(__name__)

ONLINE = "online"
OFFLINE = "offline"
UNCONFIGURED = "unconfigured"


class StatusService:
    def __init__(self, config: Config):
        self._config = config
        self._cache = TTLCache(config.status_cache_ttl)

    def _probe(self, url: str) -> str:
        try:
            # HEAD first: cheapest possible check, and enough for a health URL.
            response = requests.head(
                url,
                timeout=self._config.status_timeout,
                allow_redirects=True,
            )
            # Plenty of app servers do not implement HEAD; fall back to GET
            # before concluding the service is down.
            if response.status_code in (405, 501):
                response = requests.get(
                    url,
                    timeout=self._config.status_timeout,
                    allow_redirects=True,
                    stream=True,
                )
                response.close()
        except requests.RequestException as error:
            logger.info("Status probe failed for %s: %s", url, error)
            return OFFLINE

        return ONLINE if response.status_code < 500 else OFFLINE

    def statuses(self) -> dict[str, str]:
        """Return ``{service_key: status}`` for every configured service."""
        cached = self._cache.get("statuses")
        if cached is not None:
            return cached

        results = {
            key: (self._probe(url) if url else UNCONFIGURED)
            for key, url in self._config.service_urls.items()
        }

        self._cache.set("statuses", results)
        return results
