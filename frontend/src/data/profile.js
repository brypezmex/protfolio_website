/**
 * Personal information and site copy.
 *
 * Everything here is drawn from the resume. Edit this file to change identity,
 * contact details, or the hero/about narrative - no component hardcodes them.
 *
 * Headings are arrays with one string per rendered line, written as ordinary
 * sentences in sentence case - no title-cased slogans, no stacks of
 * one-word fragments.
 *
 * Body copy stays plain: what was built and studied, in first person, with
 * contractions, the way it would be said out loud. No superlatives.
 */

export const profile = {
  name: 'Bryan Perez',
  firstName: 'Bryan',
  /** Bottom-left of the hero, under the headline - so it adds a fact the
      headline doesn't already state. */
  role: 'B.S. Computer Science, class of 2027',
  location: 'Raleigh, NC',

  /** Hero headline, set over the photograph. */
  headline: ['Full-stack developer', '& CS student at NC State.'],

  /** Shown beside the green dot in the navigation. */
  availability: 'Open to software and AI engineering roles',

  /** Heading of the About section. The second line is set in grey. */
  aboutHeading: ['I’m a CS student at NC State', 'who mostly works on the backend.'],

  /** Lead paragraph of the About section. Factual, first person, no pitch. */
  intro:
    'I graduate in May 2027. I build full-stack web apps and AI-powered tools, and my part is usually the backend: Python and Java services, data pipelines, and the retrieval behind AI features.',

  /** About section. Each string renders as its own paragraph. */
  about: [
    'Right now I’m on a team building an AI pull request reviewer for Bandwidth, where I work on the retrieval infrastructure that gives it context from the whole repository. In October, GlucoCapture took 3rd place in the Applied AI Databricks track at a 24-hour hackathon; I built its FastAPI backend and Databricks pipelines.',
    'I also run my own server. This site and the NoirMore and WolfCafe demos are live on a Proxmox and Docker homelab at my house, so I get to deal with what happens after the code works: deploying it, containerizing it, and keeping it up.',
    'Outside of class, I spent a summer as an undergraduate researcher on a cybersecurity education study, I write C and STM32 software for rocket hardware with the High Powered Rocketry Club, and I’m treasurer of the Latino Association of Computer Science.',
  ],

  /** Short factual pairs rendered beside the about copy. */
  facts: [
    { label: 'Location', value: 'Raleigh, NC' },
    { label: 'School', value: 'NC State University' },
    { label: 'Degree', value: 'B.S. Computer Science' },
    { label: 'Graduating', value: 'May 2027' },
  ],

  contact: {
    email: 'bryanp0138@gmail.com',
    github: 'https://github.com/brypezmex',
    githubUser: 'brypezmex',
    linkedin: 'https://www.linkedin.com/in/bryan-perez23',
  },

  /** Contact section copy. */
  contactPitch:
    'I’m looking for software development and AI engineering roles, internships or entry-level. Email is the best way to reach me.',
};

export default profile;
