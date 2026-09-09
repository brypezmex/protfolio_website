import { cn } from '../../utils/cn.js';
import './Button.css';

/**
 * Action element. Renders an anchor when `href` is present and a button
 * otherwise, so semantics always match behaviour.
 *
 * @param {object} props
 * @param {'primary'|'outline'|'ghost'} [props.variant='primary']
 * @param {'md'|'sm'} [props.size='md']
 * @param {string} [props.href] renders an <a> when set
 * @param {boolean} [props.external] adds target/rel for off-site links
 */
export function Button({
  variant = 'primary',
  size = 'md',
  href,
  external = false,
  className,
  children,
  ...rest
}) {
  const classes = cn('btn', `btn--${variant}`, `btn--${size}`, 'notched--sm', className);

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        {...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : null)}
        {...rest}
      >
        <span className="btn__label">{children}</span>
      </a>
    );
  }

  return (
    <button className={classes} type="button" {...rest}>
      <span className="btn__label">{children}</span>
    </button>
  );
}

export default Button;
