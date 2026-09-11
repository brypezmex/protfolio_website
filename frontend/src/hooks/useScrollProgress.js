import { useEffect, useRef } from 'react';

/**
 * Tracks how far the reader has scrolled through an element and writes the
 * result to a CSS custom property on that element.
 *
 * Deliberately does not use React state. Progress changes on every frame of a
 * scroll; routing that through setState would re-render the tracked subtree
 * dozens of times per second. Writing a custom property instead lets CSS drive
 * the effect (the hero's photo zoom) with no React involvement at all.
 *
 * The scroll listener is passive and rAF-throttled, so at most one layout read
 * happens per frame regardless of how many scroll events fire.
 *
 * @param {string} [property='--progress'] custom property to write (0 to 1)
 * @param {object} [options]
 * @param {number} [options.anchor=0.55] where in the viewport, as a fraction of
 *   its height, the progress line sits. 0 measures from the top edge, so an
 *   element that starts at the top of the page reads 0 at load and 1 once it
 *   has scrolled fully out of view.
 * @returns {React.RefObject<HTMLElement>} attach to the element being tracked
 */
export function useScrollProgress(property = '--progress', { anchor = 0.55 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return undefined;

    let frame = 0;

    const measure = () => {
      frame = 0;

      const rect = el.getBoundingClientRect();
      const viewportAnchor = window.innerHeight * anchor;

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

    // The tracked element can change height without the window resizing (late
    // font loads, filtered lists). Without this the value would stay stale
    // until the next scroll.
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    observer?.observe(el);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer?.disconnect();
    };
  }, [property, anchor]);

  return ref;
}

export default useScrollProgress;
