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
      'Started the Computer Science degree at NC State. Coursework has centered on the fundamentals that show up in everything since: data structures, systems, and software design.',
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
      'Engaged in STEM outreach and leadership development for Hispanic communities.',
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
      'A summer of qualitative research on what actually makes middle school students engage with cybersecurity, working alongside a team of undergraduate researchers.',
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
      'Writing software that talks to physical hardware, on a multidisciplinary team where the integration layer is where the interesting failures live.',
    points: [
      'Collaborate with a multidisciplinary team to develop and test software that interfaces with rocket hardware systems',
      'Debug and test software-hardware interfaces to identify integration issues and improve system reliability',
    ],
    tags: ['Embedded', 'Hardware interfacing', 'Testing'],
    projectId: null,
  },
  {
    id: 'wolfcafe',
    type: 'project',
    emphasis: 'major',
    title: 'WolfCafe',
    org: null,
    role: 'Developer',
    start: '2026-01',
    end: '2026-04',
    periodLabel: 'January - April 2026',
    status: 'complete',
    summary:
      'Built a role-based ordering platform on a layered Spring Boot backend, with JWT authentication and a server-owned order state machine.',
    points: [],
    tags: ['React', 'Spring Boot', 'JWT', 'REST APIs'],
    projectId: 'wolfcafe',
  },
  {
    id: 'noirmore',
    type: 'project',
    emphasis: 'major',
    title: 'NoirMore',
    org: null,
    role: 'Developer',
    start: '2026-02',
    end: '2026-02',
    periodLabel: 'February 2026',
    status: 'complete',
    summary:
      'Built an AI fact-checking platform that gathers evidence from six sources, ranks it by reliability, and returns a verdict with a confidence score.',
    points: [],
    tags: ['React', 'Python', 'Flask', 'Web Scraping'],
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
      'B.S. in Computer Science. Open to software engineering internships before then and new-grad roles after.',
    points: [],
    tags: [],
    projectId: null,
  },
];

/** Sorted oldest to newest so scrolling down moves forward through time. */
export const timeline = [...entries].sort((a, b) => a.start.localeCompare(b.start));

export default timeline;
