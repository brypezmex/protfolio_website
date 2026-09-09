import { createContext, useContext } from 'react';

/**
 * Shared state for the project system.
 *
 * The context object lives in its own module - separate from the provider
 * component and from the hooks that read it - so that each file exports one
 * kind of thing. That keeps React Fast Refresh working during development,
 * which stops working as soon as a module mixes components with other exports.
 *
 * @typedef {object} ProjectsContextValue
 * @property {(id: string) => void} openProject
 * @property {() => void} closeProject
 * @property {string|null} openId
 * @property {{repos: object, services: object}} meta
 */
export const ProjectsContext = createContext(null);

/** @returns {ProjectsContextValue} */
export function useProjectsContext() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('Project components must be rendered inside <ProjectsProvider>');
  }
  return context;
}
