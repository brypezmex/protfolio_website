import { useMemo } from 'react';
import { TimelineEntry } from './TimelineEntry.jsx';
import './timeline.css';

/**
 * Group entries by calendar year, preserving the incoming (chronological)
 * order. Years become sticky markers in the left column on wide screens and
 * headings above their entries on narrow ones.
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
 * The timeline: one block per year, each a stack of ruled entries.
 *
 * @param {object} props
 * @param {Array} props.entries already-filtered timeline entries
 */
export function Timeline({ entries }) {
  const groups = useMemo(() => groupByYear(entries), [entries]);

  if (entries.length === 0) {
    return <p className="tl-empty">No entries in this category.</p>;
  }

  return (
    <ol className="timeline">
      {groups.map((group) => (
        <li className="tl-group" key={group.year}>
          {/* Hidden from assistive tech: every entry already states its
              period in full, so the year here is purely a visual marker. */}
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
  );
}

export default Timeline;
