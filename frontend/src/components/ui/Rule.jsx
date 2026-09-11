import { Reveal } from './Reveal.jsx';
import { cn } from '../../utils/cn.js';

/** Full-width divider that draws itself in from the left when scrolled to. */
export function Rule({ className, delay }) {
  return (
    <Reveal
      as="span"
      variant="line"
      delay={delay}
      className={cn('rule', className)}
      aria-hidden="true"
    />
  );
}

export default Rule;
