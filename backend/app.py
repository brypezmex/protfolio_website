"""Flask application factory.

This backend is optional. The portfolio is a static React build that works
completely on its own; everything here is progressive enhancement for the two
things a browser genuinely cannot do by itself:

1. Call the GitHub API with a token that must stay secret.
2. Probe home-server-hosted demos for liveness (blocked cross-origin, and the
   server's address should not be in the published bundle anyway).

Both can be switched off independently by environment variable, and the
frontend hides the corresponding UI when they are off.
"""

from __future__ import annotations

import logging

from flask import Flask
from flask_cors import CORS

from .api import meta as meta_api
from .api import projects as projects_api
from .core.config import Config, load_config
from .core.errors import register_error_handlers
from .services.github_service import GitHubService
from .services.status_service import StatusService


def create_app(config: Config | None = None) -> Flask:
    app = Flask(__name__)
    config = config or load_config()

    logging.basicConfig(
        level=logging.DEBUG if config.debug else logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )

    app.config["APP_CONFIG"] = config

    # CORS is only needed when the frontend is served from a different origin.
    # With nginx serving the build and proxying /api on the same host - the
    # documented deployment - ALLOWED_ORIGINS stays empty and no CORS headers
    # are emitted at all. A wildcard is never used.
    if config.allowed_origins:
        CORS(
            app,
            resources={r"/api/*": {"origins": config.allowed_origins}},
            methods=["GET"],
            allow_headers=["Content-Type"],
            max_age=3600,
        )

    # Services are constructed once and shared. Each holds its own TTL cache, so
    # the caches survive across requests rather than being rebuilt per call.
    app.extensions["github_service"] = GitHubService(config)
    app.extensions["status_service"] = StatusService(config)

    app.register_blueprint(meta_api.bp)
    app.register_blueprint(projects_api.bp)

    register_error_handlers(app)

    @app.after_request
    def _security_headers(response):
        # The API only ever returns JSON, so it should never be interpreted as
        # anything else, embedded in a frame, or used as a referrer source.
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "no-referrer")
        return response

    app.logger.info(
        "Portfolio API ready. Features: %s",
        ", ".join(f"{k}={v}" for k, v in config.public_features().items()),
    )

    return app


if __name__ == "__main__":
    # Development entry point only. Production runs through wsgi.py under
    # Gunicorn - see the README's deployment section.
    application = create_app()
    app_config = application.config["APP_CONFIG"]
    application.run(
        host=app_config.host,
        port=app_config.port,
        debug=app_config.debug,
    )
