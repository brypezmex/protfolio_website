import { getProject } from '../../data/projects.js';
import { useProjectsContext } from './projectsContext.js';

/**
 * Open and close the shared project detail dialog.
 *
 * @returns {{openProject: (id: string) => void, closeProject: () => void, openId: string|null}}
 */
export function useProjectDialog() {
  const { openProject, closeProject, openId } = useProjectsContext();
  return { openProject, closeProject, openId };
}

/**
 * Live metadata for one project, sourced from the optional backend.
 *
 * Both values fall back to a neutral state when the backend is not available,
 * so callers never need to branch on whether it is deployed.
 *
 * @param {string} id project id
 * @returns {{repo: object|null, status: 'online'|'offline'|'unconfigured'|'unknown'}}
 */
export function useProjectMeta(id) {
  const { meta } = useProjectsContext();
  const project = getProject(id);
  const serviceKey = project?.service?.key;

  return {
    repo: meta.repos[id] ?? null,
    status: serviceKey ? (meta.services[serviceKey] ?? 'unknown') : 'unknown',
  };
}
