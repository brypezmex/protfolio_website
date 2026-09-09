import { apiRequest } from './client.js';

/**
 * GitHub repository metadata, proxied through the backend.
 *
 * The proxy exists so the GitHub token stays server-side and so responses can
 * be cached once for all visitors instead of every browser burning its own
 * anonymous rate limit.
 *
 * @param {AbortSignal} [signal]
 * @returns {Promise<Record<string, {stars:number, language:string|null, pushedAt:string|null, url:string}>>}
 *   keyed by project id
 */
export async function fetchRepoStats(signal) {
  const payload = await apiRequest('/api/github/repos', { signal });
  return payload?.repos ?? {};
}

/**
 * Liveness of the deployed project demos.
 *
 * The browser cannot probe an arbitrary origin (CORS), and it should not learn
 * the home server's address anyway - so the backend resolves each project's
 * `service.key` to a URL from its own environment, probes it, and returns only
 * a status string.
 *
 * @param {AbortSignal} [signal]
 * @returns {Promise<Record<string, 'online'|'offline'|'unconfigured'>>} keyed by service key
 */
export async function fetchServiceStatus(signal) {
  const payload = await apiRequest('/api/projects/status', { signal });
  return payload?.services ?? {};
}
