import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useLang } from '../lib/i18n';
import { about, certs, contactText, journey, LINKS, skillGroups, toolsDev, toolsIt, ui } from '../lib/data';
import { scrollToId, scrollVelocity } from '../lib/scroll';
import {
  IconArrow, IconDownload, IconFacebook, IconGithub, IconInstagram, IconLinkedin, IconMail, IconPhone, IconWhatsapp,
} from './Icons';

/* Run once when the element first enters the viewport */
function useInView<T extends Element>(opts: IntersectionObserverInit = { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, opts);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, shown] as const;
}

/* Fade-up on first view */
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, shown] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal${shown ? ' in' : ''} ${className}`} style={{ ['--d' as string]: `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

/* Heading whose words rise out of a mask one after another (works for Arabic too: words are never split) */
function SplitTitle({ text }: { text: string }) {
  const [ref, shown] = useInView<HTMLHeadingElement>();
  return (
    <h2 ref={ref} className={`split${shown ? ' in' : ''}`} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span className="w" key={w + i} aria-hidden>
          <span style={{ ['--i' as string]: i } as CSSProperties}>{w}</span>
        </span>
      ))}
    </h2>
  );
}

export function SectionHead({ label, title }: { label: string; title?: string }) {
  return (
    <div className="sec-head">
      <Reveal><span className="eyebrow">{label}</span></Reveal>
      {title && <SplitTitle text={title} />}
    </div>
  );
}

/* ---------- Hero ---------- */
/** Typewriter for the role line: types, holds, deletes, next. */
function Roles() {
  const { lang } = useLang();
  const list = ui.roles[lang];
  const [text, setText] = useState('');

  useEffect(() => {
    let i = 0;
    let n = 0;
    let deleting = false;
    let t = 0;
    const tick = () => {
      const word = list[i % list.length];
      if (!deleting) {
        n += 1;
        setText(word.slice(0, n));
        if (n >= word.length) {
          deleting = true;
          t = window.setTimeout(tick, 1700);
          return;
        }
        t = window.setTimeout(tick, 70);
      } else {
        n -= 1;
        setText(word.slice(0, n));
        if (n <= 0) {
          deleting = false;
          i += 1;
          t = window.setTimeout(tick, 320);
          return;
        }
        t = window.setTimeout(tick, 34);
      }
    };
    t = window.setTimeout(tick, 900);
    return () => window.clearTimeout(t);
  }, [list]);

  return (
    <span className="roles" aria-label={list.join(' · ')}>
      <span aria-hidden>{text}</span>
      <i className="caret" aria-hidden />
    </span>
  );
}

