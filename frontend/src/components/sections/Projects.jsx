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
        title={['{S}elected {P}rojects,', '{B}uilt {E}nd to {E}nd.']}
        lede="Two full-stack systems, from the browser down to storage. Open either one for a breakdown of the architecture and what each part does."
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
