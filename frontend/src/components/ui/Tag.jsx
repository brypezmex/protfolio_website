import { cn } from '../../utils/cn.js';
import './Tag.css';

/**
 * Small monospace chip for technologies and metadata.
 *
 * @param {object} props
 * @param {'default'|'accent'|'quiet'} [props.tone='default']
 */
export function Tag({ tone = 'default', className, children, ...rest }) {
  return (
    <span className={cn('tag', `tag--${tone}`, className)} {...rest}>
      {children}
    </span>
  );
}

/** Convenience wrapper for rendering a list of technology strings. */
export function TagList({ items, tone, className, label }) {
  if (!items?.length) return null;

  return (
    <ul className={cn('tag-list', className)} aria-label={label}>
      {items.map((item) => (
        <li key={item}>
          <Tag tone={tone}>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}

export default Tag;
