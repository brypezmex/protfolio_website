import { resolveProjectLinks } from '../../config/site.js';
import { PixelIcon } from '../../components/ui/PixelIcon.jsx';
import { cn } from '../../utils/cn.js';

/**
 * Outbound links for a project.
 *
 * A link that has not been configured yet renders as a visibly inert chip
 * rather than disappearing or pointing at '#'. That keeps the card layout
 * stable as real URLs are filled in, and tells a visitor that the repository
 * exists but is not published yet instead of silently doing nothing.
 *
 * @param {object} props
 * @param {object} props.project
 * @param {'card'|'detail'} [props.variant='card']
 */
export function ProjectLinks({ project, variant = 'card' }) {
  const links = resolveProjectLinks(project);

  const items = [
    { key: 'github', label: 'Source', glyph: 'github', url: links.github },
    { key: 'demo', label: 'Live demo', glyph: 'externalLink', url: links.demo },
  ];

  return (
    <ul className={cn('plinks', `plinks--${variant}`)}>
      {items.map((item) =>
        item.url ? (
          <li key={item.key}>
            <a
              className="plink"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PixelIcon name={item.glyph} size={16} />
              {item.label}
              <span className="sr-only"> for {project.name} (opens in a new tab)</span>
            </a>
          </li>
        ) : (
          <li key={item.key}>
            <span className="plink plink--pending" aria-disabled="true">
              <PixelIcon name={item.glyph} size={16} />
              {item.label}
              <span className="plink__note">soon</span>
            </span>
          </li>
        ),
      )}
    </ul>
  );
}

export default ProjectLinks;
