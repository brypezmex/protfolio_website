/**
 * Project records - the centralized data structure the whole project system
 * reads from. Adding a project means appending one object here; no component
 * needs to change. Array order is the order on the page.
 *
 * Field contract
 * --------------
 * id          Stable slug. Used for anchors, React keys, skill cross-links, and
 *             (uppercased) the VITE_PROJECT_<ID>_* env override names.
 * role        Bryan's part in it. Most projects are team or full-stack apps
 *             where his work was the backend - say so rather than implying he
 *             built every layer alone.
 * links       github: a URL, '#' for "not published yet", 'private' for a repo
 *             that exists but won't be public, or null for no repository at all.
 *             demo: live URL or null. devpost: hackathon write-up or null.
 *             Env vars override github/demo at build time, see
 *             src/config/site.js.
 * service     Optional. `key` is sent to the backend's status endpoint, which
 *             maps it to a real URL from server-side config. This is how a
 *             home-server-hosted demo reports liveness without the browser ever
 *             learning the server address.
 * preview     `nodes` is the data flow through the system, rendered by
 *             ProjectSchematic as the project's visual by default. `image`
 *             overrides that with a real image instead. With a demo URL the
 *             image links out to it, as does the "Demo" fact in the detail
 *             dialog (there is no separate "Live demo" button); without one
 *             it is shown unlinked. `imageAlt` describes it.
 *
 * Copy style: describe what the thing does and how it is built, from the
 * resume. No product pitch, no superlatives - this is a portfolio, not a
 * launch page.
 */

