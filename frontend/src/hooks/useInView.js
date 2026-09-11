import { useEffect, useRef, useState } from 'react';

/**
 * Reports whether an element has entered the viewport.
 *
 * Uses IntersectionObserver rather than a scroll handler so the browser does
 * the work off the main thread. By default the observer disconnects after the
 * first intersection, because reveal animations only need to fire once.
 *
 * @param {object} [options]
 * @param {number|number[]} [options.threshold=0.15]
 * @param {string} [options.rootMargin='0px 0px -12% 0px'] Fires slightly before
 *   the element reaches the bottom edge, so content is settled by the time the
 *   reader looks at it.
 * @param {boolean} [options.once=true]
 * @returns {[React.RefObject<HTMLElement>, boolean]}
 */
export function useInView({
  threshold = 0.15,
  rootMargin = '0px 0px -12% 0px',
  once = true,
} = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // Environments without IntersectionObserver get the visible state directly
    // rather than content that never reveals.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}

export default useInView;
