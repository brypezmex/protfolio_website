import { useInView } from '../../hooks/useInView.js';
import { cn } from '../../utils/cn.js';
import './MaskLines.css';

/**
 * Large type that rises into place line by line, each line clipped by its own
 * mask so the text appears to slide up out of the baseline.
 *
 * Lines are authored explicitly rather than measured at runtime. Splitting
 * text into rendered lines needs layout reads on every resize and breaks the
 * moment a font loads late; an authored line that happens to wrap on a narrow
 * screen still animates correctly because its mask wraps with it.
 *
 * Render inside the heading element - this is not a heading itself.
 *
 * @param {object} props
 * @param {string[]} props.lines copy for each line
 * @param {number} [props.mutedFrom] lines from this index on are set in grey,
 *   for a heading that reads as a statement plus an aside
 * @param {number} [props.delay=0] ms before the first line moves
 * @param {number} [props.stagger=90] ms between lines
 * @param {boolean} [props.immediate] animate on mount instead of on scroll,
 *   for text that is already on screen at load
 */
export function MaskLines({
  lines,
  mutedFrom,
  delay = 0,
  stagger = 90,
  immediate = false,
  className,
}) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const visible = immediate || inView;

  return (
    <span ref={ref} className={cn('mask-lines', visible && 'is-visible', className)}>
      {lines.map((line, index) => (
        <span
          className={cn('mask-line', mutedFrom != null && index >= mutedFrom && 'mask-line--muted')}
          key={line}
        >
          {/* A real space between lines, so the accessible text does not run
              two lines together when they are read as one. */}
          {index > 0 ? ' ' : null}
          <span
            className="mask-line__inner"
            style={{ '--mask-delay': `${delay + index * stagger}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}

export default MaskLines;
