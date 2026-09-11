import { useEffect, useState } from 'react';

/**
 * Subscribes to a CSS media query.
 *
 * @param {string} query e.g. '(max-width: 860px)'
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const list = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);

    setMatches(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/**
 * True when the visitor has asked for reduced motion.
 *
 * CSS already neutralizes every transition (see tokens.css). This hook exists
 * for motion that CSS cannot reach, such as a script-driven animation loop,
 * which must not run at all rather than run invisibly.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export default useMediaQuery;
