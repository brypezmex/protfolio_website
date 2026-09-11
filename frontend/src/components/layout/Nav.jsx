import { useCallback, useEffect, useState } from 'react';
import { navSections, sections } from '../../data/navigation.js';
import { profile } from '../../data/profile.js';
import { siteConfig } from '../../config/site.js';
import { useActiveSection } from '../../hooks/useActiveSection.js';
import { useLockBodyScroll } from '../../hooks/useDialog.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { ArrowLink } from '../ui/ArrowLink.jsx';
import { Roll } from '../ui/Roll.jsx';
import { cn } from '../../utils/cn.js';
import './Nav.css';

// Defined at module scope so the array identity is stable across renders and
// useActiveSection's observer is not torn down and rebuilt on every paint.
const SECTION_IDS = sections.map((section) => section.id);
const QUICK_LINKS = navSections.filter((section) => section.placement === 'quick');
const ACTION_LINKS = navSections.filter((section) => section.placement === 'action');

/** Keep in sync with the breakpoint in Nav.css. */
const DESKTOP_QUERY = '(min-width: 992px)';

/**
 * A run of links separated by commas, the way the nav reads: "About, Projects,
 * Timeline". The commas are presentational and sit outside the links.
 */
function LinkRun({ items, activeId }) {
  return (
    <ul className="nav__list">
      {items.map((item, index) => (
        <li key={item.href}>
          <a
            className={cn('nav__link', 'roll-trigger', activeId && item.id === activeId && 'is-active')}
            href={item.href}
            aria-current={activeId && item.id === activeId ? 'true' : undefined}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
          >
            <Roll>{item.label}</Roll>
            {item.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
          </a>
          {index < items.length - 1 ? (
            <span className="nav__comma" aria-hidden="true">
              ,
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

const toLink = (section) => ({ id: section.id, label: section.label, href: `#${section.id}` });

/**
 * Fixed primary navigation.
 *
 * Desktop is three columns over the page - quick links, the name, and
 * availability plus contact - with no background at all. The bar is blended
 * with `mix-blend-mode: difference`, so white type stays legible over both the
 * bright photograph and the black page without a backdrop ever being drawn.
 *
 * Below the breakpoint it collapses to the name and a Menu button that opens a
 * full-screen overlay. The overlay lives outside the blended bar on purpose: a
 * difference-blended black panel would render as transparent.
 */
export function Nav() {
  const [menuRequested, setMenuRequested] = useState(false);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const activeId = useActiveSection(SECTION_IDS);

  // Derived rather than synced with an effect: widening the window past the
  // breakpoint closes the menu (and releases the scroll lock) by definition.
  const menuOpen = menuRequested && !isDesktop;

  useLockBodyScroll(menuOpen);

  // Escape closes the overlay menu.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuRequested(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuRequested(false), []);

  const quickLinks = QUICK_LINKS.map(toLink);
  const actionLinks = [
    ...ACTION_LINKS.map(toLink),
    { id: 'resume', label: 'Resume', href: siteConfig.resumeUrl, external: true },
  ];

  return (
    <>
      {/* Dims whatever scrolls under the bar. A separate element because
          anything dark inside the difference-blended bar would vanish. */}
      <div className="nav-scrim" aria-hidden="true" />

      <header className={cn('nav', menuOpen && 'is-menu-open')}>
        <div className="nav__bar">
          <div className="nav__col nav__col--quick">
            <p className="nav__heading">Quick links</p>
            <nav aria-label="Sections">
              <LinkRun items={quickLinks} activeId={activeId} />
            </nav>
          </div>

          <a
            className="nav__col nav__col--name"
            href="#top"
            onClick={closeMenu}
            aria-label={`${profile.name} - back to top`}
          >
            <span className="nav__heading">Hello, my name is</span>
            <span className="nav__name">{profile.name}</span>
          </a>

          <div className="nav__col nav__col--actions">
            <p className="nav__heading nav__status">
              <span className="nav__dot" aria-hidden="true" />
              {profile.availability}
            </p>
            <LinkRun items={actionLinks} activeId={activeId} />
          </div>

          <button
            className="nav__toggle roll-trigger"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuRequested((open) => !open)}
          >
            <Roll>{menuOpen ? 'Close' : 'Menu'}</Roll>
          </button>
        </div>
      </header>

      {/*
        Kept mounted so the open/close transition can run. `inert` is what
        actually closes it: while set, the whole subtree is removed from the tab
        order and the accessibility tree, so nothing is reachable behind the
        fade.
      */}
      <div id="mobile-menu" className={cn('nav-menu', menuOpen && 'is-open')} inert={!menuOpen}>
        <div className="nav-menu__inner shell">
          <p className="label">Quick links</p>

          <nav aria-label="Sections">
            <ul className="nav-menu__list">
              {navSections.map((section, index) => (
                <li key={section.id} style={{ '--i': index }}>
                  <a className="nav-menu__link" href={`#${section.id}`} onClick={closeMenu}>
                    <span className="index" aria-hidden="true">
                      [ <span className="index__num">{section.index}</span> ]
                    </span>
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-menu__footer">
            <p className="nav-menu__status">
              <span className="nav__dot" aria-hidden="true" />
              {profile.availability}
            </p>
            <ArrowLink href={siteConfig.resumeUrl} external onClick={closeMenu}>
              Resume
            </ArrowLink>
            <ArrowLink href={`mailto:${profile.contact.email}`} onClick={closeMenu}>
              {profile.contact.email}
            </ArrowLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default Nav;
