import { cloneElement, isValidElement } from 'react';
import { useInView } from '../../hooks/useInView.js';
import { cn } from '../../utils/cn.js';
import './Reveal.css';

/**
 * Reveals its children when they scroll into view.
 *
 * The animation is pure CSS - this component only toggles a class - so the
 * transition runs on the compositor (transform + opacity only) and costs
 * nothing on the main thread. `prefers-reduced-motion` zeroes the duration via
 * the --motion-scale token, so reduced-motion visitors see content appear
 * instantly rather than never.
 *
 * @param {object} props
 * @param {React.ElementType} [props.as='div'] element to render
 * @param {number} [props.delay=0] stagger offset in ms
 * @param {'up'|'fade'|'left'} [props.variant='up']
 * @param {boolean} [props.asChild] apply the reveal classes to the single child
 *   element instead of wrapping it, for cases where an extra div would break
 *   the parent's grid or flex layout
 */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  variant = 'up',
  asChild = false,
  className,
  children,
  ...rest
}) {
  const [ref, inView] = useInView();

  const classes = cn('reveal', `reveal--${variant}`, inView && 'is-visible', className);
  const style = delay ? { '--reveal-delay': `${delay}ms` } : undefined;

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ref,
      className: cn(children.props.className, classes),
      style: { ...children.props.style, ...style },
    });
  }

  return (
    <Tag ref={ref} className={classes} style={style} {...rest}>
      {children}
    </Tag>
  );
}

export default Reveal;
