import { profile } from '../../data/profile.js';
import { Section } from '../layout/Section.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { PixelIcon } from '../ui/PixelIcon.jsx';
import './About.css';

export function About() {
  return (
    <Section id="about">
      <SectionHeading
        id="about"
        index="01"
        icon="user"
        title="About"
      />

      <div className="about__grid">
        <div className="about__narrative">
          {profile.about.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 32)} delay={index * 90}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="about__aside" delay={120}>
          <dl className="about__facts">
            {profile.facts.map((fact) => (
              <div className="about__fact" key={fact.label}>
                <dt className="label">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="about__note notched--sm">
            <PixelIcon name="zap" size={16} className="about__note-glyph" />
            <p>
              Currently treasurer of the Latino Association of Computer Science and
              writing hardware-facing software with NC State&apos;s High Powered
              Rocketry Club.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export default About;
