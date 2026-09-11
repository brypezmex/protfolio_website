import { useEffect, useState } from 'react';
import { siteConfig } from '../config/site.js';
import { fetchBackendConfig } from '../api/client.js';

/**
 * Feature-detects the optional Flask backend exactly once per page load.
 *
 * The site is designed to be fully usable as a static build, so this never
 * blocks rendering and never surfaces an error. If the request fails - backend
 * not deployed, offline, disabled - every backend-dependent feature simply
 * stays hidden.
 *
 * @returns {{ ready: boolean, online: boolean, features: Record<string, boolean> }}
 */
const OFFLINE = { ready: true, online: false, features: {} };
const PENDING = { ready: false, online: false, features: {} };

export function useBackendConfig() {
  const [state, setState] = useState(siteConfig.backendEnabled ? PENDING : OFFLINE);

  useEffect(() => {
    if (!siteConfig.backendEnabled) return undefined;

    let cancelled = false;

    fetchBackendConfig()
      .then((config) => {
        if (cancelled) return;
        setState({
          ready: true,
          online: true,
          features: config?.features ?? {},
        });
      })
      .catch(() => {
        if (!cancelled) setState(OFFLINE);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export default useBackendConfig;
