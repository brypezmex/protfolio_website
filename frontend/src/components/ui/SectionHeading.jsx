import { sectionsById } from '../../data/navigation.js';
import { MaskLines } from './MaskLines.jsx';
import { Reveal } from './Reveal.jsx';
import { Rule } from './Rule.jsx';
import './SectionHeading.css';

/**
 * The divider and "[ 02 ] Projects" marker that opens every section.
 *
 * Its text is the section's accessible name (see Section), so the index and
 * label come from the section registry rather than being passed in - the nav,
 * the landmark, and the marker can never disagree.
 *
 * @param {object} props
 * @param {string} props.id section id from data/navigation.js
 */
export function SectionEyebrow({ id }) {
  const section = sectionsById[id];

  return (
    <div className="eyebrow">
      <Rule />
      <p className="eyebrow__text" id={`${id}-label`}>
        <span className="index" aria-hidden="true">
          [ <span className="index__num">{section?.index}</span> ]
        </span>
        <span>{section?.label}</span>
      </p>
    </div>
  );
}

/**
 * Heading block for a top-level section: a large statement across the full
 * width, then a supporting paragraph and any actions in the right-hand column.
 *
 * Always renders an <h2>; the hero owns the page's single <h1>.
 *
 * @param {object} props
 * @param {string} props.id section id; also used for the heading's id
 * @param {string[]} props.title one string per line, `{X}` for accent letters
 * @param {string} [props.lede] supporting paragraph
 * @param {React.ReactNode} [props.children] extra content under the lede
 * @param {React.ReactNode} [props.actions] ArrowLinks, rendered last in a row
 */
export function SectionHeading({ id, title, lede, actions, children }) {
  const hasAside = Boolean(lede || children || actions);

  return (
    <header className="section-heading">
      <SectionEyebrow id={id} />

      <div className="section-heading__grid">
        <h2 className="section-heading__title" id={`${id}-title`}>
          <MaskLines lines={title} />
        </h2>

        {hasAside ? (
          <div className="section-heading__aside">
            {lede ? (
              <Reveal delay={160}>
                <p className="section-heading__lede">{lede}</p>
              </Reveal>
            ) : null}
            {children}
            {actions ? (
              <Reveal className="section-heading__actions" delay={240}>
                {actions}
              </Reveal>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default SectionHeading;
