import { resolveProjectLinks } from '../../config/site.js';
import { Icon } from '../../components/ui/Icon.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Roll } from '../../components/ui/Roll.jsx';
import { StatusDot } from '../../components/ui/StatusDot.jsx';
import { TagList } from '../../components/ui/Tag.jsx';
import { ProjectSchematic } from './ProjectSchematic.jsx';
import { ProjectLinks } from './ProjectLinks.jsx';
import { useProjectMeta } from './useProjects.js';

/**
 * The "Demo" fact: a link to the live site when one is configured, with the
 * backend's liveness dot beside it if the API reports one. Without a URL it
 * falls back to the status alone.
 */
function DemoFact({ project, status }) {
  const demoUrl = resolveProjectLinks(project).demo;

  if (!demoUrl) {
    return (
      <>
        <StatusDot status={status} />
        {status === 'unknown' ? <span className="pdetail__muted">Not published</span> : null}
      </>
    );
  }

  return (
    <>
      <a className="pdetail__demo roll-trigger" href={demoUrl} target="_blank" rel="noopener noreferrer">
        <Roll>{new URL(demoUrl).hostname}</Roll>
        <Icon name="arrowUpRight" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      {/* 'unconfigured' only means the backend has no URL for it, which the
          link above already contradicts - so only real liveness is shown. */}
      {status === 'online' || status === 'offline' ? <StatusDot status={status} /> : null}
    </>
  );
}

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
        <p className="label">{project.type}</p>
        <h2 className="pdetail__title">{project.name}</h2>
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
              <DemoFact project={project} status={status} />
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
            <h3 className="pdetail__subtitle label">Overview</h3>
            <p className="pdetail__summary">{project.summary}</p>
          </section>

          <section className="pdetail__block">
            <h3 className="pdetail__subtitle label">What it does</h3>
            <ol className="pdetail__features">
              {project.features.map((feature, index) => (
                <li key={feature.title}>
                  <span className="index" aria-hidden="true">
                    [ <span className="index__num">{String(index + 1).padStart(2, '0')}</span> ]
                  </span>
                  <div>
                    <h4>{feature.title}</h4>
                    <p>{feature.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="pdetail__aside">
          <section className="pdetail__block">
            <h3 className="pdetail__subtitle label">Architecture</h3>
            <div className="pdetail__schematic">
              <ProjectSchematic nodes={project.preview.nodes} projectName={project.name} />
            </div>
          </section>

          <section className="pdetail__block">
            <h3 className="pdetail__subtitle label">Stack</h3>
            <TagList items={project.tech} label={`Technologies used in ${project.name}`} />
          </section>

          <section className="pdetail__block">
            <h3 className="pdetail__subtitle label">Links</h3>
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
 * A dialog rather than a route: the site is a single scrolling page, and
 * navigating away to a detail page would lose the reader's place.
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
