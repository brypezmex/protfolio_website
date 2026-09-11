import { useInView } from '../../hooks/useInView.js';
import { getProject } from '../../data/projects.js';
import { useProjectDialog } from '../projects/useProjects.js';
import { ArrowLink } from '../../components/ui/ArrowLink.jsx';
import { TagList } from '../../components/ui/Tag.jsx';
import { cn } from '../../utils/cn.js';

const TYPE_LABEL = {
  education: 'Education',
  project: 'Project',
  research: 'Research',
  involvement: 'Involvement',
};

/**
 * A single timeline entry: type and dates, then the title beside the detail.
 *
 * Entries whose `projectId` resolves to a real project get a control that opens
 * the full project dialog, which is what ties the chronological view to the
 * project section without duplicating any content between them.
 */
export function TimelineEntry({ entry }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const { openProject } = useProjectDialog();
  const project = entry.projectId ? getProject(entry.projectId) : null;

  return (
    <li
      ref={ref}
      className={cn(
        'tl-entry',
        `tl-entry--${entry.type}`,
        entry.emphasis === 'major' && 'tl-entry--major',
        entry.status === 'upcoming' && 'tl-entry--upcoming',
        inView && 'is-visible',
      )}
    >
      <article className="tl-entry__card">
        <p className="tl-entry__meta">
          <span className="tl-entry__type">{TYPE_LABEL[entry.type]}</span>
          <span aria-hidden="true"> / </span>
          <span>{entry.periodLabel}</span>
        </p>

        <div className="tl-entry__main">
          <h3 className="tl-entry__title">{entry.title}</h3>

          {entry.org || entry.role ? (
            <p className="tl-entry__org">
              {entry.role ? <span className="tl-entry__role">{entry.role}</span> : null}
              {entry.role && entry.org ? <span aria-hidden="true">, </span> : null}
              {entry.org}
            </p>
          ) : null}
        </div>

        <div className="tl-entry__body">
          <p className="tl-entry__summary">{entry.summary}</p>

          {entry.points.length > 0 ? (
            <ul className="tl-entry__points">
              {entry.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          ) : null}

          {entry.tags.length > 0 ? (
            <TagList
              items={entry.tags}
              tone="quiet"
              className="tl-entry__tags"
              label={`Topics for ${entry.title}`}
            />
          ) : null}

          {project ? (
            <ArrowLink size="sm" icon="plus" onClick={() => openProject(project.id)}>
              {`Open ${project.name}`}
            </ArrowLink>
          ) : null}
        </div>
      </article>
    </li>
  );
}

export default TimelineEntry;
