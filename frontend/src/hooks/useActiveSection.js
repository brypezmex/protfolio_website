import { useEffect, useState } from 'react';

/**
 * Scroll-spy for the navigation active indicator.
 *
 * A single IntersectionObserver watches every section at once and keeps a map
 * of intersection ratios, then picks the most visible section. This is both
 * cheaper and more stable than a scroll handler comparing offsets, which tends
 * to flicker between neighbours at section boundaries.
 *
 * @param {string[]} sectionIds ids of the elements to observe
 * @returns {string} id of the section currently considered active
 */
export function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const ratios = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestId = '';
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestId = id;
            bestRatio = ratio;
          }
        }

        // Keep the previous value when nothing intersects (e.g. mid-fling), so
        // the indicator never blanks out.
        if (bestId) setActiveId(bestId);
      },
      {
        // Ignore the strip hidden behind the fixed nav when deciding what is
        // "on screen".
        rootMargin: '-72px 0px -45% 0px',
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}

export default useActiveSection;
