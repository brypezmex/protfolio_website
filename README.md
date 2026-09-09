# Bryan Perez - Portfolio

A personal portfolio built around a scroll-driven timeline, with a pixel-art
visual identity. The primary experience is a single page that moves
chronologically through education, research, projects, and involvement, with a
detailed project system layered on top.

The site is a static React build with an optional Flask API behind it. The
static build is the product; the API only exists for two things a browser
cannot do on its own.

Third-party assets and their licences are documented in
[ATTRIBUTIONS.md](ATTRIBUTIONS.md).

---

## Table of contents

1. [Project overview](#1-project-overview)
2. [Features](#2-features)
3. [Tech stack](#3-tech-stack)
4. [Project structure](#4-project-structure)
5. [Installation](#5-installation)
6. [Local development](#6-local-development)
7. [Environment variables](#7-environment-variables)
8. [Running the application](#8-running-the-application)
9. [Building for production](#9-building-for-production)
10. [Deployment](#10-deployment)
11. [Home server integration](#11-home-server-integration)
12. [Adding new projects](#12-adding-new-projects)
13. [Adding GitHub and live demo links](#13-adding-github-and-live-demo-links)
14. [Customizing the design](#14-customizing-the-design)
15. [Icons and fonts](#15-icons-and-fonts)
16. [API integration](#16-api-integration)
17. [Security considerations](#17-security-considerations)
18. [Troubleshooting](#18-troubleshooting)
19. [Future improvements](#19-future-improvements)

---

## 1. Project overview

### What it is

A single-page portfolio. The spine of the site is a vertical timeline running
from August 2023 to expected graduation in May 2027. Education, research,
projects, and club involvement all appear on that one timeline rather than in
four separate sections, because the progression between them is the point. A
category filter lets a visitor who only wants to see projects get there in one
click without losing that framing.

Below the timeline, a dedicated projects section carries the full breakdown for
each project, opened as a modal dialog so the reader never loses their scroll
position.

### Architectural decisions

**React with Vite for the frontend.** Vite gives fast HMR during development and
emits a small, well-chunked static bundle - a plain directory of files any web
server can host, which is what makes home server deployment trivial.

**Plain CSS with a design-token layer, not a CSS framework.** The visual
identity relies on things utility frameworks make awkward: clip-path corner
notches instead of border radius, crisp-edge pixel SVG, scanline overlays, and a
scroll-linked gradient rail. Writing that as custom properties in
`src/styles/tokens.css` plus one stylesheet per component keeps the CSS readable,
keeps the shipped bundle small (about 7 KB gzipped), and means the entire site
can be re-themed by editing one file.

**No animation library.** Framer Motion and GSAP both solve problems this site
does not have. Every reveal is an `IntersectionObserver` toggling a class, and
every transition animates only `transform` and `opacity`, which the browser runs
on the compositor. The two scroll-linked effects - the timeline rail fill and the
page progress bar - use a single rAF-throttled passive scroll listener that
writes a CSS custom property rather than React state, so scrolling never triggers
a React render. That is roughly 50 KB of JavaScript not shipped.

**One shared React context for the project system.** The timeline, the skills
list, and the project grid all need to open the same project dialog. A context
(`src/features/projects/`) owns the open project and the one-time metadata fetch,
so there is exactly one dialog in the tree and exactly one network request
regardless of how many components consume it.

**A Flask backend that is entirely optional.** The frontend feature-detects the
API once on load via `/api/config`. If that request fails - because the API is
not deployed, is offline, or was switched off - every backend-dependent feature
hides itself and the site works as a purely static page.

**Project data centralized in one file.** `src/data/projects.js` is the single
source of truth for the project system. Adding a project means appending one
object; no component changes.

### On tone

The copy is deliberately plain. Section headings are labels - "About",
"Timeline", "Projects" - not marketing sentences, and the hero opens with a name
and a factual paragraph rather than a slogan in oversized type. Buttons are flat
with hard borders rather than gradient fills, and there are no coloured glow
effects. All of that is the difference between a portfolio and a product landing
page, and the character comes from the pixel typefaces and icons instead. Keep
that in mind when editing content: if a line would look at home on a startup's
launch page, it does not belong here.

---

## 2. Features

**Timeline**

- Chronological entries grouped by year, with the year pinned in the gutter as
  you scroll through its entries
- A rail whose gradient fill tracks scroll position, with the brightest stop
  always at the leading edge
- Type-specific pixel icons for education, projects, research, and involvement
- Stronger visual treatment for major milestones
- Category filter chips, implemented as a radio group so keyboard users get
  arrow-key navigation
- Project entries link straight into the full project dialog

**Projects**

- Generated architecture schematics as card previews, drawn from each project's
  own data - no screenshots to go stale, no image weight
- Full detail dialog with a complete focus trap, scroll lock, and Escape to close
- Placeholder-aware links: an unconfigured repository or demo renders as a
  visibly inert chip rather than a dead `#` link
- Optional live GitHub stats and demo liveness badges when the API is running

**Site-wide**

- Pixel-art type and icon system (see [section 15](#15-icons-and-fonts))
- Sticky navigation with an `IntersectionObserver` scroll-spy active indicator
- A distinct mobile navigation overlay, not a squeezed desktop bar
- Animated pixel-field hero canvas that suspends when off-screen or backgrounded
- Full `prefers-reduced-motion` support
- Semantic landmarks, skip link, visible focus states, and verified colour
  contrast

---

## 3. Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| UI | React 19 | On the resume; component model fits the section/card structure |
| Build | Vite 7 | Fast HMR, small chunked static output |
| Styling | CSS custom properties, per-component stylesheets | Full control over the visual identity, tiny bundle, one-file theming |
| Animation | `IntersectionObserver` and CSS transitions | No dependency, compositor-only, trivial reduced-motion support |
| Icons | Pixelarticons, inlined at build time | 24 icons as SVG path data, no runtime dependency |
| Fonts | Silkscreen, Pixelify Sans, Inter, JetBrains Mono | Pixel character where it counts, readable body copy where it matters |
| API | Flask 3 | On the resume; small enough for a home server |
| HTTP | requests | Standard, sufficient for two outbound integrations |
| WSGI | Gunicorn | Standard production server for Flask on Linux |

Runtime dependencies total two packages for the frontend (`react`, `react-dom`)
and five for the backend.

---

## 4. Project structure

```
portfolio/
├── ATTRIBUTIONS.md                Third-party licences
├── frontend/
│   ├── index.html                 SEO metadata, fonts, JSON-LD
│   ├── vite.config.js             Build config and dev API proxy
│   ├── eslint.config.js
│   ├── Dockerfile                 Build then serve via nginx
│   ├── docker-nginx.conf          In-container nginx config
│   ├── .env.example
│   ├── scripts/
│   │   └── build-icons.mjs        Extracts icon paths from pixelarticons
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── og-image.svg
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   └── resume/                Place resume.pdf here
│   └── src/
│       ├── main.jsx               Entry; style import order matters
│       ├── App.jsx                Shell and section composition
│       ├── config/site.js         All environment reads live here
│       ├── data/                  Content: the single source of truth
│       │   ├── profile.js         Identity, contact, about copy
│       │   ├── skills.js          Skill groups and coursework
│       │   ├── projects.js        Project records
│       │   ├── timeline.js        Chronological entries
│       │   └── navigation.js      Section registry
│       ├── api/                   Backend client
│       │   ├── client.js          Fetch wrapper, timeouts, ApiError
│       │   └── projects.js        GitHub stats, demo status
│       ├── hooks/
│       │   ├── useInView.js       IntersectionObserver reveals
│       │   ├── useScrollProgress.js  rAF scroll to CSS variable
│       │   ├── useActiveSection.js   Nav scroll-spy
│       │   ├── useMediaQuery.js      Includes reduced-motion
│       │   ├── useDialog.js          Focus trap and scroll lock
│       │   └── useBackendConfig.js   Feature detection
│       ├── components/
│       │   ├── layout/            Nav, Footer, Section, progress bar
│       │   ├── ui/                Button, Tag, Modal, PixelIcon, ...
│       │   │   ├── pixelIcons.js               GENERATED - do not edit
│       │   │   └── pixelarticons-LICENSE.txt   Vendored MIT licence
│       │   └── sections/          Hero, About, Journey, Skills, ...
│       ├── features/
│       │   ├── timeline/          Timeline, entries, filters
│       │   └── projects/          Context, cards, dialog, schematic
│       ├── styles/                tokens, base, utilities, app shell
│       └── utils/cn.js
│
├── backend/
│   ├── app.py                     Application factory
│   ├── wsgi.py                    Production entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   ├── core/
│   │   ├── config.py              Environment to a frozen dataclass
│   │   └── errors.py              Consistent JSON error shape
│   ├── services/
│   │   ├── cache.py               Thread-safe TTL cache
│   │   ├── github_service.py
│   │   └── status_service.py      Home server demo probes
│   └── api/                       Blueprints: meta, projects
│
└── deploy/
    ├── nginx.conf                 Reference host nginx config
    ├── docker-compose.yml         Two-container stack
    └── portfolio-api.service      systemd unit
```

### How the layers relate

`data/` holds content and nothing else. `components/ui/` holds primitives that
know nothing about the portfolio. `features/` holds the two subsystems with real
internal state - the timeline and the project system. `components/sections/`
composes data plus features into page sections. Nothing outside `config/site.js`
reads an environment variable, and nothing outside `api/` performs a fetch.

---

## 5. Installation

Requirements: Node.js 20 or newer, and Python 3.11 or newer if the backend is
wanted.

```bash
git clone <your-repo-url> portfolio
cd portfolio
```

Frontend:

```bash
cd frontend
npm install
```

Backend (optional). Run these from the repository root, because `backend` has to
resolve as a Python package:

```bash
python -m venv .venv
```

Then activate it. On Linux or macOS:

```bash
source .venv/bin/activate
```

On Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Then install:

```bash
pip install -r backend/requirements.txt
```

---

## 6. Local development

The frontend alone is enough for all design and content work:

```bash
cd frontend
npm run dev
```

That serves the site at `http://localhost:5173`. The API-dependent features stay
hidden, which is the correct behaviour, not an error.

To work on the API as well, run it in a second terminal from the repository
root:

```bash
python -m backend.app
```

It listens on `http://127.0.0.1:5001`. The Vite dev server proxies `/api` there
automatically, so the frontend uses the same relative paths in development as in
production.

Linting:

```bash
cd frontend
npm run lint
```

---

## 7. Environment variables

There are two `.env` files and the distinction between them matters.

### Frontend: `frontend/.env`

Copy from `frontend/.env.example`. **Everything here is compiled into the public
JavaScript bundle and is readable by anyone.** Never put a secret in this file.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | empty | Base URL for the API. Empty means same-origin `/api` requests, which is what you want behind nginx. |
| `VITE_DEV_API_PROXY` | `http://127.0.0.1:5001` | Where `npm run dev` proxies `/api`. |
| `VITE_ENABLE_BACKEND` | `true` | Set `false` to make the site issue zero network requests. |
| `VITE_RESUME_URL` | `/resume/resume.pdf` | Resume location. |
| `VITE_PROJECT_<ID>_GITHUB` | empty | Overrides a project's repository link. |
| `VITE_PROJECT_<ID>_DEMO` | empty | Overrides a project's demo link. |

Vite substitutes these at **build time**. Changing one requires a rebuild;
setting it on a running container does nothing.

### Backend: `backend/.env`

Copy from `backend/.env.example`. This file holds real secrets. It is read by the
server process and nothing in it reaches a browser.

| Variable | Default | Purpose |
| --- | --- | --- |
| `HOST` / `PORT` | `127.0.0.1` / `5001` | Bind address. |
| `ALLOWED_ORIGINS` | empty | Comma-separated CORS origins. Leave empty for same-origin deployments. |
| `ENABLE_GITHUB` | `true` | GitHub stats feature. |
| `ENABLE_STATUS` | `true` | Demo liveness probes. |
| `GITHUB_TOKEN` | empty | Optional; raises the GitHub rate limit. |
| `GITHUB_REPOS` | empty | `projectId=owner/repo` pairs, comma-separated. |
| `PROJECT_SERVICE_<KEY>` | unset | URL for a project's demo health check. |
| `GITHUB_CACHE_TTL` | `900` | Seconds to cache GitHub responses. |
| `STATUS_CACHE_TTL` | `60` | Seconds to cache demo status. |

Both `.env` files are git-ignored. Only the `.env.example` files are tracked.

---

## 8. Running the application

### Frontend only

```bash
cd frontend && npm run dev
```

### Frontend and API together

Terminal one, from the repository root:

```bash
python -m backend.app
```

Terminal two:

```bash
cd frontend && npm run dev
```

Confirm the API is up and reporting the features you expect:

```bash
curl http://127.0.0.1:5001/api/config
```

That returns a JSON object of booleans, for example
`{"features":{"github":true,"status":false}}`. Anything the frontend does not
see as `true` here stays hidden in the UI.

Gunicorn does not run on Windows. Use `python -m backend.app` for local
development there; Gunicorn is only used on the Linux server.

---

## 9. Building for production

```bash
cd frontend
npm run build
```

Output lands in `frontend/dist/` as a plain static directory. To check the built
output locally:

```bash
npm run preview
```

The build splits React into its own chunk, so the initial payload is roughly
16 KB gzipped of application code plus 60 KB of React and 7 KB of CSS.

---

## 10. Deployment

Two supported paths. Both assume nginx serves the static build and proxies
`/api` to Gunicorn on the same origin, which is why no CORS configuration is
needed in either.

### Option A: nginx and systemd directly on the server

1. Copy the repository to the server, for example `/srv/portfolio`.
2. Build the frontend and publish it:

```bash
cd /srv/portfolio/frontend && npm ci && npm run build
sudo mkdir -p /var/www/portfolio
sudo cp -r dist/* /var/www/portfolio/
```

3. Create the Python environment:

```bash
cd /srv/portfolio && python -m venv .venv && ./.venv/bin/pip install -r backend/requirements.txt
```

4. Create `backend/.env` from the example and lock it down:

```bash
sudo chown portfolio:portfolio /srv/portfolio/backend/.env && sudo chmod 600 /srv/portfolio/backend/.env
```

5. Install the service:

```bash
sudo cp deploy/portfolio-api.service /etc/systemd/system/ && sudo systemctl daemon-reload && sudo systemctl enable --now portfolio-api
```

6. Install the web server config:

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/portfolio && sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx
```

7. Issue a certificate:

```bash
sudo certbot --nginx -d bryanperez.dev -d www.bryanperez.dev
```

Edit the `server_name`, `root`, and certificate paths in `deploy/nginx.conf`
first; they contain placeholder values.

### Option B: Docker Compose

```bash
docker compose -f deploy/docker-compose.yml up -d --build
```

That builds both images and publishes the site on port 8080. Only the web
container exposes a port; the API is reachable only from inside the Compose
network. Put a TLS terminator in front of port 8080.

Because Vite bakes `VITE_*` variables in at build time, they are passed as build
`args` in `deploy/docker-compose.yml`, not as `environment` entries. Changing one
requires `--build`.

### Static-only hosting

The site works with no backend at all. Set `VITE_ENABLE_BACKEND=false`, run
`npm run build`, and upload `frontend/dist/` anywhere.

---

## 11. Home server integration

The design goal is that the portfolio never needs to know your server's address,
and that address never appears in the published bundle.

### How demo status works

1. Each project in `src/data/projects.js` declares a `service.key`, for example
   `{ key: 'noirmore' }`.
2. The browser calls `GET /api/projects/status`. It sends no URLs.
3. The Flask backend resolves each key against a `PROJECT_SERVICE_<KEY>`
   environment variable on the server, probes that URL, and returns only a status
   word per key.
4. The frontend renders a Live, Offline, or Not deployed badge.

To connect a project hosted on your server, add one line to `backend/.env`:

```
PROJECT_SERVICE_NOIRMORE=http://10.0.0.42:8081/health
```

Then restart the API. Nothing in the frontend changes and nothing is rebuilt.

This has to be server-side for two reasons. A browser cannot probe an arbitrary
origin - a cross-origin request to a service without CORS headers fails, and a
failure is indistinguishable from the service being down. And the address should
not be in public JavaScript regardless.

Point these at a cheap health endpoint rather than an application's front page,
since they are polled and cached for `STATUS_CACHE_TTL` seconds.

### Exposing a project's demo publicly

The status badge only reports liveness. To make a demo clickable, set the
matching frontend variable to a publicly reachable URL and rebuild:

```
VITE_PROJECT_NOIRMORE_DEMO=https://noirmore.bryanperez.dev
```

Typical setup: a subdomain per project pointed at the home server, with nginx
reverse-proxying each subdomain to its container port. Keep the internal address
in the proxy config, never in the frontend.

### Suggested topology

```
Internet
   |
   v
Router (443 forwarded)
   |
   v
Home server nginx
   |-- bryanperez.dev            -> /var/www/portfolio  (static build)
   |-- bryanperez.dev/api        -> 127.0.0.1:5001      (Gunicorn)
   |-- noirmore.bryanperez.dev   -> 127.0.0.1:8081
   `-- wolfcafe.bryanperez.dev   -> 127.0.0.1:8082
```

---

## 12. Adding new projects

Everything about a project lives in `frontend/src/data/projects.js`. Append one
object to the `projects` array:

```js
{
  id: 'my-project',                       // slug: anchors, keys, env var names
  name: 'My Project',
  tagline: 'One plain line describing what it does.',
  role: 'Developer',
  type: 'Full-stack application',
  period: { start: '2026-09', end: null, label: 'September 2026 - Present' },
  status: 'in-progress',
  featured: true,
  icon: 'briefcase',                      // key from components/ui/pixelIcons.js

  summary: 'A paragraph of real technical detail.',
  highlights: ['Three short scannable lines', 'shown on the card face'],
  features: [
    { title: 'A capability', detail: 'What it does and why it was hard.' },
  ],
  tech: ['React', 'Python'],
  preview: { nodes: ['Client', 'API', 'Worker', 'Store'] },  // drives the schematic
  links: { github: '#', demo: '#' },
  service: { key: 'my-project', label: 'My Project demo' },
}
```

Then, if you want env-var overrides for its links, add the entry to
`projectLinkOverrides` in `frontend/src/config/site.js`:

```js
'my-project': {
  github: read(env.VITE_PROJECT_MY_PROJECT_GITHUB),
  demo: read(env.VITE_PROJECT_MY_PROJECT_DEMO),
},
```

That map is written out explicitly rather than built from a dynamic key because
Vite substitutes `import.meta.env.VITE_*` statically at build time; a computed
lookup is not guaranteed to survive the production build.

To place the project on the timeline as well, add an entry to
`frontend/src/data/timeline.js` with `type: 'project'` and
`projectId: 'my-project'`. The timeline sorts itself by `start`, so entries can
be authored in any order.

To cross-link it from the skills list, add its id to the relevant `usedIn` arrays
in `frontend/src/data/skills.js`.

No component code changes for any of this. If the `icon` you want is not in
`pixelIcons.js`, see [section 15](#15-icons-and-fonts).

---

## 13. Adding GitHub and live demo links

Project links resolve in this order: environment variable, then the value in
`projects.js`, then treated as a placeholder.

**Preferred - environment variables.** Set them in `frontend/.env` and rebuild:

```
VITE_PROJECT_NOIRMORE_GITHUB=https://github.com/brypezmex/NoirMore
VITE_PROJECT_NOIRMORE_DEMO=https://noirmore.bryanperez.dev
```

This keeps deployment configuration out of source control and lets the same
commit build differently for different environments.

**Alternative - edit the data file.** Change `links.github` and `links.demo` in
`projects.js` from `'#'` to real URLs. Simpler, but the URLs are then committed.

Either way, no UI code changes. A link that is missing, empty, or `'#'` renders
as an inert "soon" chip; a real URL renders as a working link that opens in a
new tab.

To enable GitHub stats on the cards, set `GITHUB_REPOS` in `backend/.env`:

```
GITHUB_REPOS=noirmore=brypezmex/NoirMore,wolfcafe=brypezmex/WolfCafe
```

---

## 14. Customizing the design

Nearly all visual change happens in `frontend/src/styles/tokens.css`.

**Colours.** The accent ramp is `--red`, `--red-bright`, `--red-deep`,
`--red-ink`, and `--ember`, plus four alpha variants. Change these and the entire
site follows - buttons, the timeline rail, icons, focus rings. The surface ramp
runs `--bg` through `--surface-3`. Text colours are `--text`, `--text-dim`, and
`--text-faint`; all three are verified above 4.5:1 against `--bg`, so re-check
contrast if you lighten the background.

**Typography.** Four families, each with one job - see
[section 15](#15-icons-and-fonts). The type scale uses `clamp()` so sizes
interpolate smoothly rather than jumping at breakpoints.

**Shape.** The site avoids `border-radius` entirely. Corners are cut with
`clip-path` at `--notch` and `--notch-sm` via the `.notched` utility classes.
Setting both to `0px` gives square corners; raising them makes the low-resolution
look more pronounced.

**Flatness is deliberate.** There is one gradient on the site (the timeline rail)
and no coloured glows. Buttons are flat fills with 2px borders. If you add a
gradient CTA or a glowing shadow, the page will start reading as a product
landing page again - that was the specific thing this design was corrected away
from.

**Motion.** `--dur-fast`, `--dur-mid`, and `--dur-slow` set the base durations.
Components must use the derived `--t-fast`, `--t-mid`, and `--t-slow` tokens,
never the raw values, because the derived ones are multiplied by
`--motion-scale`, which `prefers-reduced-motion` sets to `0`. That single
mechanism disables every transition on the site.

**A note on stylesheet order.** `main.jsx` imports the shared stylesheets
*before* it imports `App.jsx`. That is deliberate: Vite emits CSS in import
order, so importing App first would place every component stylesheet ahead of the
shared utilities, and a utility class would then win over the component rule it
collides with purely on source order. Keep the style imports at the top.

---

## 15. Icons and fonts

Licences, copyright holders, and the reasoning behind each choice are in
[ATTRIBUTIONS.md](ATTRIBUTIONS.md). This section covers how to work with them.

### Icons

Icons come from **Pixelarticons** (MIT). The package is a devDependency; only the
24 icons the site actually uses are extracted into
`frontend/src/components/ui/pixelIcons.js` as inline SVG path data, so nothing
from the package ships in the browser bundle.

To add or change an icon, edit the `ICONS` map in
`frontend/scripts/build-icons.mjs` and run:

```bash
npm run build:icons
```

Available names are listed at the top of the generated `pixelIcons.js`. Never
edit that file by hand - it is overwritten.

**Icon sizes are constrained on purpose.** `PixelIcon` snaps whatever size you
pass to the nearest value in `SIZE_STEPS` (16, 20, 24, 32, 48, 64, 128). The
artwork is on a 24-unit grid, so the rendered size decides whether a grid unit
lands on a whole device pixel. Below about 16px the thinner strokes fall into the
gaps and the icons visibly turn to mush; these steps were chosen by rendering the
full set side by side at 12/16/20/24/32 and comparing. Passing `size={13}` will
not produce a 13px icon, and that is intentional.

### Fonts

| Family | Role |
| --- | --- |
| **Silkscreen** | Section labels, navigation, chips, metadata, the hero name |
| **Pixelify Sans** | Headings and card titles |
| **Inter** | Body copy |
| **JetBrains Mono** | The terminal block and monospaced values |

The split is deliberate. Pixel faces carry the character, but they are poor at
running text, so anything a recruiter actually reads in paragraph form stays in
Inter. Silkscreen is used uppercase and small, which is what it was drawn for;
Pixelify Sans has real lowercase and holds up at heading sizes.

Two tracking rules worth knowing if you edit the type: pixel faces need
**positive or zero letter-spacing** - tightening them closes the gaps that make
them read as pixel art - and headings deliberately set `letter-spacing: 0` rather
than the negative tracking a normal display face would want.

Fonts load from Google Fonts. See ATTRIBUTIONS.md for how to self-host them if
you would rather not depend on an external CDN.

---

## 16. API integration

### Endpoints

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/api/health` | `{"status":"ok"}` |
| GET | `/api/config` | `{"features":{...}}` - booleans only |
| GET | `/api/github/repos` | `{"repos":{projectId:{stars,language,pushedAt,url}}}` |
| GET | `/api/projects/status` | `{"services":{key:"online"｜"offline"｜"unconfigured"}}` |

Errors always return `{"error": "...", "code": "..."}` with an appropriate
status. Internal exception detail is logged, never returned.

### Adding an endpoint

1. Add a service in `backend/services/` holding the logic and its own cache.
2. Add a blueprint in `backend/api/`, or a route to an existing one.
3. Register the service in `create_app` and the blueprint below it.
4. If the frontend should be able to detect it, add a flag to
   `Config.public_features()`.
5. Add a client function in `frontend/src/api/`.

The frontend fetch wrapper (`src/api/client.js`) handles base URL resolution,
timeouts, abort signals, and error normalization, so a new client function is
usually one call to `apiRequest`.

---

## 17. Security considerations

**Secrets.** No secret is in any source file. `GITHUB_TOKEN` is read from the
server environment only. Both `.env` files are git-ignored, and the systemd unit
loads secrets via `EnvironmentFile` rather than `Environment=`, because unit
files are world-readable.

**The frontend/backend boundary.** Anything in `frontend/.env` ships to the
browser in readable form. That is why `/api/config` returns only booleans, why
the GitHub call is proxied rather than made from the browser, and why demo URLs
are resolved from server-side keys.

**CORS.** No CORS headers are emitted unless `ALLOWED_ORIGINS` is set, and a
wildcard is never used. The documented deployment is same-origin and needs none.

**Headers.** The API sets `X-Content-Type-Options`, `X-Frame-Options`, and
`Referrer-Policy` on every response. `deploy/nginx.conf` adds HSTS, a
`Permissions-Policy`, and a Content-Security-Policy that restricts scripts to the
site's own origin and fonts to Google Fonts.

**Error handling.** Every unhandled exception is logged server-side and returned
as a generic message, so stack traces and configuration values cannot leak.

**Outbound requests.** Both integrations use short timeouts and cache results, so
a slow or hostile upstream cannot tie up workers.

**Container hardening.** The API image runs as a non-root user. The systemd unit
sets `NoNewPrivileges`, `ProtectSystem=strict`, `ProtectHome`, and restricts
address families.

---

## 18. Troubleshooting

**Backend features do not appear.** Check `curl http://127.0.0.1:5001/api/config`.
A feature reports `true` only when its switch is on *and* it is configured -
`github` also needs `GITHUB_REPOS`, and `status` also needs at least one
`PROJECT_SERVICE_*`.

**`/api` returns 404 in development.** The Flask app is not running, or is on a
different port than `VITE_DEV_API_PROXY`. Start it with `python -m backend.app`
from the repository root.

**`ModuleNotFoundError: No module named 'backend'`.** You are running from inside
`backend/`. Run from the repository root, which is what makes `backend` resolve
as a package.

**Gunicorn will not start on Windows.** It requires `fcntl` and is Unix-only. Use
`python -m backend.app` locally.

**Environment changes have no effect on the frontend.** Vite substitutes `VITE_*`
at build time. Restart `npm run dev`, or rebuild for production. In Docker they
must be passed as build `args`.

**An icon renders as nothing.** The name is not in `pixelIcons.js`. `PixelIcon`
logs a warning in development and renders nothing rather than breaking layout.
Add it to `scripts/build-icons.mjs` and run `npm run build:icons`.

**An icon looks blurry or filled in.** It is being rendered too small. See the
size note in [section 15](#15-icons-and-fonts) - 16px is the floor.

**Headings render in a fallback font.** Pixelify Sans failed to load. Check the
Google Fonts `<link>` in `index.html` and, if a CSP is in force, that
`fonts.googleapis.com` and `fonts.gstatic.com` are allowed.

**A project's demo badge says "Not deployed".** No `PROJECT_SERVICE_<KEY>` is set
for that project's `service.key`, or `ENABLE_STATUS` is false. The key is
uppercased in the variable name.

**GitHub stats are missing.** Confirm `GITHUB_REPOS` uses `projectId=owner/repo`
and that the project id matches `projects.js` exactly. Private and renamed
repositories return 404 and are skipped. Results are cached for
`GITHUB_CACHE_TTL` seconds.

**The resume link 404s.** Place the PDF at `frontend/public/resume/resume.pdf`,
or point `VITE_RESUME_URL` elsewhere. See `frontend/public/resume/README.md`.

**A component style is being overridden by a utility class.** Check that the
style imports in `main.jsx` still come before the `App.jsx` import - see
section 14.

**Animations do not run.** Expected when the operating system has reduced motion
enabled. `--motion-scale` becomes `0` and every transition collapses.

---

## 19. Future improvements

Roughly in order of value.

- **Real project deployments.** The link and status system is built and waiting;
  it needs the demos themselves. This is the single biggest improvement.
- **A resume PDF in the repository.** The links are live but currently 404.
- **Automated tests.** There are none. Pytest for the backend services -
  particularly the config parsers and the status probe - plus Vitest and Testing
  Library for `useInView`, the focus trap, and the link resolver.
- **CI.** A GitHub Actions workflow running lint, tests, and a build on push,
  then deploying to the home server on a tagged release.
- **Self-hosted fonts.** Removes the runtime dependency on Google's CDN. See
  ATTRIBUTIONS.md.
- **Per-project case studies.** The dialog could become a route with a shareable
  URL for a project worth a deeper write-up.
- **Analytics.** A privacy-preserving, self-hosted option such as Plausible or
  Umami would fit the home server setup.
- **Visual regression testing.** The design has enough bespoke CSS that
  Playwright screenshot comparison would catch layout regressions cheaply.
