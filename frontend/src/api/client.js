/**
 * Thin fetch wrapper for the optional Flask backend.
 *
 * Every backend feature is progressive enhancement, so the contract here is:
 * requests time out quickly, failures reject with a typed error, and callers
 * are expected to degrade rather than surface a broken UI.
 */

import { siteConfig } from '../config/site.js';

const DEFAULT_TIMEOUT_MS = 8000;

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'api_error' } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

function buildUrl(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.apiBaseUrl}${normalized}`;
}

/**
 * Perform a JSON request against the backend.
 *
 * @param {string} path e.g. '/api/health'
 * @param {object} [options]
 * @param {'GET'|'POST'} [options.method='GET']
 * @param {unknown} [options.body] serialized as JSON when present
 * @param {AbortSignal} [options.signal] caller-owned cancellation
 * @param {number} [options.timeoutMs]
 * @returns {Promise<any>}
 */
export async function apiRequest(
  path,
  { method = 'GET', body, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = {},
) {
  if (!siteConfig.backendEnabled) {
    throw new ApiError('Backend disabled by configuration', { code: 'disabled' });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // Fold a caller-provided signal into our timeout controller so either can
  // cancel the request.
  const onExternalAbort = () => controller.abort();
  signal?.addEventListener('abort', onExternalAbort);

  try {
    const response = await fetch(buildUrl(path), {
      method,
      signal: controller.signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ApiError(payload?.error ?? `Request failed (${response.status})`, {
        status: response.status,
        code: payload?.code ?? 'http_error',
      });
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error?.name === 'AbortError') {
      throw new ApiError('Request timed out', { code: 'timeout' });
    }
    throw new ApiError('Network error', { code: 'network' });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onExternalAbort);
  }
}

/**
 * Read the backend's public capability descriptor. Used to decide which
 * optional features to render.
 */
export function fetchBackendConfig(signal) {
  return apiRequest('/api/config', { signal, timeoutMs: 4000 });
}
