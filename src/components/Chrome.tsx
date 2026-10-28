import { useEffect, useRef, useState } from 'react';
import { useLang } from '../lib/i18n';
import { LINKS, themes, ui } from '../lib/data';
import { SECTIONS, scrollToId, startScroll, stopScroll } from '../lib/scroll';
import { startAmbient, stopAmbient } from '../lib/audio';
import {
  IconDownload, IconFacebook, IconGithub, IconInstagram, IconLinkedin, IconMenu, IconClose, IconSound, Logo,
} from './Icons';

/* ---------- Preloader ---------- */
export function Preloader({ onDone }: { onDone: () => void }) {
  const { tr } = useLang();
  const [leaving, setLeaving] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    stopScroll();
    const quick = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const total = quick ? 300 : 2500;
    const t0 = performance.now();
    let raf = 0;
    const count = (t: number) => {
      const p = Math.min(1, (t - t0) / total);
      setPct(Math.round(100 * (1 - Math.pow(1 - p, 2.2))));
      if (p < 1) raf = requestAnimationFrame(count);
    };
    raf = requestAnimationFrame(count);
    const t1 = window.setTimeout(() => setLeaving(true), total + 150);
    const t2 = window.setTimeout(() => {
      startScroll();
      onDone();
    }, total + (quick ? 400 : 1250));
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className={`preloader${leaving ? ' leave' : ''}`} role="status" aria-label="Loading">
      <span className="pre-curtain top" />
      <span className="pre-curtain bottom" />
      <div className="pre-inner">
        <div className="pre-logo">
          <span className="pre-orbit" />
          <Logo size={128} draw />
        </div>
        <div className="pre-name">
          <span>{tr(ui.eng)}</span> {tr(ui.first)} {tr(ui.last)}
        </div>
        <div className="pre-role">WEB · APPS · SYSTEMS</div>
        <div className="pre-meter" dir="ltr">
          <div className="pre-bar"><i style={{ transform: `scaleX(${pct / 100})` }} /></div>
          <b>{String(pct).padStart(3, '0')}</b>
        </div>
      </div>
    </div>
  );
}

/* ---------- Theme swatches ---------- */
const DEFAULT_THEME = themes[0].id;

export function ThemeSwitcher() {
  const { tr } = useLang();
  const [id, setId] = useState(() => document.documentElement.dataset.theme || DEFAULT_THEME);

  const apply = (next: string) => {
    setId(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event('themechange'));
  };

  useEffect(() => {
    const sync = () => setId(document.documentElement.dataset.theme || DEFAULT_THEME);
    window.addEventListener('themechange', sync);
    return () => window.removeEventListener('themechange', sync);
  }, []);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('theme');
    } catch {
      /* ignore */
    }
    if (saved && themes.some((t) => t.id === saved)) apply(saved);
    else window.dispatchEvent(new Event('themechange'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="swatches" role="group" aria-label={tr(ui.theme)}>
      {themes.map((t) => (
        <button
          key={t.id}
          className={`swatch${id === t.id ? ' on' : ''}`}
          style={{ ['--sw' as string]: t.a, ['--sw2' as string]: t.b }}
          onClick={() => apply(t.id)}
          title={tr(t.name)}
          aria-label={tr(t.name)}
          aria-pressed={id === t.id}
        />
      ))}
    </div>
  );
}

export function MusicToggle() {
  const { tr } = useLang();
  const [on, setOn] = useState(false);
  return (
    <button
      className={`icon-btn music${on ? ' on' : ''}`}
      title={tr(ui.music)}
      aria-label={tr(ui.music)}
      aria-pressed={on}
      onClick={() => {
        if (on) stopAmbient();
        else startAmbient();
        setOn(!on);
      }}
    >
      {on ? <span className="eq" aria-hidden><i /><i /><i /><i /></span> : <IconSound on={false} />}
    </button>
  );
}

