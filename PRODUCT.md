# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Recruiters** screening candidates for software engineering internships and
  new-grad roles. They usually arrive from a resume, LinkedIn, or an
  application link, often on a phone, and decide in under a minute whether to
  move Bryan forward. Their job: confirm who he is, what he's studying and when
  he graduates, what he has built, and how to reach him or get the resume.
- **Hiring engineers** in interview loops. They come back with more time and
  open the projects to judge how the work is built: architecture, stack
  choices, what was hard, and whether the demos are real.

## Product Purpose

A personal portfolio for Bryan Perez, a Computer Science student at NC State
(B.S., graduating May 2027). It shows his skills, projects, and experience in
one place so the people hiring for software development, AI engineering, and
other entry-level tech roles can evaluate him without a call.

Success means a recruiter reaches the resume or the email in seconds, and an
engineer leaves understanding how his projects work and exactly which part of
each one was his.

## Positioning

- **Backend and AI infrastructure, shipped and running.** His part of each
  project is usually the backend: APIs, data pipelines, and the retrieval and
  model plumbing behind AI features (RAG for an AI code reviewer built for
  Bandwidth, FastAPI and Databricks pipelines for an award-winning hackathon
  project). He also runs his own Proxmox and Docker homelab that hosts his
  live demos and this site, so his work exists past the repo.
- **He's part of the Latino tech community.** Mexican heritage, treasurer of
  the Latino Association of Computer Science, and a member of SHPE. This is part
  of who he is on the page, not a footnote.

## Operating Context

- Visitors land from a resume link, LinkedIn, Devpost, or a job application,
  on a phone or a laptop.
- The site is self-hosted: a Proxmox and Docker homelab behind a Cloudflare
  Tunnel at
  bryan-perez.com, with the project demos on their own subdomains
  (`noiremore.bryan-perez.com`, `wolfcafe.bryan-perez.com`).
- An optional Flask backend reports demo status and GitHub repo data. The site
  must still work fully as a static page with the backend off
  (`VITE_ENABLE_BACKEND=false`).

## Capabilities and Constraints

- Single-page React + Vite app; sections: hero, about, projects (with a detail
  dialog per project), a filterable timeline, skills, and contact.
- Content lives in data files (`frontend/src/data/`), not in components:
  profile, projects, timeline, skills, navigation.
- Project links and the resume URL are set by environment variables
  (`frontend/src/config/site.js`), not hard-coded.
- Backend endpoints: `/api/health`, `/api/config`, GitHub repos, project
  status.
- **Open:** `index.html` canonical, Open Graph, and JSON-LD URLs still point at
  `bryanperez.dev`; the live domain is `bryan-perez.com`.

## Brand Commitments

- **Reference:** Daniel Vaszka's portfolio (https://www.danielvaszka.com/). The
  site should feel similar in kind (a dark, editorial, photo-led personal site
  with big statement type), but it must not be a one-to-one copy. None of that
  site's code, images, copy, or fonts are used (see `ATTRIBUTIONS.md`).
- **Voice:** first person, plain, with contractions, the way Bryan would say it
  out loud. Facts from the resume, no superlatives, no title-cased slogans, no
  stacks of one-word fragments. Copy that reads as AI-generated is a defect.
- **Name:** Bryan Perez. Contact: email, GitHub (`brypezmex`), LinkedIn
  (`bryan-perez23`), Devpost (`bryanp0138`).
- **Honest credit:** most projects are team projects where Bryan worked on the
  backend. Each project states his role; never imply he built every layer
  alone.
- **Source of truth:** the resume (`frontend/public/resume/resume.pdf`). Site
  copy must not contradict it.

## Evidence on Hand

- Resume PDF: `frontend/public/resume/resume.pdf`, kept out of git (it has a
  phone number and the repo is public) and copied to the server on deploy.
- Hero photo: Bryan at a SHPE conference holding the flag of Mexico
  (`frontend/public/images/hero-800.jpg`, `hero-1500.jpg`).
- Projects (`frontend/src/data/projects.js`):
  - AI Code Reviewer (team, for Bandwidth, Aug 2026 to present). Private
    code, no demo.
  - GlucoCapture (hackathon, Oct 2026, 3rd place in the Applied AI
    Databricks track). Private repo; live at https://glucocapture.photo/;
    Devpost write-up.
  - WolfCafe and NoirMore: public repos (`brypezmex/WolfCafe`,
    `brypezmex/NoireMore`), live demos, screenshots.
  - Homelab: Proxmox and Docker server hosting the demos and this site.
  - One more project is in progress and will be added later.
- A WebGL scene from his CSC 461 Computer Graphics assignment
  (`frontend/public/scene/ff7-scene.bin`), shown in the footer.
- Timeline: NC State (2023–2027), SHPE, LA/CSC member then treasurer, a summer
  2025 undergraduate research role on a cybersecurity education study, the High
  Powered Rocketry Club.

**Absent, so never fabricate:**
- No screenshot of the AI Code Reviewer itself (it's private); its preview is
  a robot-head icon Bryan supplied. GlucoCapture's preview is its sign-in
  screen. The homelab has no image and shows its architecture diagram.
- No homelab hardware specs or start date.
- There are no testimonials, employers, or metrics beyond the resume, and the
  GlucoCapture placing is the only award. Don't invent any.

## Product Principles

1. **Recruiter first, engineer second.** Who he is, when he graduates, the
   resume, and how to reach him must be findable within seconds on a phone.
   Depth belongs one click deeper.
2. **Show real, running work.** Live demos, real screenshots, and how things
   were built outweigh lists of skills. Every skill should point at work that
   used it, and every project should say what Bryan's part was.
3. **Sound like Bryan.** Plain first-person copy from the resume. If a sentence
   could appear on anyone's portfolio, rewrite it or cut it.
4. **Own the reference, don't clone it.** Take the editorial ambition of
   Daniel Vaszka's site, but every heading, mechanic, and asset must be Bryan's.
5. **Works without the backend.** The portfolio is complete as a static site;
   live data only adds to it.

## Accessibility & Inclusion

WCAG 2.1 AA: text contrast checked against the dark ground, visible keyboard
focus, real section landmarks, and every animation respects
`prefers-reduced-motion`.
