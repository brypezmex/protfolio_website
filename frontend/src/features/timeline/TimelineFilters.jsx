import { useRef } from 'react';
import { timelineCategories } from '../../data/timeline.js';
import { Roll } from '../../components/ui/Roll.jsx';
import { cn } from '../../utils/cn.js';

const NEXT_KEYS = new Set(['ArrowRight', 'ArrowDown']);
const PREV_KEYS = new Set(['ArrowLeft', 'ArrowUp']);

/**
 * Category filter for the timeline, set as a comma-separated run of words.
 *
 * A radio group rather than a row of buttons, so screen readers announce the
 * selected state and the group is a single tab stop: Tab lands on the active
 * option and the arrow keys move the selection, skipping empty categories.
 *
 * @param {object} props
 * @param {string} props.value active category id
 * @param {(id: string) => void} props.onChange
 * @param {Record<string, number>} props.counts entries per category
 */
export function TimelineFilters({ value, onChange, counts }) {
  const buttonsRef = useRef({});

  const enabled = timelineCategories.filter((category) => (counts[category.id] ?? 0) > 0);

  const onKeyDown = (event) => {
    const step = NEXT_KEYS.has(event.key) ? 1 : PREV_KEYS.has(event.key) ? -1 : 0;
    if (!step) return;

    event.preventDefault();
    const current = enabled.findIndex((category) => category.id === value);
    const next = enabled[(current + step + enabled.length) % enabled.length];
    onChange(next.id);
    buttonsRef.current[next.id]?.focus();
  };

  return (
    <div
      className="tl-filters"
      role="radiogroup"
      aria-label="Filter timeline by category"
      onKeyDown={onKeyDown}
    >
      {timelineCategories.map((category, index) => {
        const active = category.id === value;
        const count = counts[category.id] ?? 0;

        return [
          <button
            key={category.id}
            ref={(node) => {
              buttonsRef.current[category.id] = node;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            className={cn('tl-filter', 'roll-trigger', active && 'is-active')}
            onClick={() => onChange(category.id)}
            disabled={count === 0}
          >
            <Roll>{category.label}</Roll>
            <span className="tl-filter__count">{count}</span>
          </button>,
          index < timelineCategories.length - 1 ? (
            <span className="tl-filters__comma" aria-hidden="true" key={`${category.id}-comma`}>
              ,
            </span>
          ) : null,
        ];
      })}
    </div>
  );
}

export default TimelineFilters;
