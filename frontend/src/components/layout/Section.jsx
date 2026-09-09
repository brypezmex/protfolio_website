import { cn } from '../../utils/cn.js';
import './Section.css';

/**
 * Top-level page section.
 *
 * Renders a real <section> landmark labelled by its own heading, which gives
 * screen reader users a usable document outline and makes the nav's anchors
 * land on meaningful regions.
 *
 * @param {object} props
 * @param {string} props.id anchor target; must match data/navigation.js
 * @param {boolean} [props.flush] removes the top padding for sections that
 *   follow one another closely
 */
export function Section({ id, className, children, flush = false, ...rest }) {
  return (
    <section
      id={id}
      className={cn('section', flush && 'section--flush', className)}
      aria-labelledby={`${id}-title`}
      {...rest}
    >
      <div className="shell above">{children}</div>
    </section>
  );
}

export default Section;
