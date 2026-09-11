"""Health and capability endpoints."""

from __future__ import annotations

from flask import Blueprint, current_app, jsonify

bp = Blueprint("meta", __name__)


@bp.get("/api/health")
def health():
    """Liveness check for the reverse proxy, container healthcheck, or uptime
    monitoring. Deliberately returns nothing about the configuration."""
    return jsonify({"status": "ok"})


@bp.get("/api/config")
def config():
    """Public capability descriptor.

    The frontend calls this once on load to decide which optional features to
    render. Booleans only - no URLs, no keys, no repository names. If this
    endpoint is unreachable the site falls back to its fully static form.
    """
    return jsonify({"features": current_app.config["APP_CONFIG"].public_features()})
