"""GitHub repository metadata.

Why this is proxied rather than called from the browser:

1. The token stays server-side. A token in frontend code is a published token.
2. Anonymous GitHub requests are rate limited per client IP; one cached
   server-side request serves every visitor instead.
3. The response is trimmed to the handful of fields the UI actually renders.
"""

from __future__ import annotations

import logging

import requests

from ..core.config import Config
from .cache import TTLCache

logger = logging.getLogger(__name__)

GITHUB_API = "https://api.github.com"
REQUEST_TIMEOUT = 6


class GitHubService:
    def __init__(self, config: Config):
        self._config = config
        self._cache = TTLCache(config.github_cache_ttl)

    def _headers(self) -> dict[str, str]:
        headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "bryan-perez-portfolio",
        }
        if self._config.github_token:
            headers["Authorization"] = f"Bearer {self._config.github_token}"
        return headers

    def _fetch_repo(self, full_name: str) -> dict | None:
        try:
            response = requests.get(
                f"{GITHUB_API}/repos/{full_name}",
                headers=self._headers(),
                timeout=REQUEST_TIMEOUT,
            )
        except requests.RequestException as error:
            logger.warning("GitHub request failed for %s: %s", full_name, error)
            return None

        if response.status_code != 200:
            # 404 for a private or renamed repo is expected, not exceptional.
            logger.info("GitHub returned %s for %s", response.status_code, full_name)
            return None

        payload = response.json()
        return {
            "stars": payload.get("stargazers_count", 0),
            "language": payload.get("language"),
            "pushedAt": payload.get("pushed_at"),
            "url": payload.get("html_url"),
            "description": payload.get("description"),
        }

    def repo_stats(self) -> dict[str, dict]:
        """Return ``{project_id: stats}`` for every configured repository."""

        def produce() -> dict[str, dict]:
            results: dict[str, dict] = {}
            for project_id, full_name in self._config.github_repos.items():
                stats = self._fetch_repo(full_name)
                if stats is not None:
                    results[project_id] = stats
            return results

        # An empty result is cached too, so a run of failures does not turn into
        # a retry storm against GitHub on every page load.
        cached = self._cache.get("repos")
        if cached is not None:
            return cached

        value = produce()
        self._cache.set("repos", value)
        return value
