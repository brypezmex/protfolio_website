// Style imports come FIRST, before the App import, and the order matters.
//
// ES imports are evaluated in source order, and Vite emits CSS in that same
// order. Importing App first would pull in every component stylesheet ahead of
// these files, so a shared utility class (.above, .notched, .label) would land
// after the component rule it collides with and win on source order alone.
// Keeping the shared layers first gives the cascade the intended shape:
// tokens -> reset -> utilities -> app shell -> component overrides.
import './styles/tokens.css';
import './styles/base.css';
import './styles/utilities.css';
import './styles/app.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
