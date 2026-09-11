import { cn } from '../../utils/cn.js';
import './Section.css';

/**
 * Top-level page section.
 *
 * Renders a real <section> landmark labelled by its short name from the
 * section registry ("Projects"), not by its display heading - the headings
 * are statements, and a screen reader's landmark list should read as a list
 * of places. SectionHeading / SectionEyebrow render the element that carries
 * that `${id}-label` id.
 *
 * @param {object} props
 * @param {string} props.id anchor target; must match data/navigation.js
 */
export function Section({ id, className, children, ...rest }) {
  return (
    <section
      id={id}
      className={cn('section', className)}
      aria-labelledby={`${id}-label`}
      {...rest}
    >
      <div className="shell">{children}</div>
    </section>
  );
}

export default Section;
