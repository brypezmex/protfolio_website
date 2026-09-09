import { timelineCategories } from '../../data/timeline.js';
import { cn } from '../../utils/cn.js';

/**
 * Category filter chips for the timeline.
 *
 * Implemented as a radio group rather than a row of buttons so that keyboard
 * users get arrow-key navigation between options and screen readers announce
 * the selected state - both of which come free with the role.
 *
 * @param {object} props
 * @param {string} props.value active category id
 * @param {(id: string) => void} props.onChange
 * @param {Record<string, number>} props.counts entries per category
 */
export function TimelineFilters({ value, onChange, counts }) {
  return (
    <div className="tl-filters" role="radiogroup" aria-label="Filter timeline by category">
      {timelineCategories.map((category) => {
        const active = category.id === value;
        const count = counts[category.id] ?? 0;

        return (
          <button
            key={category.id}
            type="button"
            role="radio"
            aria-checked={active}
            className={cn('tl-filter notched--sm', active && 'is-active')}
            onClick={() => onChange(category.id)}
            disabled={count === 0}
          >
            {category.label}
            <span className="tl-filter__count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

export default TimelineFilters;
