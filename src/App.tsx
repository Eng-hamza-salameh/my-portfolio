import { useCallback, useEffect, useState } from 'react';
import { LangProvider } from './lib/i18n';
import { initScroll } from './lib/scroll';
import Space from './components/Space';
import Earth from './components/Earth';
import { Header, Preloader, SectionDots, ShootingStars, SocialRail } from './components/Chrome';
import { About, Contact, Hero, Journey, Marquee, Skills } from './components/Sections';
import { Projects } from './components/Projects';

export default function App() {
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);

  useEffect(() => {
    initScroll();
  }, []);

  return (
    <LangProvider>
      <Space />
      <ShootingStars />
      <Earth />
      <div className="grain" aria-hidden />
      {!ready && <Preloader onDone={done} />}
      <Header />
      <SocialRail />
      <SectionDots />
      <main className={ready ? 'ready' : ''}>
        <Hero />
        <About />
        <Marquee />
        <Projects />
        <Journey />
        <Skills />
        <Contact />
      </main>
    </LangProvider>
  );
}
