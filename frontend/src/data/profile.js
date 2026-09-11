/**
 * Personal information and site copy.
 *
 * Everything here is drawn from the resume. Edit this file to change identity,
 * contact details, or the hero/about narrative - no component hardcodes them.
 *
 * Headings are arrays with one string per rendered line. Wrapping a letter in
 * braces - `{S}` - sets it in the italic serif accent face (see
 * components/ui/AccentText.jsx). Keep it to capitals, a couple per line; the
 * effect only works while it stays occasional.
 *
 * Body copy stays plain: what was built and studied, in first person, with no
 * superlatives.
 */

export const profile = {
  name: 'Bryan Perez',
  firstName: 'Bryan',
  role: 'Computer Science student, NC State',
  location: 'Raleigh, NC',

  /** Hero headline, set over the photograph. */
  headline: ['Software {E}ngineer', '{&} Full-{S}tack {D}eveloper.'],

  /** Shown beside the green dot in the navigation. */
  availability: 'Open to SWE internships and new-grad roles',

  /** Heading of the About section. */
  aboutHeading: [
    'Full-{S}tack {D}evelopment.',
    'Backend {S}ystems. {R}esearch.',
    'Computer {S}cience at NC {S}tate.',
  ],

  /** Lead paragraph of the About section. Factual, first person, no pitch. */
  intro:
    'I am a Computer Science student at NC State, graduating May 2027. I work across the whole stack - React on the front, Python and Java services behind it - and most of what I build ends up touching a database, a scraper, or someone else’s API.',

  /** About section. Each string renders as its own paragraph. */
  about: [
    'I like building things end to end. Starting at the browser and stopping only when it reaches storage is how I actually learn a system, and it is how both of the projects below were built.',
    'Those two pulled in opposite directions, which is why I keep them together. NoirMore was a research problem wearing a web app: collect evidence from six very different sources, rank it by how much you should trust it, and work out whether it actually supports the claim someone typed in. WolfCafe was a discipline problem: a layered Spring Boot backend where authentication, role boundaries, and order state have to be correct every single time.',
    'Alongside coursework I spent a summer as an undergraduate researcher on a cybersecurity education study, write software that talks to rocket hardware, and keep the books as treasurer for the Latino Association of Computer Science.',
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
    'I am looking for software engineering internships and new-grad roles. Email is the best way to reach me.',
};

export default profile;
