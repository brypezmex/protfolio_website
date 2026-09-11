# Third-party assets and licences

Every third-party asset used by this site, what it is used for, and the terms it
is used under. All of it is free for commercial use.

Copyright lines below are quoted from each project's own licence file, not
paraphrased.

---

## Fonts

Both are served from Google Fonts and licensed under the
**SIL Open Font License, Version 1.1**, which permits commercial use, embedding,
and redistribution. Full licence text: https://openfontlicense.org

| Font | Used for | Copyright | Source |
| --- | --- | --- | --- |
| **Inter Tight** | Everything: headings, navigation, labels, and body copy | `Copyright 2022 The Inter Project Authors (https://github.com/rsms/inter-tight)` | https://github.com/rsms/inter-tight |
| **Instrument Serif** (italic) | Accent letters inside headings, index numbers, timeline years, and the odd editorial flourish | `Copyright 2022 The Instrument Serif Project Authors (https://github.com/Instrument/instrument-serif)` | https://github.com/Instrument/instrument-serif |

The OFL does not require visible attribution on a website that merely uses the
fonts. This table is documentation, not an obligation being discharged.

### Self-hosting the fonts

The fonts currently load from Google Fonts, which means the site makes requests
to `fonts.googleapis.com` and `fonts.gstatic.com`. To remove that dependency -
worth doing if the site is served from a home server that should not rely on an
external CDN, or for privacy reasons:

```bash
npm install @fontsource/inter-tight @fontsource/instrument-serif
```

Import the weights the site uses at the top of `frontend/src/main.jsx` -
`@fontsource/inter-tight/400.css`, `@fontsource/inter-tight/500.css`,
`@fontsource/inter-tight/600.css`, and `@fontsource/instrument-serif/400-italic.css` -
then remove the `<link>` tags and the two `preconnect` hints from
`frontend/index.html`, and drop `https://fonts.googleapis.com` and
`https://fonts.gstatic.com` from the Content-Security-Policy in
`deploy/nginx.conf`.

---

## Design reference

The general shape of the layout - a full-bleed photographic hero with an
oversized headline, a three-column fixed navigation, statement section
headings, numbered list rows, and a large closing heading before the footer -
takes cues from the portfolio of Daniel Vaszka (https://www.danielvaszka.com),
a common structure in current design-agency portfolios.

None of that site's code, images, copy, or fonts are used here, and the
typography, colour system, accent mechanic, and section content are original
to this project. Its commercial typefaces (PP Neue Montreal and ATK Studio
Tiposka) are not used anywhere in this codebase; this site's two OFL fonts are
listed above.

---

## Everything else

No other third-party assets are used. Specifically:

- **Photography.** The hero portrait and the WolfCafe and NoirMore preview
  screenshots in `frontend/public/images/` are the site owner's own photo and
  own deployed applications, re-encoded for the web with metadata stripped.
- **The WebGL scene in the footer.** `frontend/public/scene/ff7-scene.bin` is
  geometry from the site owner's own CSC 461 (Computer Graphics) rasterization
  assignment - a triangle-mesh approximation of a Final Fantasy VII background,
  built for that class, not a third-party asset. See the comment at the top of
  `SceneStrip.jsx` for how it was converted.
- **No icon package, icon font, or sprite sheet.** The handful of hairline
  icons are hand-authored SVG paths in `frontend/src/components/ui/Icon.jsx`.
  The favicon, the Open Graph image, and the project schematics are likewise
  hand-authored SVG or CSS in this repository.
- **No UI or CSS framework.** All styling is written for this project.
- **No animation or 3D library.** Motion is `IntersectionObserver` plus CSS
  transitions; the footer scene is raw WebGL with a few dozen lines of
  hand-written matrix math, not three.js or a similar dependency.

Runtime dependencies are React and React DOM for the frontend, and Flask,
flask-cors, requests, Gunicorn, and python-dotenv for the optional backend.
