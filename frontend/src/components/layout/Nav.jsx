import { useCallback, useEffect, useState } from 'react';
import { navSections, sections } from '../../data/navigation.js';
import { profile } from '../../data/profile.js';
import { siteConfig } from '../../config/site.js';
import { useActiveSection } from '../../hooks/useActiveSection.js';
import { useLockBodyScroll } from '../../hooks/useDialog.js';
import { PixelIcon } from '../ui/PixelIcon.jsx';
import { cn } from '../../utils/cn.js';
import './Nav.css';

// Defined at module scope so the array identity is stable across renders and
// useActiveSection's observer is not torn down and rebuilt on every paint.
const SECTION_IDS = sections.map((section) => section.id);

/**
 * Sticky primary navigation.
 *
 * Desktop shows inline links with a scroll-spy active indicator. Below the
 * layout breakpoint it collapses to a full-screen overlay menu rather than a
 * squeezed version of the desktop bar - the touch targets, ordering, and
 * typography are all sized for thumbs.
 */
export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);

  useLockBodyScroll(menuOpen);

  // Solidify the bar's background once the hero starts scrolling away.
  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 24);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Escape closes the overlay menu.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className={cn('nav', scrolled && 'is-scrolled')}>
      <div className="nav__inner shell">
        <a className="nav__brand" href="#top" onClick={closeMenu}>
          <PixelIcon name="terminal" size={20} className="nav__brand-glyph" />
          <span className="nav__brand-name">{profile.name}</span>
        </a>

        <nav className="nav__links" aria-label="Sections">
          <ul>
            {navSections.map((section) => (
              <li key={section.id}>
                <a
                  className={cn('nav__link', activeId === section.id && 'is-active')}
                  href={`#${section.id}`}
                  aria-current={activeId === section.id ? 'true' : undefined}
                >
                  <span className="nav__link-index">{section.index}</span>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__actions">
          <a
            className="nav__resume"
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PixelIcon name="download" size={16} />
            Resume
          </a>

          <button
            className={cn('nav__toggle', menuOpen && 'is-open')}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <PixelIcon name={menuOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {/*
        Kept mounted so the open/close transition can run. `inert` is what
        actually closes it: while set, the whole subtree is removed from the tab
        order and the accessibility tree, so nothing is reachable behind the
        fade. Doing that in CSS instead would tie an accessibility guarantee to
        a transition's timing - see the note in Nav.css.
      */}
      <div
        id="mobile-menu"
        className={cn('nav__mobile', menuOpen && 'is-open')}
        inert={!menuOpen}
      >
        <nav aria-label="Sections">
          <ul>
            {navSections.map((section, index) => (
              <li key={section.id} style={{ '--i': index }}>
                <a href={`#${section.id}`} onClick={closeMenu}>
                  <span className="nav__mobile-index label">{section.index}</span>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          className="nav__mobile-resume"
          href={siteConfig.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
        >
          <PixelIcon name="download" size={16} />
          View resume
        </a>
      </div>
    </header>
  );
}

export default Nav;
