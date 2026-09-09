import { projects } from '../../data/projects.js';
import { Section } from '../layout/Section.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { ProjectCard } from '../../features/projects/ProjectCard.jsx';
import '../../features/projects/projects.css';

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeading
        id="projects"
        index="04"
        icon="briefcase"
        title="Projects"
        lede="Two full-stack systems. Each card opens a breakdown of the architecture and what it does."
      />

      <div className="pgrid">
        {projects.map((project, index) => (
          <ProjectCard project={project} index={index} key={project.id} />
        ))}
      </div>
    </Section>
  );
}

export default Projects;
