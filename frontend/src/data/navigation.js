/**
 * Section registry.
 *
 * Drives the nav links, the mobile menu, and the scroll-spy active indicator.
 * `id` must match the id on the corresponding <Section> element.
 */

export const sections = [
  { id: 'top', label: 'Home', index: '00', inNav: false },
  { id: 'about', label: 'About', index: '01', inNav: true },
  { id: 'journey', label: 'Journey', index: '02', inNav: true },
  { id: 'skills', label: 'Skills', index: '03', inNav: true },
  { id: 'projects', label: 'Projects', index: '04', inNav: true },
  { id: 'contact', label: 'Contact', index: '05', inNav: true },
];

export const navSections = sections.filter((s) => s.inNav);

export default sections;