export const projects = [
  {
    id: 'ai-code-reviewer',
    name: 'AI Code Reviewer',
    tagline:
      'An AI reviewer for GitHub pull requests that flags problems a change could cause anywhere in a large repository, not only in the files it touches.',
    role: 'Backend developer, team project',
    type: 'AI tool, built for Bandwidth',
    period: { start: '2026-08', end: null, label: 'August 2026 - Present' },
    status: 'in-progress',
    featured: true,

    summary:
      'A team project building a pull request reviewer for Bandwidth. A reviewer that only reads the diff misses what a change breaks somewhere else, so this one gives the model context from the whole repository. My part is the retrieval (RAG) infrastructure: Tree-sitter parses the code, OpenSearch indexes it, and AWS Bedrock and OpenAI Terra agents pull that context in during a review. The code is private.',

    highlights: [
      'Repo-wide retrieval built on Tree-sitter, OpenSearch, and AWS Bedrock',
      'Flags issues in files a pull request doesn’t directly touch',
      'Tested against 5+ of Bandwidth’s public repositories',
    ],

    features: [
      {
        title: 'Repository-wide context',
        detail:
          'Tree-sitter parses the repository into code units that are indexed in OpenSearch, so the reviewer can look up code the pull request depends on or affects, not just the lines in the diff.',
      },
      {
        title: 'Cross-file issue detection',
        detail:
          'AWS Bedrock and OpenAI Terra agents use that retrieved context during review, which lets the reviewer point at problems in files the pull request never edits.',
      },
      {
        title: 'Testing on real repositories',
        detail:
          'Tested with 5+ of Bandwidth’s public repositories, and explored support for additional programming languages.',
      },
      {
        title: 'Service',
        detail: 'A Python and FastAPI backend, packaged with Docker.',
      },
    ],

    tech: ['Python', 'FastAPI', 'AWS Bedrock', 'OpenSearch', 'Tree-sitter', 'Docker'],

    preview: {
      nodes: ['GitHub Pull Request', 'Tree-sitter Parser', 'OpenSearch Index', 'Bedrock Agents'],
      image: '/images/ai-code-reviewer-preview.jpg',
      imageAlt: 'The AI Code Reviewer’s robot-head icon',
    },

    links: {
      github: 'private',
      demo: null,
      devpost: null,
    },
  },

  {
    id: 'glucocapture',
    name: 'GlucoCapture',
    tagline:
      'A streaming AI agent that explains why blood glucose changed after a meal, using wearable sensor and meal data.',
    role: 'Backend developer, hackathon team',
    type: 'Hackathon project',
    period: { start: '2026-10', end: '2026-10', label: 'October 2026' },
    status: 'complete',
    featured: true,

    summary:
      'Built in 24 hours at a hackathon, where it won 3rd place in the Applied AI Databricks track. Readings from a wearable glucose sensor and meal data stream into Databricks pipelines that process them in real time, an MLflow model predicts where glucose is heading and how to bring it down, and a streaming AI agent explains the change in plain language. I built the FastAPI backend and the Databricks pipelines.',

    highlights: [
      '3rd place, Applied AI Databricks track, 24-hour hackathon',
      'FastAPI backend over real-time Databricks pipelines',
      'MLflow model predicting post-meal glucose and how to mitigate it',
    ],

    features: [
      {
        title: 'Real-time sensor pipeline',
        detail:
          'Databricks pipelines process wearable sensor readings and meal data as they arrive, so the agent always explains the latest change.',
      },
      {
        title: 'Glucose prediction',
        detail:
          'An MLflow model predicts post-meal glucose levels and how to mitigate a spike.',
      },
      {
        title: 'Streaming explanation agent',
        detail:
          'A streaming AI agent turns the sensor data and the prediction into a plain-language explanation of why glucose moved after a meal.',
      },
      {
        title: 'FastAPI backend',
        detail: 'The API layer that connects the pipelines, the model, and the agent.',
      },
    ],

    tech: ['Python', 'FastAPI', 'Databricks', 'MLflow'],

    preview: {
      nodes: ['Sensor + Meal Data', 'Databricks Pipeline', 'MLflow Model', 'Streaming Agent'],
      image: '/images/glucocapture-preview.jpg',
      imageAlt: 'The GlucoCapture sign-in screen',
    },

    links: {
      github: 'private',
      demo: 'https://glucocapture.photo/',
      devpost: 'https://devpost.com/software/glucocapture',
    },
  },

  {
    id: 'wolfcafe',
    name: 'WolfCafe',
    tagline: 'Cafe ordering system with JWT role-based access and a server-owned order state machine.',
    role: 'Backend developer',
    type: 'Full-stack application',
    period: { start: '2026-01', end: '2026-04', label: 'January - April 2026' },
    status: 'complete',
    featured: true,

    summary:
      'A Spring Boot service with a strict Controller / Service / Repository / Entity / DTO separation over MySQL, JWT authentication, and role boundaries between Admin, Staff, and Customer. Orders move through Pending, Fulfilled, and Picked Up, and the totals have to stay correct while recipe pricing, inventory checks, tax, and tips are all applied.',

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
          'Order totals integrate recipe pricing, inventory checks, and tax and tip calculations, all resolved server-side as part of the order workflow.',
      },
    ],

    tech: ['React', 'JavaScript', 'Java', 'Spring Boot', 'Spring Security', 'MySQL', 'JWT', 'REST APIs'],

    preview: {
      nodes: ['React Client', 'Controller', 'Service', 'Repository'],
      image: '/images/wolfcafe-preview.jpg',
      imageAlt: 'The WolfCafe login screen',
    },

    links: {
      github: 'https://github.com/brypezmex/WolfCafe',
      demo: 'https://wolfcafe.bryan-perez.com/',
      devpost: null,
    },

    service: { key: 'wolfcafe', label: 'WolfCafe demo' },
  },

  {
    id: 'noirmore',
    name: 'NoirMore',
    tagline: 'Fact-checks a written claim against evidence scraped from 10+ news and reference sources.',
    role: 'Backend developer',
    type: 'Full-stack application',
    period: { start: '2026-02', end: '2026-02', label: 'February 2026' },
    status: 'complete',
    featured: true,

    summary:
      'A user submits a claim. A Python pipeline scrapes evidence from 10+ sources, including Wikipedia, Reuters, and AP, ranks those sources by reliability, and an analysis step compares the evidence against the claim to produce a verdict and a confidence score. The hard part was less the algorithm than everything around it - scrapers time out, sources rate-limit, and the classification thresholds needed tuning before the output was trustworthy.',

    highlights: [
      'Evidence scraped from 10+ sources, including Wikipedia, Reuters, and AP',
      'Claim analysis producing a verdict and a confidence score',
      'Reliability-ranked sources surfaced alongside every result',
    ],

    features: [
      {
        title: 'Multi-source evidence pipeline',
        detail:
          'A Python pipeline gathers evidence from 10+ sources, including Wikipedia, Reuters, and AP, using a mix of APIs and web scraping, then ranks the collected sources by reliability before anything reaches the analysis stage.',
      },
      {
        title: 'Claim analysis',
        detail:
          'The relevant evidence is compared against the user-submitted claim to find supporting and conflicting information, and a verdict and a confidence score are generated from that comparison.',
      },
      {
        title: 'Flask REST API',
        detail:
          'Flask endpoints for submitting and analyzing claims, consumed by a React and Vite client that renders the verdict, the supporting evidence, and per-source reliability.',
      },
      {
        title: 'Reliability hardening',
        detail:
          'Accuracy improved by tuning classification thresholds, and the pipeline stayed stable by handling the realities of scraping - request timeouts and source rate limits.',
      },
    ],

    tech: ['Python', 'Flask', 'REST APIs', 'Web Scraping', 'React', 'Vite', 'JavaScript'],

    preview: {
      nodes: ['React + Vite', 'Flask REST API', 'Evidence Pipeline', 'Ranked Sources'],
      image: '/images/noiremore-preview.jpg',
      imageAlt: 'The NoirMore home screen with its claim search bar',
    },

    links: {
      github: 'https://github.com/brypezmex/NoireMore',
      demo: 'https://noiremore.bryan-perez.com/',
      devpost: null,
    },

    service: { key: 'noirmore', label: 'NoirMore demo' },
  },

  {
    id: 'homelab',
    name: 'Homelab',
    tagline:
      'The Proxmox and Docker server at my home that hosts this portfolio and the live NoirMore and WolfCafe demos.',
    role: 'Built and run on my own',
    type: 'Self-hosted infrastructure',
    period: { start: null, end: null, label: 'Running now' },
    status: 'in-progress',
    featured: true,

    summary:
      'A server at home running Proxmox, with Docker containers for this site and for each project demo. Public traffic reaches them through a Cloudflare Tunnel, so there is no port forwarding into the home network. If you can open the NoirMore or WolfCafe demos, you are using it.',

    highlights: [
      'Proxmox host running the services in Docker containers',
      'Serves this site and the NoirMore and WolfCafe demos',
      'Exposed through a Cloudflare Tunnel, with no port forwarding',
    ],

    features: [
      {
        title: 'Virtualization',
        detail: 'Proxmox runs on the server and hosts the environments the services live in.',
      },
      {
        title: 'Containers',
        detail:
          'Each site runs in Docker, so a demo can be rebuilt or restarted without touching the others.',
      },
      {
        title: 'Cloudflare Tunnel',
        detail:
          'Public subdomains such as noiremore.bryan-perez.com and wolfcafe.bryan-perez.com route through a Cloudflare Tunnel instead of open ports on the home router.',
      },
      {
        title: 'This portfolio',
        detail:
          'The React build and the Flask API behind this site, including the live demo status shown on the project rows, are served from here too.',
      },
    ],

    tech: ['Proxmox', 'Docker', 'Cloudflare Tunnel', 'Linux'],

    preview: {
      nodes: ['Cloudflare Tunnel', 'Proxmox Host', 'Docker Containers', 'Sites + Demos'],
    },

    links: {
      github: null,
      demo: 'https://bryan-perez.com/',
      devpost: null,
    },
  },
];

/** Convenience lookup used by the skills cross-links and the timeline. */
export const projectsById = Object.fromEntries(projects.map((p) => [p.id, p]));

export function getProject(id) {
  return projectsById[id] ?? null;
}

export default projects;
