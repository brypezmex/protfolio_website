/**
 * Project records - the centralized data structure the whole project system
 * reads from. Adding a project means appending one object here; no component
 * needs to change.
 *
 * Field contract
 * --------------
 * id          Stable slug. Used for anchors, React keys, skill cross-links, and
 *             (uppercased) the VITE_PROJECT_<ID>_* env override names.
 * links       Placeholders by default. Do NOT edit these to go live - set the
 *             matching env vars instead, see src/config/site.js. Editing them
 *             here also works, but env vars keep deploy config out of source.
 * service     Optional. `key` is sent to the backend's status endpoint, which
 *             maps it to a real URL from server-side config. This is how a
 *             home-server-hosted demo reports liveness without the browser ever
 *             learning the server address.
 * preview     Drives the generated schematic thumbnail. `nodes` is the data
 *             flow through the system, rendered by ProjectSchematic.
 * icon        Key from components/ui/pixelIcons.js.
 *
 * Copy style: describe what the thing does and how it is built. No product
 * pitch, no superlatives - this is a portfolio, not a launch page.
 */

export const projects = [
  {
    id: 'noirmore',
    name: 'NoirMore',
    tagline: 'Fact-checks a written claim against evidence gathered from six news and reference sources.',
    role: 'Developer',
    type: 'Full-stack application',
    period: { start: '2026-02', end: '2026-02', label: 'February 2026' },
    status: 'complete',
    featured: true,
    icon: 'search',

    summary:
      'A user submits a claim. A Python pipeline collects evidence from Wikipedia, Google Scholar, Reuters, AP, BBC, and NPR, ranks those sources by reliability, and a custom analysis algorithm compares the evidence against the claim to produce a verdict and a confidence score. The hard part was less the algorithm than everything around it - scrapers time out, sources rate-limit, and the classification thresholds needed tuning before the output was trustworthy.',

    /** Two or three lines max. Rendered on the card face. */
    highlights: [
      'Evidence drawn from Wikipedia, Google Scholar, Reuters, AP, BBC, and NPR',
      'Custom claim-analysis algorithm producing a verdict and confidence score',
      'Reliability-ranked sources surfaced alongside every result',
    ],

    features: [
      {
        title: 'Multi-source evidence pipeline',
        detail:
          'A Python pipeline gathers evidence from Wikipedia, Google Scholar, Reuters, AP, BBC, and NPR using a mix of APIs and web scraping, then ranks the collected sources by reliability before anything reaches the analysis stage.',
      },
      {
        title: 'Claim-analysis algorithm',
        detail:
          'A custom algorithm compares the relevant evidence against the user-submitted claim to identify supporting and conflicting information, and generates a confidence score and a verdict from that comparison.',
      },
      {
        title: 'React front end over a Flask REST API',
        detail:
          'The React and Vite client is wired to Flask REST endpoints for submitting and analyzing claims, with reusable components that render the verdict, the supporting evidence, and per-source reliability information.',
      },
      {
        title: 'Reliability hardening',
        detail:
          'Fact-checking accuracy improved by tuning classification thresholds, and pipeline stability improved by handling the realities of scraping at scale - request timeouts and source rate limits.',
      },
    ],

    tech: ['React', 'Vite', 'JavaScript', 'Python', 'Flask', 'REST APIs', 'Web Scraping'],

    preview: {
      nodes: ['React + Vite', 'Flask REST API', 'Evidence Pipeline', 'Ranked Sources'],
    },

    links: {
      github: '#',
      demo: '#',
    },

    service: { key: 'noirmore', label: 'NoirMore demo' },
  },

  {
    id: 'wolfcafe',
    name: 'WolfCafe',
    tagline: 'Cafe ordering system with JWT role-based access and a server-owned order state machine.',
    role: 'Developer',
    type: 'Full-stack application',
    period: { start: '2026-01', end: '2026-04', label: 'January - April 2026' },
    status: 'complete',
    featured: true,
    icon: 'coffee',

    summary:
      'A Spring Boot service with a strict Controller / Service / Repository / Entity / DTO separation, JWT authentication, and role boundaries between Admin, Staff, and Customer. Orders move through Pending, Fulfilled, and Picked Up, and the totals have to stay correct while recipe pricing, inventory validation, tax, and tips are all applied.',

    highlights: [
      'Layered architecture across Controller, Service, Repository, Entity, and DTO',
      'JWT and Spring Security with role-based access for Admin, Staff, and Customer',
      'Order lifecycle from Pending through Fulfilled to Picked Up',
    ],

    features: [
      {
        title: 'Layered backend architecture',
        detail:
          'The Spring Boot service follows a layered architecture with distinct Controller, Service, Repository, Entity, and DTO components, keeping transport concerns, business rules, and persistence separated rather than collapsed into one another.',
      },
      {
        title: 'Authentication and role-based access control',
        detail:
          'JWT authentication with Spring Security enforces role-based access control for Admin, Staff, and Customer users across every protected API endpoint.',
      },
      {
        title: 'Order state workflow',
        detail:
          'An order management workflow moves orders through Pending, Fulfilled, and Picked Up states, so the backend - not the client - owns what transitions are legal.',
      },
      {
        title: 'Pricing and inventory rules',
        detail:
          'Order totals integrate recipe pricing, inventory validation, and tax and tip calculations, all resolved server-side as part of the order workflow.',
      },
    ],

    tech: ['React', 'JavaScript', 'Java', 'Spring Boot', 'Spring Security', 'JWT', 'REST APIs'],

    preview: {
      nodes: ['React Client', 'Controller', 'Service', 'Repository'],
    },

    links: {
      github: '#',
      demo: '#',
    },

    service: { key: 'wolfcafe', label: 'WolfCafe demo' },
  },
];

/** Convenience lookup used by the skills cross-links and the timeline. */
export const projectsById = Object.fromEntries(projects.map((p) => [p.id, p]));

export function getProject(id) {
  return projectsById[id] ?? null;
}

export default projects;
