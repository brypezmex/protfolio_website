"""Project metadata endpoints: GitHub stats and demo liveness."""

from __future__ import annotations

from flask import Blueprint, current_app, jsonify

from ..core.errors import ApiError

bp = Blueprint("projects", __name__)


@bp.get("/api/github/repos")
def github_repos():
    """Cached GitHub statistics, keyed by project id."""
    config = current_app.config["APP_CONFIG"]
    if not config.enable_github:
        raise ApiError("GitHub integration is disabled.", status=404, code="feature_disabled")

    service = current_app.extensions["github_service"]
    return jsonify({"repos": service.repo_stats()})


@bp.get("/api/projects/status")
def project_status():
    """Cached liveness of each configured demo, keyed by service key."""
    config = current_app.config["APP_CONFIG"]
    if not config.enable_status:
        raise ApiError("Status checks are disabled.", status=404, code="feature_disabled")

    service = current_app.extensions["status_service"]
    return jsonify({"services": service.statuses()})
