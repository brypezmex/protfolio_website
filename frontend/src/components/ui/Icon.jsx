import { cn } from '../../utils/cn.js';

/**
 * Hairline icon set, drawn on a 24-unit grid with a single stroke weight.
 *
 * The set is intentionally tiny - arrows, a plus, a close mark - because the
 * design carries its character in type, not iconography. Paths are authored
 * here, so there is no icon package, no build step, and no licence to track.
 */
const ICONS = {
  arrowRight: ['M4 12h15', 'M13 6l6 6-6 6'],
  arrowUpRight: ['M7 17 17 7', 'M8 7h9v9'],
  arrowUp: ['M12 20V5', 'M6 11l6-6 6 6'],
  arrowDown: ['M12 4v15', 'M6 13l6 6 6-6'],
  plus: ['M12 4v16', 'M4 12h16'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  download: ['M12 4v11', 'M7 10l5 5 5-5', 'M5 20h14'],
  mail: ['M3 6h18v12H3z', 'M3 6l9 7 9-7'],
};

/**
 * Solid brand marks. Kept separate from the hairline set above because a
 * recognisable GitHub or LinkedIn glyph needs a filled shape, not a stroked
 * one - see the fill branch in Icon() below. Hand-authored, not pulled from
 * an icon package (see ATTRIBUTIONS.md).
 */
const FILLED_ICONS = {
  github:
    'M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.13-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.19 0 .31.21.67.8.56A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z',
  linkedin:
    'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM.75 8.98h4.24v14.52H.75V8.98Zm7.44 0h4.06v1.98h.06c.57-1.03 1.94-2.12 4-2.12 4.28 0 5.07 2.72 5.07 6.26v8.4h-4.24v-7.45c0-1.78-.03-4.06-2.51-4.06-2.52 0-2.9 1.92-2.9 3.92v7.59H8.19V8.98Z',
};

/**
 * Renders an icon that inherits the current text colour and, by default, the
 * current font size, so it scales with whatever label it sits beside.
 *
 * Decorative by default. Pass `title` only when the icon carries meaning that
 * is not already available as adjacent text.
 *
 * @param {object} props
 * @param {keyof typeof ICONS} props.name
 * @param {number|string} [props.size='1em']
 * @param {string} [props.title] accessible name; omit for decorative use
 */
export function Icon({ name, size = '1em', title, className, ...rest }) {
  const filledPath = FILLED_ICONS[name];
  const paths = ICONS[name];

  if (!filledPath && !paths) {
    if (import.meta.env.DEV) {
      console.warn(`Icon: unknown icon "${name}"`);
    }
    return null;
  }

  const decorative = !title;

  if (filledPath) {
    return (
      <svg
        className={cn('icon', 'icon--filled', className)}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        role={decorative ? 'presentation' : 'img'}
        aria-hidden={decorative || undefined}
        focusable="false"
        {...rest}
      >
        {title ? <title>{title}</title> : null}
        <path d={filledPath} />
      </svg>
    );
  }

  return (
    <svg
      className={cn('icon', className)}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export default Icon;
