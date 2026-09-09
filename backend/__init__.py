"""Portfolio backend package.

Run from the repository root so that `backend` resolves as a package:

    python -m backend.app                      # development
    gunicorn --bind 0.0.0.0:5001 backend.wsgi:app   # production
"""
