import { useCallback, useEffect, useMemo, useState } from 'react';
import { getProject } from '../../data/projects.js';
import { fetchRepoStats, fetchServiceStatus } from '../../api/projects.js';
import { ProjectsContext } from './projectsContext.js';
import { ProjectDetail } from './ProjectDetail.jsx';

const EMPTY_META = { repos: {}, services: {} };

/**
 * Owns everything shared across the project system:
 *
 * - which project's detail dialog is open, so the timeline, the skills list,
 *   and the project grid can all open the same dialog without duplicating it
 *   or drilling callbacks through several layers
 * - the one-time fetch of GitHub stats and demo liveness, so a page with three
 *   consumers still makes exactly one request each
 *
 * The metadata fetch is best-effort. Failure is the expected case whenever the
 * optional backend is not running, and it leaves the UI in its static state.
 *
 * @param {object} props
 * @param {boolean} props.backendOnline
 * @param {Record<string, boolean>} props.features backend capability flags
 */
export function ProjectsProvider({ backendOnline, features, children }) {
  const [openId, setOpenId] = useState(null);
  const [meta, setMeta] = useState(EMPTY_META);

  const openProject = useCallback((id) => setOpenId(id), []);
  const closeProject = useCallback(() => setOpenId(null), []);

  const githubEnabled = Boolean(features?.github);
  const statusEnabled = Boolean(features?.status);

  useEffect(() => {
    if (!backendOnline || (!githubEnabled && !statusEnabled)) return undefined;

    const controller = new AbortController();

    // allSettled, not all: one feature failing must not take the other down.
    Promise.allSettled([
      githubEnabled ? fetchRepoStats(controller.signal) : Promise.resolve({}),
      statusEnabled ? fetchServiceStatus(controller.signal) : Promise.resolve({}),
    ]).then(([repos, services]) => {
      if (controller.signal.aborted) return;
      setMeta({
        repos: repos.status === 'fulfilled' ? repos.value : {},
        services: services.status === 'fulfilled' ? services.value : {},
      });
    });

    return () => controller.abort();
  }, [backendOnline, githubEnabled, statusEnabled]);

  const value = useMemo(
    () => ({ openProject, closeProject, openId, meta }),
    [openProject, closeProject, openId, meta],
  );

  const activeProject = openId ? getProject(openId) : null;

  return (
    <ProjectsContext.Provider value={value}>
      {children}
      <ProjectDetail project={activeProject} onClose={closeProject} />
    </ProjectsContext.Provider>
  );
}

export default ProjectsProvider;