/* ---------- Header ---------- */
export function Header() {
  const { lang, setLang, tr } = useLang();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      bar.current?.style.setProperty('--p', String(p));
      setSolid(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  const navItems = SECTIONS.filter((s) => s !== 'hero') as Exclude<(typeof SECTIONS)[number], 'hero'>[];

  return (
    <header className={`header${solid ? ' solid' : ''}`}>
      <div className="progress" ref={bar} />
      <div className="wrap header-in">
        <a className="brand" href="#hero" onClick={(e) => { e.preventDefault(); go('hero'); }} aria-label="Home">
          <Logo size={38} />
          <span className="brand-t">
            <b>{tr(ui.first)} {tr(ui.last)}</b>
            <small>{tr(ui.eng)} · WEB &amp; APP</small>
          </span>
        </a>

        <nav className="nav" aria-label="Main">
          {navItems.map((s) => (
            <a key={s} href={`#${s}`} onClick={(e) => { e.preventDefault(); go(s); }}>
              {tr(ui.nav[s as keyof typeof ui.nav])}
            </a>
          ))}
        </nav>

        <div className="tools">
          <ThemeSwitcher />
          <MusicToggle />
          <button className="pill" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} aria-label="Language">
            {lang === 'en' ? 'العربية' : 'EN'}
          </button>
          <a className="btn btn-accent btn-sm hide-sm" href={LINKS.cv} download>
            <IconDownload width={16} height={16} /> {tr(ui.cv)}
          </a>
          <button className="icon-btn menu-btn" aria-label={tr(ui.menu)} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      <div className={`drawer${open ? ' open' : ''}`}>
        {navItems.map((s) => (
          <a key={s} href={`#${s}`} onClick={(e) => { e.preventDefault(); go(s); }}>
            {tr(ui.nav[s as keyof typeof ui.nav])}
          </a>
        ))}
        <div className="drawer-tools">
          <ThemeSwitcher />
          <MusicToggle />
        </div>
        <a className="btn btn-accent" href={LINKS.cv} download>
          <IconDownload width={16} height={16} /> {tr(ui.cv)}
        </a>
      </div>
    </header>
  );
}

/* ---------- Side rails ---------- */
export function SocialRail() {
  const items = [
    { href: LINKS.github, label: 'GitHub', icon: <IconGithub /> },
    { href: LINKS.linkedin, label: 'LinkedIn', icon: <IconLinkedin /> },
    { href: LINKS.instagram, label: 'Instagram', icon: <IconInstagram /> },
    { href: LINKS.facebook, label: 'Facebook', icon: <IconFacebook /> },
  ];
  return (
    <aside className="social-rail" aria-label="Social links">
      {items.map((i) => (
        <a key={i.label} href={i.href} target="_blank" rel="noreferrer" aria-label={i.label} title={i.label}>
          {i.icon}
        </a>
      ))}
      <span className="rail-line" />
    </aside>
  );
}

export function SectionDots() {
  const { tr } = useLang();
  const wrap = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => {
      const tops = SECTIONS.map((id) => document.getElementById(id)?.getBoundingClientRect().top ?? 0);
      const mid = window.innerHeight * 0.5;
      let idx = 0;
      tops.forEach((t, i) => {
        if (t <= mid) idx = i;
      });
      setActive(idx);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      wrap.current?.style.setProperty('--p', String(max > 0 ? window.scrollY / max : 0));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const labels = { hero: { en: 'Home', ar: 'الرئيسية' }, ...ui.nav };
  return (
    <nav className="dots" ref={wrap} aria-label="Sections">
      <span className="dots-line"><i /></span>
      {SECTIONS.map((s, i) => (
        <button key={s} className={`dot${i <= active ? ' passed' : ''}${i === active ? ' on' : ''}`} onClick={() => scrollToId(s)} aria-label={tr(labels[s])}>
          <em>{tr(labels[s])}</em>
        </button>
      ))}
    </nav>
  );
}

/* ---------- Shooting stars: an occasional streak across the sky ---------- */
export function ShootingStars() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; a: number; d: number }[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let id = 0;
    let t = 0;
    const spawn = () => {
      const s = { id: id++, x: 10 + Math.random() * 80, y: Math.random() * 45, a: 18 + Math.random() * 22, d: 0.9 + Math.random() * 0.7 };
      setStars((list) => [...list.slice(-2), s]);
      t = window.setTimeout(spawn, 5000 + Math.random() * 9000);
    };
    t = window.setTimeout(spawn, 4000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="shooting" aria-hidden>
      {stars.map((s) => (
        <i
          key={s.id}
          style={{ left: `${s.x}%`, top: `${s.y}%`, ['--a' as string]: `${s.a}deg`, animationDuration: `${s.d}s` }}
        />
      ))}
    </div>
  );
}
