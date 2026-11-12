import { projects } from '../../data/projects.js';
import { Section } from '../layout/Section.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { Rule } from '../ui/Rule.jsx';
import { ProjectRow } from '../../features/projects/ProjectRow.jsx';
import '../../features/projects/projects.css';

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeading
        id="projects"
        title={['Things I’ve built.']}
        lede="Most of my work is on the backend: APIs, data pipelines, and the AI and retrieval pieces behind them. Open any project to see how it’s put together and what I worked on."
      />

      <div className="plist">
        {projects.map((project, index) => (
          <div className="plist__item" key={project.id}>
            <Rule />
            <ProjectRow project={project} index={index} />
          </div>
        ))}
        <Rule />
      </div>
    </Section>
  );
}

export default Projects;
