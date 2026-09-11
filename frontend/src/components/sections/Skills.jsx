import { coursework, skillGroups } from '../../data/skills.js';
import { projectsById } from '../../data/projects.js';
import { useProjectDialog } from '../../features/projects/useProjects.js';
import { Section } from '../layout/Section.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { Roll } from '../ui/Roll.jsx';
import './Skills.css';

/**
 * Cross-links from a skill to the projects that used it.
 *
 * This is the part that makes a skills list mean something: rather than
 * claiming a proficiency level, each entry points at the work where the
 * technology actually appears.
 */
function SkillEvidence({ usedIn }) {
  const { openProject } = useProjectDialog();
  if (!usedIn?.length) return null;

  return (
    <span className="skill__evidence">
      {usedIn.map((id) => {
        const project = projectsById[id];
        if (!project) return null;

        return (
          <button
            key={id}
            className="skill__evidence-link roll-trigger"
            type="button"
            onClick={() => openProject(id)}
            aria-label={`Open ${project.name}`}
          >
            <Roll>{project.name}</Roll>
          </button>
        );
      })}
    </span>
  );
}

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        id="skills"
        title={['{L}anguages, {F}rameworks', '{&} {T}ools.']}
        lede="Grouped by role in the stack. Where the resume places a technology in a project, that project is linked beside it."
      />

      <div className="skills__grid">
        {skillGroups.map((group, groupIndex) => (
          <Reveal
            as="section"
            className="skills__group"
            key={group.id}
            delay={groupIndex * 90}
            aria-labelledby={`skills-${group.id}`}
          >
            <h3 className="skills__label" id={`skills-${group.id}`}>
              <span className="index" aria-hidden="true">
                [ <span className="index__num">{String(groupIndex + 1).padStart(2, '0')}</span> ]
              </span>
              {group.label}
            </h3>

            <ul className="skills__list">
              {group.skills.map((skill) => (
                <li className="skill" key={skill.name}>
                  <span className="skill__name">{skill.name}</span>
                  <SkillEvidence usedIn={skill.usedIn} />
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal className="skills__coursework" delay={140}>
        <h3 className="skills__label">Relevant coursework</h3>
        <ul className="skills__coursework-list">
          {coursework.map((course) => (
            <li key={course}>{course}</li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

export default Skills;
