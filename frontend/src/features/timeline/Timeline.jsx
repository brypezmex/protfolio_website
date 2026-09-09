import { useMemo } from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress.js';
import { TimelineEntry } from './TimelineEntry.jsx';
import './timeline.css';

/**
 * Group entries by calendar year, preserving the incoming (chronological)
 * order. Years become sticky markers in the gutter on wide screens and
 * full-width dividers on narrow ones.
 *
 * @param {Array} entries
 * @returns {{year: string, entries: Array}[]}
 */
function groupByYear(entries) {
  const groups = [];

  for (const entry of entries) {
    const year = entry.start.slice(0, 4);
    const last = groups[groups.length - 1];

    if (last && last.year === year) last.entries.push(entry);
    else groups.push({ year, entries: [entry] });
  }

  return groups;
}

/**
 * The vertical timeline.
 *
 * The rail's fill height is driven by a CSS custom property that
 * useScrollProgress writes on every animation frame. Keeping that value out of
 * React state is what makes the rail track the scroll smoothly - a state update
 * per frame would re-render every entry on the page.
 *
 * @param {object} props
 * @param {Array} props.entries already-filtered timeline entries
 */
export function Timeline({ entries }) {
  const railRef = useScrollProgress('--progress');
  const groups = useMemo(() => groupByYear(entries), [entries]);

  if (entries.length === 0) {
    return (
      <p className="tl-empty">No entries in this category.</p>
    );
  }

  return (
    <div className="timeline" ref={railRef}>
      <div className="timeline__rail" aria-hidden="true">
        <span className="timeline__rail-fill" />
      </div>

      <ol className="timeline__groups">
        {groups.map((group) => (
          <li className="tl-group" key={group.year}>
            <p className="tl-group__year" aria-hidden="true">
              {group.year}
            </p>

            <ol className="tl-group__entries">
              {group.entries.map((entry) => (
                <TimelineEntry entry={entry} key={entry.id} />
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Timeline;
