/**
 * Generates src/components/ui/pixelIcons.js from the pixelarticons package.
 *
 * Why generate rather than import at runtime:
 *
 * - The site needs about twenty icons out of 1,036. Inlining just those keeps
 *   the shipped payload to a few hundred bytes and adds no runtime dependency.
 * - The generated file records where every path came from, so the icon set is
 *   traceable to its source and regenerable rather than a pile of mystery SVG.
 *
 * Run after changing ICONS below, or after upgrading pixelarticons:
 *
 *     npm run build:icons
 *
 * Source: pixelarticons by Gerrit Halfmann, MIT licensed.
 * https://github.com/halfmage/pixelarticons
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const SVG_DIR = join(here, '..', 'node_modules', 'pixelarticons', 'svg');
const OUT = join(here, '..', 'src', 'components', 'ui', 'pixelIcons.js');

/** Local name -> pixelarticons filename. Keep this list minimal. */
const ICONS = {
  // Identity and navigation
  terminal: 'terminal.svg',
  menu: 'menu.svg',
  close: 'close.svg',
  chevronRight: 'chevron-right.svg',
  download: 'download.svg',

  // Section markers
  user: 'users.svg',
  clock: 'clock.svg',
  code: 'code.svg',
  briefcase: 'briefcase.svg',
  mail: 'mail.svg',
  zap: 'zap.svg',

  // Timeline entry types
  book: 'book-open.svg',
  teach: 'teach.svg',
  users: 'users.svg',

  // Skill groups
  package: 'package.svg',
  database: 'database.svg',

  // Projects
  search: 'search.svg',
  coffee: 'coffee.svg',
  github: 'github.svg',
  externalLink: 'external-link.svg',
  gitBranch: 'git-branch.svg',

  // Contact
  phone: 'phone.svg',
  link: 'link.svg',
  fileText: 'file-text.svg',
};

function extractPaths(svg) {
  return [...svg.matchAll(/\sd="([^"]+)"/g)].map((match) => match[1]);
}

const entries = [];
const missing = [];

for (const [name, file] of Object.entries(ICONS)) {
  const path = join(SVG_DIR, file);
  if (!existsSync(path)) {
    missing.push(file);
    continue;
  }

  const paths = extractPaths(readFileSync(path, 'utf8'));
  if (paths.length === 0) {
    missing.push(`${file} (no path data)`);
    continue;
  }

  entries.push({ name, file, paths });
}

if (missing.length > 0) {
  console.error('Missing or unusable icons:\n  ' + missing.join('\n  '));
  process.exit(1);
}

const body = entries
  .map(({ name, file, paths }) => {
    const rendered = paths.map((d) => `    '${d}',`).join('\n');
    return `  // ${file}\n  ${name}: [\n${rendered}\n  ],`;
  })
  .join('\n\n');

const output = `/**
 * Pixel icon path data. GENERATED FILE - do not edit by hand.
 *
 * Regenerate with \`npm run build:icons\` after editing scripts/build-icons.mjs.
 *
 * Source: pixelarticons by Gerrit Halfmann, released under the MIT License.
 * https://github.com/halfmage/pixelarticons
 * The full licence text is kept at src/components/ui/pixelarticons-LICENSE.txt
 * and the attribution is recorded in ATTRIBUTIONS.md.
 *
 * All icons are drawn on a 24x24 grid. Each entry is the list of path \`d\`
 * strings for that icon.
 */

export const ICON_VIEWBOX = 24;

export const pixelIcons = {
${body}
};

export default pixelIcons;
`;

writeFileSync(OUT, output, 'utf8');
console.log(`Wrote ${entries.length} icons to ${OUT}`);
