/**
 * Section registry.
 *
 * Drives the nav links, the mobile menu, the scroll-spy active indicator, and
 * the "[ 02 ] Projects" eyebrow above each section heading. `id` must match
 * the id on the corresponding <Section> element, and the array order is the
 * order the sections appear on the page.
 *
 * `placement` decides where a link sits in the desktop nav: 'quick' links sit
 * on the left under "Quick links", 'action' links on the right beside the
 * availability status.
 */

export const sections = [
  { id: 'top', label: 'Home', index: '00', inNav: false },
  { id: 'about', label: 'About', index: '01', inNav: true, placement: 'quick' },
  { id: 'projects', label: 'Projects', index: '02', inNav: true, placement: 'quick' },
  { id: 'journey', label: 'Timeline', index: '03', inNav: true, placement: 'quick' },
  { id: 'skills', label: 'Skills', index: '04', inNav: true, placement: 'quick' },
  { id: 'contact', label: 'Contact', index: '05', inNav: true, placement: 'action' },
];

export const navSections = sections.filter((s) => s.inNav);

export const sectionsById = Object.fromEntries(sections.map((s) => [s.id, s]));

export default sections;
