/**
 * Runtime configuration.
 *
 * All environment reads live here so that no component touches import.meta.env
 * directly. Vite statically replaces `import.meta.env.VITE_*` at build time,
 * which is why the project override map below is written out explicitly rather
 * than built from a dynamic key - dynamic lookups are not guaranteed to survive
 * the production build.
 *
 * SECURITY: everything in this file is compiled into the browser bundle and is
 * publicly readable. Secrets belong in the backend's environment, never here.
 */

const env = import.meta.env;

/** Trim and normalize an env value, treating empty strings as unset. */
function read(value, fallback = '') {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed.length > 0 ? trimmed : fallback;
}

function readBool(value, fallback) {
  const trimmed = read(value);
  if (trimmed === '') return fallback;
  return trimmed.toLowerCase() === 'true' || trimmed === '1';
}

export const siteConfig = {
  /**
   * Base URL for API calls. Empty string means same-origin relative requests
   * (`/api/health`), which is the normal deployment shape behind nginx.
   */
  apiBaseUrl: read(env.VITE_API_BASE_URL).replace(/\/+$/, ''),

  /**
   * Hard off-switch for every backend-dependent feature. With this false the
   * app makes zero network requests and renders as a static portfolio.
   */
  backendEnabled: readBool(env.VITE_ENABLE_BACKEND, true),

  resumeUrl: read(env.VITE_RESUME_URL, '/resume/resume.pdf'),
};

/**
 * Per-project link overrides, applied on top of the placeholders in
 * data/projects.js.
 *
 * To add a project: add an entry here keyed by the project id, and add the
 * matching VITE_PROJECT_<ID>_GITHUB / _DEMO pair to .env.example.
 */
const projectLinkOverrides = {
  noirmore: {
    github: read(env.VITE_PROJECT_NOIRMORE_GITHUB),
    demo: read(env.VITE_PROJECT_NOIRMORE_DEMO),
  },
  wolfcafe: {
    github: read(env.VITE_PROJECT_WOLFCAFE_GITHUB),
    demo: read(env.VITE_PROJECT_WOLFCAFE_DEMO),
  },
};

/** A link is a placeholder when it is missing, empty, or the literal '#'. */
export function isPlaceholderLink(url) {
  return !url || url === '#';
}

/**
 * Resolve a project's outbound links: env override wins, then the value in
 * projects.js, then null.
 *
 * `source` describes the repository even when there is no URL to link to:
 * 'public' (github is a URL), 'pending' (not published yet), 'private' (exists
 * but stays private), or 'none' (the project has no repository).
 *
 * @param {{ id: string, links: { github?: string|null, demo?: string|null, devpost?: string|null } }} project
 * @returns {{ github: string|null, demo: string|null, devpost: string|null,
 *   source: 'public'|'pending'|'private'|'none' }}
 */
export function resolveProjectLinks(project) {
  const override = projectLinkOverrides[project.id] ?? {};
  const raw = (key) => read(override[key]) || project.links?.[key];
  const pick = (key) => {
    const value = raw(key);
    return isPlaceholderLink(value) || value === 'private' ? null : value;
  };

  const githubRaw = raw('github');
  let source = 'public';
  if (githubRaw === 'private') source = 'private';
  else if (githubRaw === null || githubRaw === undefined) source = 'none';
  else if (isPlaceholderLink(githubRaw)) source = 'pending';

  return { github: pick('github'), demo: pick('demo'), devpost: pick('devpost'), source };
}

export default siteConfig;
