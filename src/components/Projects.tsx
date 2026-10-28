import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { useLang } from '../lib/i18n';
import { modalText, projects, ui, type Project } from '../lib/data';
import { startScroll, stopScroll } from '../lib/scroll';
import { IconArrow, IconChevron, IconClose, IconDownload, IconGithub, QmpLogo } from './Icons';
import { Reveal, SectionHead } from './Sections';

function ProjectLogo({ p, size = 52 }: { p: Project; size?: number }) {
  if (p.logo.type === 'qmp') return <QmpLogo size={size} />;
  return (
    <span className="plogo" style={{ width: size, height: size, background: p.logo.bg }}>
      <img src={p.logo.src} alt="" width={size} height={size} loading="lazy" />
    </span>
  );
}

function LinkIcon({ kind }: { kind: 'repo' | 'live' | 'apk' }) {
  if (kind === 'repo') return <IconGithub width={17} height={17} />;
  if (kind === 'apk') return <IconDownload width={17} height={17} />;
  return <IconArrow width={17} height={17} />;
}

function Chips({ p }: { p: Project }) {
  const { tr } = useLang();
  const list = p.stack ?? (p.scope ?? []).map((x) => tr(x));
  return <div className={`tags${p.stack ? ' mono' : ''}`}>{list.map((t) => <span key={t}>{t}</span>)}</div>;
}

