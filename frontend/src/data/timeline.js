/**
 * The chronological spine of the site.
 *
 * Entries are authored in any order and sorted ascending by `start` at export
 * time, so the reader scrolls forward through time. Project entries carry a
 * `projectId` that links the node to its full record in data/projects.js -
 * that cross-reference is what keeps the timeline and the project section from
 * drifting apart as content is edited.
 *
 * `emphasis: 'major'` promotes a node to the larger visual treatment. Use it
 * sparingly; if everything is emphasized, nothing is.
 */

/** Filter categories, rendered as chips above the timeline. */
export const timelineCategories = [
  { id: 'all', label: 'All' },
  { id: 'education', label: 'Education' },
  { id: 'project', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'involvement', label: 'Involvement' },
];

const entries = [
  {
    id: 'ncsu-start',
    type: 'education',
    emphasis: 'major',
    title: 'B.S. Computer Science',
    org: 'North Carolina State University',
    role: null,
    start: '2023-08',
    end: '2027-05',
    periodLabel: 'August 2023 - May 2027',
    status: 'in-progress',
    summary:
      'Started the Computer Science degree at NC State. Most of my coursework so far has been data structures, systems, and software design.',
    points: [
      'Relevant coursework: Data Structures & Algorithms, Operating Systems, Software Engineering, Computer Graphics',
    ],
    tags: ['Data Structures & Algorithms', 'Operating Systems', 'Software Engineering', 'Computer Graphics'],
    projectId: null,
  },
  {
    id: 'shpe',
    type: 'involvement',
    emphasis: 'standard',
    title: 'Society of Hispanic Professional Engineers',
    org: 'SHPE',
    role: 'Member',
    start: '2023-09',
    end: null,
    periodLabel: 'September 2023 - Present',
    status: 'in-progress',
    summary:
      'STEM outreach and leadership development events for Hispanic students and communities.',
    points: [],
    tags: ['Outreach', 'Leadership development'],
    projectId: null,
  },
  {
    id: 'lacsc-member',
    type: 'involvement',
    emphasis: 'standard',
    title: 'Latino Association of Computer Science',
    org: 'LA/CSC',
    role: 'Member',
    start: '2024-08',
    end: null,
    periodLabel: 'Fall 2024 - Present',
    status: 'in-progress',
    summary:
      'Joined LA/CSC as an active member, two years before being elected to the executive board.',
    points: [],
    tags: ['Community'],
    projectId: null,
  },
  {
    id: 'cyber-research',
    type: 'research',
    emphasis: 'major',
    title: 'Cybersecurity Engagement Study',
    org: 'N.C. State University',
    role: 'Undergraduate Researcher',
    start: '2025-05',
    end: '2025-08',
    periodLabel: 'May 2025 - August 2025',
    status: 'complete',
    summary:
      'A summer of qualitative research into what gets middle school students interested in cybersecurity, with a team of other undergraduate researchers.',
    points: [
      'Analyzed interview data from 20+ middle school students participating in a cybersecurity camp',
      'Identified key engagement themes through collaborative qualitative analysis',
      'Synthesized findings with a team of undergraduate researchers to assess program impact',
    ],
    tags: ['Qualitative analysis', 'Research', 'Cybersecurity education'],
    projectId: null,
  },
  {
    id: 'rocketry',
    type: 'involvement',
    emphasis: 'standard',
    title: 'High Powered Rocketry Club',
    org: 'NC State',
    role: 'Member',
    start: '2026-01',
    end: null,
    periodLabel: 'January 2026 - Present',
    status: 'in-progress',
    summary:
      'Writing and testing C and STM32 software that talks to the rocket’s hardware, on a team made up of several engineering disciplines.',
    points: [
      'Develop and test C and STM32 software that interfaces with rocket hardware, including sensors and flight data',
      'Debug software-hardware integration issues in a multidisciplinary team to improve system reliability',
    ],
    tags: ['C', 'STM32', 'Embedded', 'Testing'],
    projectId: null,
  },
  {
    id: 'wolfcafe',
    type: 'project',
    emphasis: 'major',
    title: 'WolfCafe',
    org: null,
    role: 'Backend developer',
    start: '2026-01',
    end: '2026-04',
    periodLabel: 'January - April 2026',
    status: 'complete',
    summary:
      'A role-based ordering app on a layered Spring Boot and MySQL backend, with JWT authentication and a server-owned order state machine.',
    points: [],
    tags: ['Spring Boot', 'MySQL', 'JWT', 'React'],
    projectId: 'wolfcafe',
  },
  {
    id: 'noirmore',
    type: 'project',
    emphasis: 'major',
    title: 'NoirMore',
    org: null,
    role: 'Backend developer',
    start: '2026-02',
    end: '2026-02',
    periodLabel: 'February 2026',
    status: 'complete',
    summary:
      'An AI fact-checking app that scrapes evidence from 10+ sources, ranks it by reliability, and returns a verdict with a confidence score.',
    points: [],
    tags: ['Python', 'Flask', 'Web Scraping', 'React'],
    projectId: 'noirmore',
  },
  {
    id: 'lacsc-treasurer',
    type: 'involvement',
    emphasis: 'standard',
    title: 'Treasurer, LA/CSC',
    org: 'Latino Association of Computer Science',
    role: 'Treasurer',
    start: '2026-08',
    end: null,
    periodLabel: 'August 2026 - Present',
    status: 'in-progress',
    summary:
      'Elected to the executive board after two years as a member.',
    points: [
      'Manage club finances and maintain records of expenses, transactions, and budgets',
      'Document meeting minutes, decisions, and action items to maintain organizational records',
    ],
    tags: ['Finance', 'Records', 'Executive board'],
    projectId: null,
  },
  {
    id: 'ai-code-reviewer',
    type: 'project',
    emphasis: 'major',
    title: 'AI Code Reviewer',
    org: 'Bandwidth',
    role: 'Backend developer',
    start: '2026-08',
    end: null,
    periodLabel: 'August 2026 - Present',
    status: 'in-progress',
    summary:
      'On a team building an AI GitHub pull request reviewer for Bandwidth. I work on the RAG infrastructure that gives it repo-wide context.',
    points: [],
    tags: ['Python', 'FastAPI', 'AWS Bedrock', 'OpenSearch'],
    projectId: 'ai-code-reviewer',
  },
  {
    id: 'glucocapture',
    type: 'project',
    emphasis: 'major',
    title: 'GlucoCapture',
    org: 'Hackathon - 3rd place, Applied AI Databricks track',
    role: 'Backend developer',
    start: '2026-10',
    end: '2026-10',
    periodLabel: 'October 2026',
    status: 'complete',
    summary:
      'A streaming AI agent that explains post-meal glucose changes, built in 24 hours. I built the FastAPI backend and the Databricks pipelines.',
    points: [],
    tags: ['Python', 'FastAPI', 'Databricks', 'MLflow'],
    projectId: 'glucocapture',
  },
  {
    id: 'graduation',
    type: 'education',
    emphasis: 'major',
    title: 'Expected graduation',
    org: 'North Carolina State University',
    role: null,
    start: '2027-05',
    end: '2027-05',
    periodLabel: 'May 2027',
    status: 'upcoming',
    summary:
      'B.S. in Computer Science. Open to software development and AI engineering roles, internships before then and entry-level after.',
    points: [],
    tags: [],
    projectId: null,
  },
];

/** Sorted oldest to newest so scrolling down moves forward through time. */
export const timeline = [...entries].sort((a, b) => a.start.localeCompare(b.start));

export default timeline;
