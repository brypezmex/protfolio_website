import { ArrowLink } from '../../components/ui/ArrowLink.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { cn } from '../../utils/cn.js';
import { projectLinkItems } from './projectLinkItems.js';

/**
 * A project's source and write-up links, as a row of ArrowLinks.
 *
 * @param {object} props
 * @param {object} props.project
 * @param {'row'|'detail'} [props.variant='row']
 */
export function ProjectLinks({ project, variant = 'row' }) {
  const items = projectLinkItems(project);
  if (items.length === 0) return null;

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
              <span className="plink-pending__note">{item.note}</span>
            </span>
          </li>
        ),
      )}
    </ul>
  );
}

export default ProjectLinks;
