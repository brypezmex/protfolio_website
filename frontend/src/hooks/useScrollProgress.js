import { useEffect, useRef } from 'react';

/**
 * Tracks how far the reader has scrolled through an element and writes the
 * result to a CSS custom property on that element.
 *
 * Deliberately does not use React state. Progress changes on every frame of a
 * scroll; routing that through setState would re-render the timeline dozens of
 * times per second. Writing `--progress` instead lets CSS animate the rail fill
 * with no React involvement at all.
 *
 * The scroll listener is passive and rAF-throttled, so at most one layout read
 * happens per frame regardless of how many scroll events fire.
 *
 * @param {string} [property='--progress'] custom property to write (0 to 1)
 * @returns {React.RefObject<HTMLElement>} attach to the element being tracked
 */
export function useScrollProgress(property = '--progress') {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return undefined;

    let frame = 0;

    const measure = () => {
      frame = 0;

      const rect = el.getBoundingClientRect();
      const viewportAnchor = window.innerHeight * 0.55;

      // 0 when the anchor line reaches the top of the element, 1 when it
      // reaches the bottom.
      const travelled = viewportAnchor - rect.top;
      const total = rect.height || 1;
      const progress = Math.min(Math.max(travelled / total, 0), 1);

      el.style.setProperty(property, progress.toFixed(4));
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    // The tracked element can change height without the window resizing - the
    // timeline does exactly that when a category filter is applied. Without
    // this the fill would stay at its pre-filter length until the next scroll.
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    observer?.observe(el);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer?.disconnect();
    };
  }, [property]);

  return ref;
}

export default useScrollProgress;
