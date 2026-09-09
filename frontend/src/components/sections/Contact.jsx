import { profile } from '../../data/profile.js';
import { siteConfig } from '../../config/site.js';
import { Section } from '../layout/Section.jsx';
import { SectionHeading } from '../ui/SectionHeading.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { Button } from '../ui/Button.jsx';
import { CopyField } from '../ui/CopyField.jsx';
import { PixelIcon } from '../ui/PixelIcon.jsx';
import './Contact.css';

export function Contact() {
  const { contact } = profile;

  return (
    <Section id="contact">
      <SectionHeading
        id="contact"
        index="05"
        icon="mail"
        title="Contact"
        lede={profile.contactPitch}
      />

      <div className="contact__grid">
        <Reveal className="contact__fields">
          <CopyField
            label="Email"
            value={contact.email}
            href={`mailto:${contact.email}`}
            glyph="mail"
          />
          <CopyField label="Phone" value={contact.phone} href={`tel:+19193524669`} glyph="phone" />
          <CopyField
            label="GitHub"
            value={`github.com/${contact.githubUser}`}
            href={contact.github}
            glyph="gitBranch"
          />
          <CopyField
            label="LinkedIn"
            value="linkedin.com/in/bryan-perez23"
            href={contact.linkedin}
            glyph="link"
          />
        </Reveal>

        <Reveal className="contact__resume notched" delay={120}>
          <PixelIcon name="download" size={32} className="contact__resume-glyph" />
          <h3 className="contact__resume-title">Resume</h3>
          <p className="contact__resume-copy">
            The full one-page version, with everything on this site condensed into
            something you can forward.
          </p>
          <Button href={siteConfig.resumeUrl} external>
            <PixelIcon name="download" size={16} />
            Open resume (PDF)
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}

export default Contact;
