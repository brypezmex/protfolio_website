"""Application configuration, resolved entirely from environment variables.

No secret is ever written to a source file, and nothing here is exposed to the
browser except the boolean feature flags surfaced by ``/api/config``.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field


def _env_bool(name: str, default: bool = False) -> bool:
    raw = os.environ.get(name)
    if raw is None or raw.strip() == "":
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def _env_int(name: str, default: int) -> int:
    try:
        return int(os.environ.get(name, "").strip())
    except (TypeError, ValueError):
        return default


def _env_list(name: str) -> list[str]:
    raw = os.environ.get(name, "")
    return [item.strip() for item in raw.split(",") if item.strip()]


def _project_service_urls() -> dict[str, str]:
    """Map a project's ``service.key`` to the URL the status probe should hit.

    Read from ``PROJECT_SERVICE_<KEY>`` variables, so adding a project means
    adding one environment variable rather than editing code. For example::

        PROJECT_SERVICE_NOIRMORE=http://10.0.0.42:8081

    Home server addresses stay here, in the server's environment. The browser
    only ever receives the resulting status string.
    """
    prefix = "PROJECT_SERVICE_"
    return {
        name[len(prefix):].lower(): value.strip()
        for name, value in os.environ.items()
        if name.startswith(prefix) and value.strip()
    }


@dataclass(frozen=True)
class Config:
    """Immutable snapshot of the environment, built once at app creation."""

    debug: bool = field(default_factory=lambda: _env_bool("FLASK_DEBUG"))
    host: str = field(default_factory=lambda: os.environ.get("HOST", "127.0.0.1"))
    port: int = field(default_factory=lambda: _env_int("PORT", 5001))

    # Browsers are only allowed to call this API from these origins. Empty means
    # same-origin only, which is the correct setting when nginx serves the
    # frontend and proxies /api on the same host.
    allowed_origins: list[str] = field(default_factory=lambda: _env_list("ALLOWED_ORIGINS"))

    # --- Feature switches --------------------------------------------------
    enable_github: bool = field(default_factory=lambda: _env_bool("ENABLE_GITHUB", True))
    enable_status: bool = field(default_factory=lambda: _env_bool("ENABLE_STATUS", True))

    # --- GitHub ------------------------------------------------------------
    github_user: str = field(default_factory=lambda: os.environ.get("GITHUB_USER", "brypezmex"))
    github_token: str = field(default_factory=lambda: os.environ.get("GITHUB_TOKEN", ""))
    # Maps a project id to "owner/repo". Format: "noirmore=user/NoirMore,wolfcafe=user/WolfCafe"
    github_repos_raw: str = field(default_factory=lambda: os.environ.get("GITHUB_REPOS", ""))
    github_cache_ttl: int = field(default_factory=lambda: _env_int("GITHUB_CACHE_TTL", 900))

    # --- Project status probes --------------------------------------------
    service_urls: dict[str, str] = field(default_factory=_project_service_urls)
    status_cache_ttl: int = field(default_factory=lambda: _env_int("STATUS_CACHE_TTL", 60))
    status_timeout: float = field(default_factory=lambda: float(_env_int("STATUS_TIMEOUT", 3)))

    @property
    def github_repos(self) -> dict[str, str]:
        """Parse ``GITHUB_REPOS`` into ``{project_id: "owner/repo"}``."""
        mapping: dict[str, str] = {}
        for pair in self.github_repos_raw.split(","):
            if "=" not in pair:
                continue
            key, _, repo = pair.partition("=")
            key, repo = key.strip().lower(), repo.strip()
            if key and repo:
                mapping[key] = repo
        return mapping

    def public_features(self) -> dict[str, bool]:
        """Capability flags safe to send to the browser. Booleans only."""
        return {
            "github": self.enable_github and bool(self.github_repos),
            "status": self.enable_status and bool(self.service_urls),
        }


def load_config() -> Config:
    """Build the config, loading ``backend/.env`` first if it exists.

    python-dotenv is optional at runtime: in production the environment comes
    from systemd or Compose and no .env file is present, so a missing package
    must not stop the app from starting.
    """
    try:
        from dotenv import load_dotenv
    except ImportError:
        pass
    else:
        env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
        if os.path.isfile(env_path):
            # Real environment variables win over the file, so a systemd
            # override is never silently replaced by a stale local .env.
            load_dotenv(env_path, override=False)

    return Config()
