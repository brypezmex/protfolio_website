import { profile } from '../../data/profile.js';
import { Section } from '../layout/Section.jsx';
import { SectionEyebrow } from '../ui/SectionHeading.jsx';
import { MaskLines } from '../ui/MaskLines.jsx';
import { Reveal } from '../ui/Reveal.jsx';
import { ArrowLink } from '../ui/ArrowLink.jsx';
import './Contact.css';

/**
 * Closing section. The heading is the largest type on the page after the
 * hero, split across the width - first line left, second line right - with
 * three plain actions underneath: email, GitHub, LinkedIn.
 */
export function Contact() {
  const { contact } = profile;

  return (
    <Section id="contact" className="contact">
      <SectionEyebrow id="contact" />

      <h2 className="contact__heading" id="contact-title">
        <MaskLines lines={['Let’s {W}ork', '{T}ogether.']} stagger={140} />
      </h2>

      <div className="contact__grid">
        <Reveal>
          <p className="contact__pitch">{profile.contactPitch}</p>
        </Reveal>

        <Reveal className="contact__actions" delay={100}>
          <ArrowLink href={`mailto:${contact.email}`} icon="mail">
            Send an email
          </ArrowLink>
          <ArrowLink href={contact.github} external icon="github">
            GitHub
          </ArrowLink>
          <ArrowLink href={contact.linkedin} external icon="linkedin">
            LinkedIn
          </ArrowLink>
        </Reveal>
      </div>
    </Section>
  );
}

export default Contact;
