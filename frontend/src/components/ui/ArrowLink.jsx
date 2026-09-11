import { cn } from '../../utils/cn.js';
import { Icon } from './Icon.jsx';
import { Roll } from './Roll.jsx';
import './ArrowLink.css';

/**
 * The site's one action style: an arrow and a label that fill white on hover.
 *
 * Renders an anchor when `href` is present and a button otherwise, so the
 * semantics always match the behaviour. Children must be plain text (see Roll).
 *
 * @param {object} props
 * @param {string} [props.href] renders an <a> when set
 * @param {boolean} [props.external] opens in a new tab and says so to screen
 *   readers
 * @param {string} [props.icon] Icon name; defaults to an arrow that points
 *   out of the page for external links and along it otherwise
 * @param {'md'|'sm'} [props.size='md']
 */
export function ArrowLink({
  href,
  external = false,
  icon,
  size = 'md',
  className,
  children,
  ...rest
}) {
  const classes = cn('arrow-link', `arrow-link--${size}`, 'roll-trigger', className);
  const content = (
    <>
      <Icon name={icon ?? (external ? 'arrowUpRight' : 'arrowRight')} className="arrow-link__icon" />
      <Roll>{children}</Roll>
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </>
  );

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={classes} type="button" {...rest}>
      {content}
    </button>
  );
}

export default ArrowLink;
