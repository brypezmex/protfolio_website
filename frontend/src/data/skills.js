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
    skills: [
      { name: 'Python', usedIn: ['ai-code-reviewer', 'glucocapture', 'noirmore'] },
      { name: 'Java', usedIn: ['wolfcafe'] },
      { name: 'JavaScript', usedIn: ['noirmore', 'wolfcafe'] },
      { name: 'C', usedIn: [] },
      { name: 'R', usedIn: [] },
    ],
  },
  {
    id: 'frameworks',
    label: 'Frameworks & Libraries',
    skills: [
      { name: 'FastAPI', usedIn: ['ai-code-reviewer', 'glucocapture'] },
      { name: 'Spring Boot', usedIn: ['wolfcafe'] },
      { name: 'Flask', usedIn: ['noirmore'] },
      { name: 'React', usedIn: ['noirmore', 'wolfcafe'] },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    skills: [{ name: 'MySQL', usedIn: ['wolfcafe'] }],
  },
  {
    id: 'ai-data',
    label: 'AI & Data',
    skills: [
      { name: 'AWS Bedrock', usedIn: ['ai-code-reviewer'] },
      { name: 'OpenSearch', usedIn: ['ai-code-reviewer'] },
      { name: 'Tree-sitter', usedIn: ['ai-code-reviewer'] },
      { name: 'Databricks', usedIn: ['glucocapture'] },
      { name: 'MLflow', usedIn: ['glucocapture'] },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    skills: [
      { name: 'Docker', usedIn: ['ai-code-reviewer', 'homelab'] },
      { name: 'Proxmox', usedIn: ['homelab'] },
      { name: 'Cloudflare Tunnel', usedIn: ['homelab'] },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Technologies',
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
