import { resolveProjectLinks } from '../../config/site.js';

/**
 * The outbound links a project has, in display order.
 *
 * The live demo is reached through the project's preview screenshot (see
 * ProjectVisual in ProjectRow.jsx) and the detail dialog's Demo fact, so it is
 * not repeated here.
 *
 * A repository that exists but has no public URL renders as a visibly inert
 * label - "soon" while it is unpublished, "private" when it will stay that way
 * - so a visitor knows the code exists instead of a link silently missing. A
 * project with no repository at all gets no source entry.
 *
 * @param {object} project
 * @returns {{ key: string, label: string, url: string|null, note?: string }[]}
 */
export function projectLinkItems(project) {
  const links = resolveProjectLinks(project);
  const items = [];

  if (links.source === 'public') items.push({ key: 'github', label: 'Source', url: links.github });
  if (links.source === 'pending') items.push({ key: 'github', label: 'Source', url: null, note: 'soon' });
  if (links.source === 'private') items.push({ key: 'github', label: 'Source', url: null, note: 'private' });
  if (links.devpost) items.push({ key: 'devpost', label: 'Devpost', url: links.devpost });

  return items;
}

export default projectLinkItems;
