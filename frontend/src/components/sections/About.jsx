import { profile } from '../../data/profile.js';
import { siteConfig } from '../../config/site.js';
import { Section } from '../layout/Section.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { ArrowLink } from '../ui/ArrowLink.jsx';
import './About.css';

export function About() {
  return (
    <Section id="about">
      <SectionHeading
        id="about"
        title={profile.aboutHeading}
        lede={profile.intro}
        actions={
          <>
            <ArrowLink href="#projects">Projects</ArrowLink>
            <ArrowLink href={siteConfig.resumeUrl} external>
              Resume
            </ArrowLink>
          </>
        }
      >
        <div className="about__narrative">
          {profile.about.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 32)} delay={200 + index * 80}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </SectionHeading>

      <Reveal as="dl" className="about__facts" variant="fade">
        {profile.facts.map((fact, index) => (
          <div className="about__fact" key={fact.label} style={{ '--i': index }}>
            <dt className="label">{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}

export default About;