/** Device preview: two phones for the app, a browser window for dashboards. Sized to always fit its frame. */
function Mock({ p }: { p: Project }) {
  const { tr } = useLang();
  const [i, setI] = useState(0);
  const phone = p.shots[0].kind === 'phone';
  const cycle = phone ? p.shots.slice(0, 6) : p.shots;

  useEffect(() => {
    if (cycle.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % cycle.length), 3000);
    return () => window.clearInterval(t);
  }, [cycle.length]);

  if (phone) {
    const back = p.shots[(i + 2) % p.shots.length];
    return (
      <div className="mock phones">
        <div className="phone back"><img src={back.src} alt="" loading="lazy" /></div>
        <div className="phone front">
          {cycle.map((s, k) => (
            <img key={s.src} src={s.src} alt={tr(s.alt)} loading="lazy" className={k === i ? 'on' : ''} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="mock browser">
      <div className="bar"><i /><i /><i /><span /></div>
      <img src={p.shots[0].src} alt={tr(p.shots[0].alt)} loading="lazy" />
    </div>
  );
}

function ProjectCard({ p, index, total, onOpen }: { p: Project; index: number; total: number; onOpen: () => void }) {
  const { tr } = useLang();
  const ref = useRef<HTMLElement>(null);

  const move = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div className="proj-slot" style={{ ['--k' as string]: index }}>
      <Reveal>
        <article ref={ref} className={`proj glass${index % 2 ? ' alt' : ''}`} onPointerMove={move}>
          <span className="glare" />
          <div className="proj-media">
            <span className="proj-num" dir="ltr">{String(index + 1).padStart(2, '0')}<small>/{String(total).padStart(2, '0')}</small></span>
            <Mock p={p} />
          </div>
          <div className="proj-body">
            <span className="badge">{tr(p.badge)}</span>
            <div className="proj-head">
              <ProjectLogo p={p} />
              <div>
                <h3>{tr(p.name)}</h3>
                {p.sub && <small>{tr(p.sub)}</small>}
              </div>
            </div>
            <p className="caption">{tr(p.caption)}</p>
            <Chips p={p} />
            <div className="proj-actions">
              <button className="btn btn-accent btn-sm" onClick={onOpen}>{tr(modalText.caseStudy)} <IconChevron width={16} height={16} className="flip" /></button>
              {p.links.map((l) => (
                <a key={l.href} className="btn btn-ghost btn-sm" href={l.href} target="_blank" rel="noreferrer">
                  <LinkIcon kind={l.kind} /> {tr(l.label)}
                </a>
              ))}
            </div>
          </div>
        </article>
      </Reveal>
    </div>
  );
}

function Modal({ p, onClose }: { p: Project; onClose: () => void }) {
  const { tr } = useLang();
  const [i, setI] = useState(0);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const touch = useRef(0);
  const n = p.shots.length;
  const step = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);

  useEffect(() => {
    stopScroll();
    closeBtn.current?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      const rtl = document.documentElement.dir === 'rtl';
      if (e.key === 'ArrowRight') step(rtl ? -1 : 1);
      if (e.key === 'ArrowLeft') step(rtl ? 1 : -1);
    };
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('keydown', key);
      startScroll();
    };
  }, [onClose, step]);

  useEffect(() => {
    thumbs.current?.querySelector<HTMLElement>('.on')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [i]);

  const shot = p.shots[i];
  return createPortal(
    <div className="modal-back" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={tr(p.name)} data-lenis-prevent onClick={(e) => e.stopPropagation()}>
        <button ref={closeBtn} className="modal-x" onClick={onClose} aria-label={tr(modalText.close)} title={tr(modalText.close)}>
          <IconClose width={22} height={22} />
        </button>

        <div className="gallery">
          <div
            className={`stage is-${shot.kind}`}
            onPointerDown={(e) => { touch.current = e.clientX; }}
            onPointerUp={(e) => {
              const d = e.clientX - touch.current;
              if (Math.abs(d) > 50) step(d < 0 ? 1 : -1);
            }}
          >
            {shot.kind === 'phone' ? (
              <div className="phone big"><img key={shot.src} src={shot.src} alt={tr(shot.alt)} /></div>
            ) : (
              <div className="mock browser big"><div className="bar"><i /><i /><i /><span /></div><img key={shot.src} src={shot.src} alt={tr(shot.alt)} /></div>
            )}
            {n > 1 && (
              <>
                <button className="nav-btn prev" onClick={() => step(-1)} aria-label={tr(modalText.prev)}><IconChevron className="flip-rev" /></button>
                <button className="nav-btn next" onClick={() => step(1)} aria-label={tr(modalText.next)}><IconChevron className="flip" /></button>
              </>
            )}
          </div>
          <div className="shot-cap">
            <span>{tr(shot.alt)}</span>
            {n > 1 && <b dir="ltr">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</b>}
          </div>
          {n > 1 && (
            <div className="thumbs" ref={thumbs}>
              {p.shots.map((s, k) => (
                <button key={s.src} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={tr(s.alt)}>
                  <img src={s.src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="modal-body">
          <span className="badge">{tr(p.badge)}</span>
          <div className="proj-head">
            <ProjectLogo p={p} size={58} />
            <div>
              <h3>{tr(p.name)}</h3>
              <small>{tr(p.role)}</small>
            </div>
          </div>
          <p className="caption">{tr(p.caption)}</p>

          <div className="ps">
            <div className="ps-card"><h4>{tr(modalText.problem)}</h4><p>{tr(p.problem)}</p></div>
            <div className="ps-card"><h4>{tr(modalText.solution)}</h4><p>{tr(p.solution)}</p></div>
          </div>

          <h4>{tr(modalText.features)}</h4>
          <ul className="feat">{p.features.map((f) => <li key={f.en}>{tr(f)}</li>)}</ul>

          <h4>{tr(p.stack ? modalText.stack : modalText.scope)}</h4>
          <Chips p={p} />

          {p.note && <p className="note">{tr(p.note)}</p>}

          {p.links.length > 0 && (
            <div className="proj-actions">
              {p.links.map((l) => (
                <a key={l.href} className={`btn btn-sm ${l.kind === 'apk' || l.kind === 'live' ? 'btn-accent' : 'btn-ghost'}`} href={l.href} target="_blank" rel="noreferrer">
                  <LinkIcon kind={l.kind} /> {tr(l.label)}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function Projects() {
  const { tr } = useLang();
  const [open, setOpen] = useState<string | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const current = projects.find((p) => p.id === open);
  const list = useRef<HTMLDivElement>(null);

  // Cards stack while scrolling (sticky); each covered card recedes as the next one slides over it.
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const update = () => {
      const slots = Array.from(el.querySelectorAll<HTMLElement>('.proj-slot'));
      slots.forEach((s, k) => {
        const next = slots[k + 1];
        let cover = 0;
        if (next) {
          const a = s.getBoundingClientRect();
          const b = next.getBoundingClientRect();
          cover = Math.min(1, Math.max(0, (a.bottom - b.top) / a.height));
        }
        s.style.setProperty('--cover', cover.toFixed(3));
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
    <section id="work" className="section">
      <div className="wrap">
        <SectionHead label={tr(ui.sections.work)} title={tr({ en: 'Projects I built', ar: 'مشاريع نفّذتها' })} />
        <div className="proj-list" ref={list}>
          {projects.map((p, i) => <ProjectCard key={p.id} p={p} index={i} total={projects.length} onOpen={() => setOpen(p.id)} />)}
        </div>
      </div>
      {current && <Modal p={current} onClose={close} />}
    </section>
  );
}
