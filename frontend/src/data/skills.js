/**
 * Technical skills, grouped as they appear on the resume.
 *
 * `usedIn` holds project ids from data/projects.js. It is only populated where
 * the resume explicitly places that technology in that project, which lets the
 * Skills section cross-link to real work rather than asserting proficiency.
 * A skill with an empty `usedIn` simply renders without a project chip.
 */

export const skillGroups = [
  {
    id: 'languages',
    label: 'Languages',
    icon: 'code',
    skills: [
      { name: 'Java', usedIn: ['wolfcafe'] },
      { name: 'Python', usedIn: ['noirmore'] },
      { name: 'JavaScript', usedIn: ['noirmore', 'wolfcafe'] },
      { name: 'C', usedIn: [] },
      { name: 'R', usedIn: [] },
    ],
  },
  {
    id: 'frameworks',
    label: 'Frameworks & Libraries',
    icon: 'package',
    skills: [
      { name: 'React', usedIn: ['noirmore', 'wolfcafe'] },
      { name: 'Flask', usedIn: ['noirmore'] },
      { name: 'Spring Boot', usedIn: ['wolfcafe'] },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    icon: 'database',
    skills: [{ name: 'MySQL', usedIn: [] }],
  },
  {
    id: 'tools',
    label: 'Tools & Technologies',
    icon: 'terminal',
    skills: [
      { name: 'Git', usedIn: [] },
      { name: 'GitHub', usedIn: [] },
      { name: 'REST APIs', usedIn: ['noirmore', 'wolfcafe'] },
      { name: 'JWT', usedIn: ['wolfcafe'] },
      { name: 'Vite', usedIn: ['noirmore'] },
      { name: 'FATFS', usedIn: [] },
      { name: 'LaTeX', usedIn: [] },
    ],
  },
];

/** Relevant coursework, rendered as a separate strip below the skill grid. */
export const coursework = [
  'Data Structures & Algorithms',
  'Operating Systems',
  'Software Engineering',
  'Computer Graphics',
];

export default skillGroups;
