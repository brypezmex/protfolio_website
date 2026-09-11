"""Production WSGI entry point.

    gunicorn --bind 0.0.0.0:5001 --workers 2 backend.wsgi:app

Run from the repository root. See deploy/ for a systemd unit and a Compose file
that both do exactly this.
"""

from .app import create_app

app = create_app()
