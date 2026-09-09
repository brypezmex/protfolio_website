import { pixelIcons, ICON_VIEWBOX } from './pixelIcons.js';
import { cn } from '../../utils/cn.js';
import './PixelIcon.css';

/**
 * Sizes an icon may render at.
 *
 * These are not arbitrary. The artwork is drawn on a 24-unit grid, so the
 * rendered size decides whether a grid unit lands on a whole device pixel or
 * between two of them. Below about 16px the thinner strokes fall into the gaps
 * and the icons visibly turn to mush - they were compared side by side at
 * 12/16/20/24/32 before this list was fixed. 16 is the floor, 20 and 24 are
 * where they look genuinely crisp.
 */
const SIZE_STEPS = [16, 20, 24, 32, 48, 64, 128];

/** Snap to the nearest allowed step so no caller can quietly blur an icon. */
function snapSize(requested) {
  return SIZE_STEPS.reduce((best, step) =>
    Math.abs(step - requested) < Math.abs(best - requested) ? step : best,
  );
}

/**
 * Renders a pixel-art icon.
 *
 * Icons are inlined SVG path data (see pixelIcons.js) rather than image files,
 * so they inherit `currentColor`, cost no network request, and need no sprite.
 * `shape-rendering="crispEdges"` preserves the hard pixel corners instead of
 * anti-aliasing them into a blur.
 *
 * Decorative by default. Pass `title` only when the icon carries meaning that
 * is not already available as adjacent text.
 *
 * @param {object} props
 * @param {keyof typeof pixelIcons} props.name
 * @param {number} [props.size=20] px; snapped to the nearest value in SIZE_STEPS
 * @param {string} [props.title] accessible name; omit for decorative use
 * @param {string} [props.className]
 */
export function PixelIcon({ name, size = 20, title, className, ...rest }) {
  const paths = pixelIcons[name];
  const rendered = snapSize(size);

  if (!paths) {
    // A typo in an icon name should be visible in development, not a silent
    // gap in the layout.
    if (import.meta.env.DEV) {
      console.warn(`PixelIcon: unknown icon "${name}"`);
    }
    return null;
  }

  const decorative = !title;

  return (
    <svg
      className={cn('pixel-icon', className)}
      viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      width={rendered}
      height={rendered}
      fill="currentColor"
      shapeRendering="crispEdges"
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

export default PixelIcon;
