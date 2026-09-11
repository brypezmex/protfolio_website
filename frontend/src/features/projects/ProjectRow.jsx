import { resolveProjectLinks } from '../../config/site.js';
import { useProjectDialog, useProjectMeta } from './useProjects.js';
import { ProjectSchematic } from './ProjectSchematic.jsx';
import { ProjectLinks } from './ProjectLinks.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { StatusDot } from '../../components/ui/StatusDot.jsx';
import { Reveal } from '../../components/ui/Reveal.jsx';

const CORNERS = ['tl', 'tr', 'bl', 'br'];

/**
 * The row's visual: a real screenshot linking out to the live demo when the
 * project has one, falling back to the generated architecture schematic for
 * projects that do not have a presentable deploy yet.
 */
function ProjectVisual({ project }) {
  const { image, imageAlt, nodes } = project.preview;
  const demoUrl = image ? resolveProjectLinks(project).demo : null;

  if (!image || !demoUrl) {
    return <ProjectSchematic nodes={nodes} projectName={project.name} />;
  }

  return (
    <a
      className="prow__shot"
      href={demoUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img className="prow__shot-img" src={image} alt={imageAlt ?? ''} loading="lazy" />
      <span className="prow__shot-hint">
        <Icon name="arrowUpRight" />
        Visit site
      </span>
      <span className="sr-only"> (opens {project.name} in a new tab)</span>
    </a>
  );
}

/**
 * One project, as a full-width numbered row: index and name across the top,
 * then the summary beside a schematic of the system's data flow.
 *
 * The name is the single control that opens the detail dialog. Its hit area is
 * stretched over the whole row with a pseudo-element, so the row behaves as
 * one big target without nesting interactive elements - the outbound links
 * are lifted above that layer and stay independently clickable.
 *
 * @param {object} props
 * @param {object} props.project
 * @param {number} props.index position in the list, for the [ 01 ] marker
 */
export function ProjectRow({ project, index }) {
  const { openProject } = useProjectDialog();
  const { repo, status } = useProjectMeta(project.id);
  const number = String(index + 1).padStart(2, '0');

  return (
    <Reveal as="article" className="prow" aria-labelledby={`project-${project.id}`}>
      <span className="prow__fill" aria-hidden="true" />
      {CORNERS.map((corner) => (
        <span className={`prow__corner prow__corner--${corner}`} aria-hidden="true" key={corner} />
      ))}

      <div className="prow__head">
        <span className="index prow__index" aria-hidden="true">
          [ <span className="index__num">{number}</span> ]
        </span>
        <h3 className="prow__title" id={`project-${project.id}`}>
          <button className="prow__open" type="button" onClick={() => openProject(project.id)}>
            {project.name}
            <span className="sr-only"> - open project details</span>
            <Icon name="plus" className="prow__icon" />
          </button>
        </h3>
      </div>

      <div className="prow__info">
        <div className="prow__details">
          <p className="prow__meta">
            {project.type}
            <span aria-hidden="true"> / </span>
            {project.period.label}
          </p>

          <p className="prow__tagline">{project.tagline}</p>

          <ul className="prow__highlights">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>

          <p className="prow__tech">
            <span className="sr-only">Built with </span>
            {project.tech.join(', ')}
          </p>

          <div className="prow__footer">
            <ProjectLinks project={project} />
            <div className="prow__signals">
              <StatusDot status={status} />
              {repo?.stars > 0 ? <span className="prow__stars">{repo.stars} stars</span> : null}
            </div>
          </div>
        </div>

        <div className="prow__visual">
          <ProjectVisual project={project} />
        </div>
      </div>
    </Reveal>
  );
}

export default ProjectRow;
