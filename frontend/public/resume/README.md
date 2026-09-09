# Resume directory

Put the resume PDF here, named exactly `resume.pdf`:

```
frontend/public/resume/resume.pdf
```

Everything in `frontend/public/` is copied to the root of the build output
untouched, so that file is served at `/resume/resume.pdf`. That path is the
default value of `VITE_RESUME_URL`, which is what the navigation bar, the hero
button, and the contact section all link to.

To serve the resume from somewhere else - a CDN, or a path on the home server -
set the variable instead of moving the file:

```
VITE_RESUME_URL=https://files.example.com/bryan-perez-resume.pdf
```

Until a PDF is placed here, those links resolve to a 404. Nothing else on the
site depends on the file.
