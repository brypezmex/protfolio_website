import { profile } from '../../data/profile.js';
import { PixelIcon } from '../ui/PixelIcon.jsx';
import './Footer.css';

const YEAR = new Date().getFullYear();

export function Footer() {
  const { contact } = profile;

  return (
    <footer className="footer">
      <div className="shell above footer__inner">
        <div className="footer__brand">
          <PixelIcon name="terminal" size={16} className="footer__glyph" />
          <span>{profile.name}</span>
        </div>

        <nav className="footer__links" aria-label="Elsewhere">
          <a href={contact.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${contact.email}`}>Email</a>
        </nav>

        <div className="footer__meta">
          <span>&copy; {YEAR}</span>
          <span aria-hidden="true">/</span>
          <span>Built with React, Vite, and Flask</span>
        </div>

        <a className="footer__top" href="#top">
          Back to top
          <PixelIcon name="chevronRight" size={16} className="footer__top-arrow" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
