import { resolveProjectLinks } from '../../config/site.js';
import { ArrowLink } from '../../components/ui/ArrowLink.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { cn } from '../../utils/cn.js';

/**
 * Outbound links for a project.
 *
 * The live demo is reached through the project's preview screenshot (see
 * ProjectVisual in ProjectRow.jsx), so only the source link is listed here.
 *
 * A link that has not been configured yet renders as a visibly inert label
 * rather than disappearing or pointing at '#'. That keeps the layout stable as
 * real URLs are filled in, and tells a visitor that the repository exists but
 * is not published yet instead of silently doing nothing.
 *
 * @param {object} props
 * @param {object} props.project
 * @param {'row'|'detail'} [props.variant='row']
 */
export function ProjectLinks({ project, variant = 'row' }) {
  const links = resolveProjectLinks(project);

  const items = [{ key: 'github', label: 'Source', url: links.github }];

  return (
    <ul className={cn('plinks', `plinks--${variant}`)}>
      {items.map((item) =>
        item.url ? (
          <li key={item.key}>
            <ArrowLink
              href={item.url}
              external
              size="sm"
              aria-label={`${item.label} for ${project.name} (opens in a new tab)`}
            >
              {item.label}
            </ArrowLink>
          </li>
        ) : (
          <li key={item.key}>
            <span className="plink-pending" aria-disabled="true">
              <Icon name="arrowUpRight" className="plink-pending__icon" />
              {item.label}
              <span className="plink-pending__note">soon</span>
            </span>
          </li>
        ),
      )}
    </ul>
  );
}

export default ProjectLinks;
