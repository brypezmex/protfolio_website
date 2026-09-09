import { useEffect, useRef } from 'react';
import './ScrollProgressBar.css';

/**
 * Thin page-progress bar pinned under the navigation.
 *
 * Writes a CSS variable on an rAF-throttled passive scroll listener and lets
 * CSS scale the bar, so reading position never causes a React render.
 */
export function ScrollProgressBar() {
  const barRef = useRef(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return undefined;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      el.style.setProperty('--scroll', Math.min(Math.max(progress, 0), 1).toFixed(4));
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return <div className="scroll-progress" ref={barRef} aria-hidden="true" />;
}

export default ScrollProgressBar;
