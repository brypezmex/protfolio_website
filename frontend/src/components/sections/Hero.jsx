import { profile } from '../../data/profile.js';
import { useScrollProgress } from '../../hooks/useScrollProgress.js';
import { Icon } from '../ui/Icon.jsx';
import { MaskLines } from '../ui/MaskLines.jsx';
import { Roll } from '../ui/Roll.jsx';
import './Hero.css';

/**
 * The portrait. Served from /public so index.html can preload it - it is the
 * largest thing on the first screen, and waiting for the JS bundle to discover
 * it would delay the page's first meaningful paint. The 800w file covers
 * phones; the 1448w file is the full-resolution original (EXIF stripped).
 */
const PORTRAIT = {
  src: '/images/hero-1448.jpg',
  srcSet: '/images/hero-800.jpg 800w, /images/hero-1448.jpg 1448w',
  width: 1448,
  height: 1086,
  alt: `${profile.name} working on a laptop in an office`,
};

/**
 * Opening screen: the photograph full-bleed, the headline set over its darkest
 * corner, and a thin row of facts along the bottom edge.
 *
 * As the hero scrolls away the photo zooms and drifts slower than the page,
 * driven by a CSS variable (see useScrollProgress) rather than React state.
 */
export function Hero() {
  const ref = useScrollProgress('--hero-progress', { anchor: 0 });

  return (
    <section className="hero" id="top" aria-labelledby="top-title" ref={ref}>
      <div className="hero__media">
        <img
          className="hero__image"
          src={PORTRAIT.src}
          srcSet={PORTRAIT.srcSet}
          sizes="100vw"
          width={PORTRAIT.width}
          height={PORTRAIT.height}
          alt={PORTRAIT.alt}
          fetchPriority="high"
        />
      </div>
      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__content shell">
        <h1 className="hero__title" id="top-title">
          <span className="sr-only">{profile.name}, </span>
          <MaskLines lines={profile.headline} immediate delay={250} stagger={110} />
        </h1>

        <div className="hero__meta">
          <p>{profile.role}</p>
          <p className="hero__meta-location">{profile.location}</p>
          <a className="hero__scroll roll-trigger" href="#about">
            <Roll>Scroll</Roll>
            <Icon name="arrowDown" className="hero__scroll-icon" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
