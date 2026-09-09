import { Reveal } from './Reveal.jsx';
import { PixelIcon } from './PixelIcon.jsx';
import './SectionHeading.css';

/**
 * Heading block for every top-level section.
 *
 * The hierarchy is deliberately flat: the heading is the section's name, in the
 * pixel display face, with a plain descriptive line under it. An earlier
 * version put a large marketing-style sentence in the h2 with the section name
 * demoted to a small eyebrow - that reads as a landing page act rather than a
 * labelled section of a portfolio.
 *
 * Always renders an <h2>; sections carry the landmark role, so the document
 * keeps a single h1 (the hero) and a flat, predictable h2 outline.
 *
 * @param {object} props
 * @param {string} props.index two-digit section number, e.g. '02'
 * @param {string} props.title the section's name
 * @param {string} [props.lede] one plain sentence describing the section
 * @param {string} [props.icon] pixel icon name shown beside the title
 * @param {string} props.id used to associate the section with its heading
 */
export function SectionHeading({ index, title, lede, icon, id }) {
  return (
    <header className="section-heading">
      <Reveal className="section-heading__rule-row" variant="fade">
        <span className="section-heading__index">{index}</span>
        <span className="section-heading__rule" aria-hidden="true" />
      </Reveal>

      <Reveal delay={60}>
        <h2 className="section-heading__title" id={`${id}-title`}>
          {icon ? (
            <PixelIcon name={icon} size={24} className="section-heading__icon" />
          ) : null}
          {title}
        </h2>
      </Reveal>

      {lede ? (
        <Reveal delay={120}>
          <p className="section-heading__lede">{lede}</p>
        </Reveal>
      ) : null}
    </header>
  );
}

export default SectionHeading;