export function Hero() {
  const { tr } = useLang();
  return (
    <section id="hero" className="hero">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <span className="status"><i /> {tr(ui.status)}</span>
          <p className="hello">{tr(ui.hello)}</p>
          <h1 className="hero-name">
            <span className="eng">{tr(ui.eng)}</span>
            <span className="n1"><span>{tr(ui.first)}</span></span>
            <span className="n2"><span className="name-fx" data-text={tr(ui.last)}>{tr(ui.last)}</span></span>
          </h1>
          <p className="hero-role"><Roles /></p>
          <p className="hero-line">{tr(ui.heroLine)}</p>
          <div className="cta">
            <button className="btn btn-accent" onClick={() => scrollToId('work')}>
              {tr(ui.seeWork)} <IconArrow width={18} height={18} className="flip" />
            </button>
            <button className="btn btn-ghost" onClick={() => scrollToId('contact')}>{tr(ui.getInTouch)}</button>
            <a className="btn btn-ghost btn-icon" href={LINKS.cv} download aria-label={tr(ui.cv)} title={tr(ui.cv)}>
              <IconDownload width={18} height={18} />
            </a>
          </div>
          <div className="hero-social">
            <a href={LINKS.github} target="_blank" rel="noreferrer" aria-label="GitHub"><IconGithub /></a>
            <a href={LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><IconLinkedin /></a>
            <a href={LINKS.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><IconInstagram /></a>
            <a href={LINKS.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><IconFacebook /></a>
          </div>
        </div>
      </div>
      <button className="scroll-cue" onClick={() => scrollToId('about')} aria-label={tr(ui.scroll)}>
        <span className="mouse"><i /></span>
        <span>{tr(ui.scroll)}</span>
      </button>
    </section>
  );
}

/* ---------- About ---------- */
function Counter({ n }: { n: string }) {
  const [ref, shown] = useInView<HTMLSpanElement>({ threshold: 0.5 });
  const [v, setV] = useState(0);
  const target = Number(n);
  useEffect(() => {
    if (!shown) return;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 1300);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [shown, target]);
  return <span ref={ref}>{v}</span>;
}

export function About() {
  const { tr } = useLang();
  return (
    <section id="about" className="section">
      <div className="wrap about-grid">
        <div>
          <SectionHead label={tr(ui.sections.about)} title={tr(about.title)} />
          <Reveal delay={80}><p className="lead">{tr(about.text)}</p></Reveal>
          <Reveal delay={140} className="stats">
            {about.stats.map((s) => (
              <div key={s.l.en} className="stat">
                <b><Counter n={s.n} />{s.suffix && <sup>{s.suffix}</sup>}</b>
                <span>{tr(s.l)}</span>
              </div>
            ))}
          </Reveal>
        </div>
        <Reveal delay={120} className="facts glass">
          {about.facts.map((f) => (
            <div key={f.k.en} className="fact">
              <small>{tr(f.k)}</small>
              <p>{tr(f.v)}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Toolkit: two crossing bands that speed up and lean with the scroll ---------- */
function Band({ dir, className, children }: { dir: 1 | -1; className: string; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = 0;
    let skew = 0;
    let boost = 0;
    let heading = 1; // flips when the user scrolls back up
    let last = performance.now();
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || reduced) return;
      const v = scrollVelocity();
      boost += (Math.min(6, Math.abs(v) * 0.25) - boost) * Math.min(1, dt * 6);
      skew += (Math.max(-9, Math.min(9, v * 0.35)) - skew) * Math.min(1, dt * 8);
      if (v > 1) heading = 1;
      else if (v < -1) heading = -1;
      const half = el.scrollWidth / 2;
      x -= dir * heading * (42 + boost * 90) * dt;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      el.style.transform = `translate3d(${x}px,0,0) skewX(${-skew * dir}deg)`;
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [dir]);

  return (
    <div className={`band ${className}`} dir="ltr">
      <div className="band-track" ref={track}>
        <div className="band-seq">{children}</div>
        <div className="band-seq" aria-hidden>{children}</div>
      </div>
    </div>
  );
}

export function Marquee() {
  const { tr } = useLang();
  return (
    <section className="toolkit" aria-label={tr(ui.sections.tools)}>
      <div className="wrap toolkit-head">
        <Reveal><span className="eyebrow">{tr(ui.sections.tools)}</span></Reveal>
      </div>
      <div className="bands">
        <Band dir={1} className="band-a">
          {toolsDev.map((t) => (
            <span className="big-word" key={t}>{t}<i aria-hidden>✦</i></span>
          ))}
        </Band>
        <Band dir={-1} className="band-b">
          {toolsIt.map((t) => (
            <span className="tool-chip" key={t.en}><i aria-hidden />{tr(t)}</span>
          ))}
        </Band>
      </div>
    </section>
  );
}

/* ---------- Journey: grouped timeline with a line that fills as you scroll ---------- */
export function Journey() {
  const { tr } = useLang();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      const trigger = window.innerHeight * 0.62;
      const p = Math.min(1, Math.max(0, (trigger - r.top) / r.height));
      el.style.setProperty('--p', String(p));
      el.querySelectorAll<HTMLElement>('.step, .tl-group').forEach((s) => {
        s.classList.toggle('active', s.getBoundingClientRect().top < trigger);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <section id="journey" className="section">
      <div className="wrap">
        <SectionHead label={tr(ui.sections.journey)} title={tr({ en: 'Education & experience', ar: 'التعليم والخبرة' })} />
        <div className="timeline" ref={box}>
          <span className="tl-line"><i /></span>
          {journey.map((g) => (
            <div className={`tl-block tl-${g.id}`} key={g.id}>
              <div className="tl-group">
                <span className="tl-diamond" />
                <span className="tl-label">{tr(g.title)}</span>
              </div>
              {g.steps.map((s) => (
                <div className="step" key={s.title.en}>
                  <span className="tl-dot" />
                  <div className="step-main">
                    <h3>{tr(s.title)}</h3>
                    <small>{tr(s.org)}</small>
                  </div>
                  <div className="step-when">{tr(s.when)}</div>
                  <p className="step-text">{tr(s.text)}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <Reveal className="certs-wrap">
          <h3 className="certs-title">{tr({ en: 'Certificates', ar: 'الشهادات' })}</h3>
          <div className="certs">
            {certs.map((c) => <span key={c.en} className="cert"><i />{tr(c)}</span>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Skills ---------- */
export function Skills() {
  const { tr } = useLang();
  return (
    <section id="skills" className="section">
      <div className="wrap">
        <SectionHead label={tr(ui.sections.skills)} title={tr({ en: 'What I work with', ar: 'ما أعمل به' })} />
        <div className="skill-grid">
          {skillGroups.map((g, i) => (
            <Reveal key={g.title.en} delay={(i % 3) * 70} className="skill-card glass">
              <h3>{tr(g.title)}</h3>
              <ul>
                {g.items.map((s) => (
                  <li key={s.name.en}>
                    <span>{tr(s.name)}</span>
                    <em>{tr(s.level)}</em>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
export function Contact() {
  const { tr } = useLang();
  const [name, setName] = useState('');
  const [reach, setReach] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState(false);
  const [copied, setCopied] = useState(false);

  const body = () =>
    `${msg.trim()}\n\n— ${name.trim() || '—'}${reach.trim() ? `\n${tr(contactText.reachLabel)}: ${reach.trim()}` : ''}`;

  const guard = () => {
    if (!msg.trim()) {
      setErr(true);
      return false;
    }
    setErr(false);
    return true;
  };

  const sendMail = () => {
    if (!guard()) return;
    const url = `mailto:${LINKS.email}?subject=${encodeURIComponent(`${tr(contactText.subject)}${name.trim() ? ' — ' + name.trim() : ''}`)}&body=${encodeURIComponent(body())}`;
    window.location.href = url;
  };
  const sendWa = () => {
    if (!guard()) return;
    window.open(`${LINKS.whatsapp}?text=${encodeURIComponent(body())}`, '_blank', 'noopener');
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${LINKS.email}`;
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="wrap contact-grid">
        <div>
          <SectionHead label={tr(ui.sections.contact)} title={tr(contactText.title)} />
          <Reveal delay={80}><p className="lead">{tr(contactText.text)}</p></Reveal>
          <Reveal delay={110}><span className="status reply"><i /> {tr(contactText.badge)}</span></Reveal>
          <Reveal delay={140} className="quick">
            <button className="btn btn-accent" onClick={copy}><IconMail width={18} height={18} /> {copied ? tr(contactText.copied) : tr(contactText.copy)}</button>
            <a className="btn btn-ghost" href={LINKS.whatsapp} target="_blank" rel="noreferrer" dir="ltr"><IconPhone width={18} height={18} /> {LINKS.phone}</a>
            <a className="btn btn-ghost" href={LINKS.cv} download><IconDownload width={18} height={18} /> {tr(ui.cv)}</a>
          </Reveal>
          <Reveal delay={200} className="quick small">
            <a className="btn btn-ghost" href={LINKS.linkedin} target="_blank" rel="noreferrer"><IconLinkedin width={18} height={18} /> LinkedIn</a>
            <a className="btn btn-ghost" href={LINKS.github} target="_blank" rel="noreferrer"><IconGithub width={18} height={18} /> GitHub</a>
            <a className="btn btn-ghost" href={LINKS.instagram} target="_blank" rel="noreferrer"><IconInstagram width={18} height={18} /> Instagram</a>
            <a className="btn btn-ghost" href={LINKS.facebook} target="_blank" rel="noreferrer"><IconFacebook width={18} height={18} /> Facebook</a>
          </Reveal>
        </div>

        <Reveal delay={120} className="form glass">
          <label>
            <span>{tr(contactText.name)}</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </label>
          <label>
            <span>{tr(contactText.reach)}</span>
            <input value={reach} onChange={(e) => setReach(e.target.value)} autoComplete="email" />
          </label>
          <label>
            <span>{tr(contactText.msg)}</span>
            <textarea rows={5} value={msg} onChange={(e) => { setMsg(e.target.value); setErr(false); }} aria-invalid={err} />
          </label>
          {err && <p className="err" role="alert">{tr(contactText.required)}</p>}
          <div className="form-btns">
            <button className="btn btn-accent" onClick={sendMail}><IconMail width={18} height={18} /> {tr(contactText.viaEmail)}</button>
            <button className="btn btn-wa" onClick={sendWa}><IconWhatsapp width={18} height={18} /> {tr(contactText.viaWa)}</button>
          </div>
          <p className="note">{tr(contactText.note)}</p>
        </Reveal>
      </div>

      <footer className="wrap footer">
        <span>© 2026 {tr(ui.eng)} {tr(ui.first)} {tr(ui.last)}</span>
        <button onClick={() => scrollToId('hero')} aria-label="Top">↑</button>
      </footer>
    </section>
  );
}
