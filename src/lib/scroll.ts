import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function initScroll(): Lenis {
  if (lenis) return lenis;
  lenis = new Lenis({ autoRaf: true, lerp: 0.085, smoothWheel: true });
  return lenis;
}

/** Current scroll speed in px/frame (signed). Used for warp and marquee effects. */
export function scrollVelocity(): number {
  return lenis?.velocity ?? 0;
}

export function stopScroll() {
  lenis?.stop();
  document.documentElement.style.overflow = 'hidden';
}

export function startScroll() {
  lenis?.start();
  document.documentElement.style.overflow = '';
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: id === 'hero' ? 0 : -64, duration: 1.6 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export const SECTIONS = ['hero', 'about', 'work', 'journey', 'skills', 'contact'] as const;

/** Scroll position (px) at which each section's top reaches the viewport top. */
export function sectionAnchors(): number[] {
  return SECTIONS.map((id) => {
    const el = document.getElementById(id);
    return el ? el.getBoundingClientRect().top + window.scrollY : 0;
  });
}

/**
 * Index of the current section and 0..1 progress of the move towards the next one.
 * The move happens while the next section rises through the viewport, so each pose
 * holds while its section is being read and is exact at the top of the page.
 */
export function sectionProgress(anchors: number[], y = window.scrollY, vh = window.innerHeight) {
  let i = 0;
  while (i < anchors.length - 1 && y >= anchors[i + 1]) i++;
  if (i >= anchors.length - 1) return { i, f: 0 };
  const end = anchors[i + 1];
  const start = Math.max(anchors[i], end - vh);
  const f = Math.min(1, Math.max(0, (y - start) / Math.max(1, end - start)));
  return { i, f };
}
