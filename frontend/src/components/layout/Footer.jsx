import { profile } from '../../data/profile.js';
import { Icon } from '../ui/Icon.jsx';
import { Roll } from '../ui/Roll.jsx';
import { SceneStrip } from '../ui/SceneStrip.jsx';
import './Footer.css';

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="footer">
      <SceneStrip />

      <div className="shell">
        <div className="footer__meta">
          <p>
            &copy;{YEAR}. {profile.name}. All rights reserved.
          </p>
          <p className="footer__built">Built with React, Vite, and Flask</p>
          <a className="footer__top roll-trigger" href="#top">
            <Roll>Back to top</Roll>
            <Icon name="arrowUp" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
