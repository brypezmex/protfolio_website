import { profile } from '../../data/profile.js';
import { siteConfig } from '../../config/site.js';
import { Button } from '../ui/Button.jsx';
import { PixelField } from '../ui/PixelField.jsx';
import { PixelIcon } from '../ui/PixelIcon.jsx';
import './Hero.css';

/**
 * Terminal readout shown beside the name.
 *
 * Every line is a fact from the resume rendered in a developer idiom. The
 * staggered entrance is CSS-only (see Hero.css) rather than a character-by-
 * character typing effect, which reads as a gimmick and forces a re-layout on
 * every frame.
 */
const TERMINAL_LINES = [
  { kind: 'cmd', text: 'whoami' },
  { kind: 'out', text: 'bryan-perez -- b.s. computer science, nc state' },
  { kind: 'cmd', text: 'ls ~/stack' },
  { kind: 'out', text: 'java  python  javascript  c  r' },
  { kind: 'out', text: 'react  flask  spring-boot  mysql' },
  { kind: 'cmd', text: 'cat ~/status' },
  { kind: 'ok', text: 'open to swe internships and new-grad roles' },
];

/**
 * Opening section.
 *
 * Leads with the name and a factual paragraph rather than a headline. An
 * earlier version opened with a slogan set in oversized display type, which is
 * how a product announces itself, not how a person introduces themselves.
 */
export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="top-title">
      <PixelField />

      <div className="hero__inner shell above">
        <div className="hero__content">
          <p className="hero__eyebrow label">
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            {profile.location}
            <span className="hero__eyebrow-sep" aria-hidden="true">
              /
            </span>
            Class of 2027
          </p>

          <h1 className="hero__name" id="top-title">
            <span className="hero__name-line">Bryan</span>
            <span className="hero__name-line text-accent">Perez</span>
          </h1>

          <p className="hero__role">{profile.role}</p>
          <p className="hero__intro">{profile.intro}</p>

          <div className="hero__actions">
            <Button href="#projects">
              Projects
              <PixelIcon name="chevronRight" size={16} />
            </Button>
            <Button href={siteConfig.resumeUrl} variant="outline" external>
              <PixelIcon name="download" size={16} />
              Resume
            </Button>
          </div>
        </div>

        {/*
          Repeats information that appears in the sections below, but it is real
          text - readable, selectable, and available to screen readers.
        */}
        <div className="hero__terminal notched" aria-label="Summary">
          <div className="hero__terminal-bar">
            <span className="hero__terminal-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="hero__terminal-title">bryan@portfolio: ~</span>
          </div>

          <div className="hero__terminal-body">
            {TERMINAL_LINES.map((line, index) => (
              <p
                key={line.text}
                className={`hero__line hero__line--${line.kind}`}
                style={{ '--i': index }}
              >
                {line.kind === 'cmd' ? (
                  <span className="hero__prompt" aria-hidden="true">
                    $
                  </span>
                ) : null}
                {line.text}
              </p>
            ))}
            <p className="hero__line hero__line--cmd" style={{ '--i': TERMINAL_LINES.length }}>
              <span className="hero__prompt" aria-hidden="true">
                $
              </span>
              <span className="hero__caret" aria-hidden="true" />
            </p>
          </div>
        </div>
      </div>

      <a className="hero__scroll" href="#about">
        <span className="label">Scroll</span>
        <span className="hero__scroll-track" aria-hidden="true">
          <span className="hero__scroll-dot" />
        </span>
      </a>
    </section>
  );
}

export default Hero;
