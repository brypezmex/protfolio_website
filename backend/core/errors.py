"""Error handling.

Every failure leaves this API as JSON with the same shape the frontend's
``ApiError`` expects::

    {"error": "human readable message", "code": "machine_readable_code"}

Internal exception detail is logged but never returned, so a stack trace or a
configuration value can never leak through an error response.
"""

from __future__ import annotations

import logging

from flask import jsonify
from werkzeug.exceptions import HTTPException

logger = logging.getLogger(__name__)


class ApiError(Exception):
    """An error that is safe to describe to the client."""

    def __init__(self, message: str, *, status: int = 400, code: str = "bad_request"):
        super().__init__(message)
        self.message = message
        self.status = status
        self.code = code


def register_error_handlers(app) -> None:
    @app.errorhandler(ApiError)
    def _handle_api_error(error: ApiError):
        return jsonify({"error": error.message, "code": error.code}), error.status

    @app.errorhandler(HTTPException)
    def _handle_http_error(error: HTTPException):
        return (
            jsonify({"error": error.description, "code": error.name.lower().replace(" ", "_")}),
            error.code or 500,
        )

    @app.errorhandler(Exception)
    def _handle_unexpected(error: Exception):
        # Full detail to the server log, a generic message to the client.
        logger.exception("Unhandled error: %s", error)
        return jsonify({"error": "Internal server error", "code": "internal_error"}), 500
