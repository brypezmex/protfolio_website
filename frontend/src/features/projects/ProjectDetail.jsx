import { Modal } from '../../components/ui/Modal.jsx';
import { PixelIcon } from '../../components/ui/PixelIcon.jsx';
import { StatusDot } from '../../components/ui/StatusDot.jsx';
import { TagList } from '../../components/ui/Tag.jsx';
import { ProjectSchematic } from './ProjectSchematic.jsx';
import { ProjectLinks } from './ProjectLinks.jsx';
import { useProjectMeta } from './useProjects.js';

/**
 * Inner content of the project dialog.
 *
 * Split out from ProjectDetail so that useProjectMeta is only called when a
 * project is actually open - hooks cannot be called conditionally, and the
 * dialog is null most of the time.
 */
function ProjectDetailBody({ project }) {
  const { repo, status } = useProjectMeta(project.id);

  return (
    <div className="pdetail">
      <header className="pdetail__header">
        <div className="pdetail__heading">
          <PixelIcon name={project.icon} size={32} className="pdetail__glyph" />
          <div>
            <p className="label label--accent">{project.type}</p>
            <h2 className="pdetail__title">{project.name}</h2>
          </div>
        </div>

        <p className="pdetail__tagline">{project.tagline}</p>

        <dl className="pdetail__facts">
          <div>
            <dt className="label">Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt className="label">Timeline</dt>
            <dd>{project.period.label}</dd>
          </div>
          <div>
            <dt className="label">Demo</dt>
            <dd>
              <StatusDot status={status} />
              {status === 'unknown' ? <span className="pdetail__muted">Not published</span> : null}
            </dd>
          </div>
          {repo?.pushedAt ? (
            <div>
              <dt className="label">Last push</dt>
              <dd>{new Date(repo.pushedAt).toLocaleDateString()}</dd>
            </div>
          ) : null}
        </dl>
      </header>

      <div className="pdetail__body">
        <div className="pdetail__main">
          <section className="pdetail__block">
            <h3 className="pdetail__subtitle">Overview</h3>
            <p className="pdetail__summary">{project.summary}</p>
          </section>

          <section className="pdetail__block">
            <h3 className="pdetail__subtitle">What it does</h3>
            <ul className="pdetail__features">
              {project.features.map((feature) => (
                <li key={feature.title}>
                  <h4>{feature.title}</h4>
                  <p>{feature.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="pdetail__aside">
          <section className="pdetail__block">
            <h3 className="pdetail__subtitle">Architecture</h3>
            <div className="pdetail__schematic">
              <ProjectSchematic nodes={project.preview.nodes} projectName={project.name} />
            </div>
          </section>

          <section className="pdetail__block">
            <h3 className="pdetail__subtitle">Stack</h3>
            <TagList items={project.tech} label={`Technologies used in ${project.name}`} />
          </section>

          <section className="pdetail__block">
            <h3 className="pdetail__subtitle">Links</h3>
            <ProjectLinks project={project} variant="detail" />
          </section>
        </aside>
      </div>
    </div>
  );
}

/**
 * Full project detail, presented as a modal dialog.
 *
 * A dialog rather than a route: the site is a single scrolling narrative, and
 * navigating away to a detail page would lose the reader's place in the
 * timeline they were reading.
 *
 * @param {object} props
 * @param {object|null} props.project
 * @param {() => void} props.onClose
 */
export function ProjectDetail({ project, onClose }) {
  return (
    <Modal
      open={Boolean(project)}
      onClose={onClose}
      label={project ? `${project.name} project details` : 'Project details'}
    >
      {project ? <ProjectDetailBody project={project} /> : null}
    </Modal>
  );
}

export default ProjectDetail;
