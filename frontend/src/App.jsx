import { useBackendConfig } from './hooks/useBackendConfig.js';
import { ProjectsProvider } from './features/projects/ProjectsProvider.jsx';
import { Nav } from './components/layout/Nav.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { Hero } from './components/sections/Hero.jsx';
import { About } from './components/sections/About.jsx';
import { Journey } from './components/sections/Journey.jsx';
import { Skills } from './components/sections/Skills.jsx';
import { Projects } from './components/sections/Projects.jsx';
import { Contact } from './components/sections/Contact.jsx';

export function App() {
  const { online, features } = useBackendConfig();

  return (
    <ProjectsProvider backendOnline={online} features={features}>
      {/* First tab stop on the page: lets keyboard users skip the nav. */}
      <a className="skip-link" href="#about">
        Skip to content
      </a>

      <Nav />

      {/* Order must match data/navigation.js. */}
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Journey />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </ProjectsProvider>
  );
}

export default App;
