import { useProjectDialog, useProjectMeta } from './useProjects.js';
import { ProjectSchematic } from './ProjectSchematic.jsx';
import { ProjectLinks } from './ProjectLinks.jsx';
import { PixelIcon } from '../../components/ui/PixelIcon.jsx';
import { StatusDot } from '../../components/ui/StatusDot.jsx';
import { TagList } from '../../components/ui/Tag.jsx';
import { Reveal } from '../../components/ui/Reveal.jsx';

/**
 * Project summary card.
 *
 * The heading is the control that opens the detail dialog, which keeps one
 * accessible name per action and avoids nesting interactive elements inside a
 * clickable card - a pattern that breaks keyboard and screen reader use.
 *
 * @param {object} props
 * @param {object} props.project
 * @param {number} [props.index] stagger offset for the reveal
 */
export function ProjectCard({ project, index = 0 }) {
  const { openProject } = useProjectDialog();
  const { repo, status } = useProjectMeta(project.id);

  return (
    <Reveal as="article" className="pcard notched" delay={index * 110}>
      <div className="pcard__preview">
        <PixelIcon name={project.icon} size={128} className="pcard__watermark" />
        <ProjectSchematic nodes={project.preview.nodes} projectName={project.name} />
        <span className="pcard__scanlines" aria-hidden="true" />
      </div>

      <div className="pcard__body">
        <div className="pcard__meta">
          <span className="label label--accent">{project.type}</span>
          <span className="pcard__period">{project.period.label}</span>
        </div>

        <h3 className="pcard__title">
          <button className="pcard__open" type="button" onClick={() => openProject(project.id)}>
            {project.name}
            <PixelIcon name="chevronRight" size={16} className="pcard__open-arrow" />
          </button>
        </h3>

        <p className="pcard__tagline">{project.tagline}</p>

        <ul className="pcard__highlights">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>

        <TagList
          items={project.tech}
          className="pcard__tech"
          label={`Technologies used in ${project.name}`}
        />

        <footer className="pcard__footer">
          <ProjectLinks project={project} />

          <div className="pcard__signals">
            <StatusDot status={status} />
            {repo?.stars > 0 ? (
              <span className="pcard__stars">{repo.stars} stars</span>
            ) : null}
          </div>
        </footer>
      </div>
    </Reveal>
  );
}

export default ProjectCard;
