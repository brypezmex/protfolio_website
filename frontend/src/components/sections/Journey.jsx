import { useMemo, useState } from 'react';
import { timeline, timelineCategories } from '../../data/timeline.js';
import { Section } from '../layout/Section.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { Timeline } from '../../features/timeline/Timeline.jsx';
import { TimelineFilters } from '../../features/timeline/TimelineFilters.jsx';

/**
 * The chronological spine of the site.
 *
 * Education, research, projects, and involvement all live on one timeline
 * rather than in four separate sections, because the point is the progression
 * between them. The category filter gives a recruiter scanning for one specific
 * thing - "just show me the projects" - a way to get there without losing that
 * framing.
 */
export function Journey() {
  const [category, setCategory] = useState('all');

  const counts = useMemo(() => {
    const next = { all: timeline.length };
    for (const item of timelineCategories) {
      if (item.id === 'all') continue;
      next[item.id] = timeline.filter((entry) => entry.type === item.id).length;
    }
    return next;
  }, []);

  const entries = useMemo(
    () => (category === 'all' ? timeline : timeline.filter((entry) => entry.type === category)),
    [category],
  );

  const activeLabel =
    timelineCategories.find((item) => item.id === category)?.label ?? 'All';

  return (
    <Section id="journey">
      <SectionHeading
        id="journey"
        index="02"
        icon="clock"
        title="Timeline"
        lede="Coursework, research, projects, and clubs, in the order they happened."
      />

      <TimelineFilters value={category} onChange={setCategory} counts={counts} />

      {/* Filtering rebuilds the list silently for sighted users; this makes the
          same change perceivable to screen reader users. */}
      <p className="sr-only" role="status">
        Showing {entries.length} {activeLabel.toLowerCase()} entries.
      </p>

      <Timeline entries={entries} />
    </Section>
  );
}

export default Journey;
