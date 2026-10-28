import { useId, type SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (p: P): P => ({ width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true, ...p });
const stroke = { stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** HS monogram on a small planet with an orbit and a satellite. Strokes use pathLength=1 so they can be drawn on. */
export function Logo({ size = 40, draw = false }: { size?: number; draw?: boolean }) {
  const id = 'lg' + useId().replace(/:/g, '');
  const orbit = 'M4 50A46 14 0 1 1 96 50A46 14 0 1 1 4 50';
  return (
    <svg className={draw ? 'logo logo-draw' : 'logo'} width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      <defs>
        <linearGradient id={id} x1="12" y1="12" x2="88" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent2)" />
        </linearGradient>
        <radialGradient id={id + 'p'} cx="38" cy="34" r="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--bg)" stopOpacity="0.96" />
        </radialGradient>
      </defs>
      <g transform="rotate(-24 50 50)">
        <path className="l-orbit l-back" pathLength={1} d="M4 50A46 14 0 0 1 96 50" stroke={`url(#${id})`} strokeWidth="2.6" strokeLinecap="round" opacity="0.55" />
      </g>
      <circle className="l-ring" pathLength={1} cx="50" cy="50" r="33" fill={`url(#${id}p)`} stroke={`url(#${id})`} strokeWidth="3" />
      <path className="l-h" pathLength={1} d="M33 37V63M33 50H46M46 37V63" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        className="l-s"
        pathLength={1}
        d="M68 37H58.5Q54 37 54 41.5V45.5Q54 50 58.5 50H63.5Q68 50 68 54.5V58.5Q68 63 63.5 63H54"
        stroke={`url(#${id})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g transform="rotate(-24 50 50)">
        <path d="M4 50A46 14 0 0 0 96 50" stroke="var(--bg)" strokeWidth="7" strokeLinecap="round" className="l-gap" />
        <path className="l-orbit" pathLength={1} d="M4 50A46 14 0 0 0 96 50" stroke={`url(#${id})`} strokeWidth="2.6" strokeLinecap="round" />
        <circle className="l-sat" r="3.6" fill="var(--accent2)">
          <animateMotion dur="7s" repeatCount="indefinite" path={orbit} rotate="auto" />
        </circle>
      </g>
    </svg>
  );
}

export const IconGithub = (p: P) => (
  <svg {...base(p)} fill="currentColor">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);
export const IconLinkedin = (p: P) => (
  <svg {...base(p)} fill="currentColor">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.5H3V9.75Zm6.5 0h3.83v1.57h.06c.53-1 1.84-2.07 3.78-2.07 4.04 0 4.78 2.66 4.78 6.12v5.88h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.29h-4V9.75Z" />
  </svg>
);
export const IconInstagram = (p: P) => (
  <svg {...base(p)} {...stroke}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
  </svg>
);
export const IconFacebook = (p: P) => (
  <svg {...base(p)} fill="currentColor">
    <path d="M14 8.5V6.9c0-.77.18-1.15 1.4-1.15H17V2.1C16.7 2.06 15.75 2 14.65 2 12.3 2 10.7 3.4 10.7 6.1v2.4H8v3.7h2.7V22H14V12.2h2.55l.45-3.7H14Z" />
  </svg>
);
export const IconWhatsapp = (p: P) => (
  <svg {...base(p)} fill="currentColor">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.46 15.03L2 22l5.1-1.55A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.02.92.93-2.95-.2-.31a8.2 8.2 0 1 1 6.77 3.66Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.22-.09-.39-.12-.55.12-.16.25-.63.8-.78.97-.14.16-.28.18-.53.06a6.7 6.7 0 0 1-3.3-2.88c-.25-.43.25-.4.71-1.32.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.66.31c-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.74 2.65 4.2 3.72 1.56.67 2.17.73 2.95.62.48-.07 1.46-.6 1.67-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.47-.28Z" />
  </svg>
);
export const IconMail = (p: P) => (
  <svg {...base(p)} {...stroke}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7.5 8 6 8-6" />
  </svg>
);
export const IconPhone = (p: P) => (
  <svg {...base(p)} {...stroke}>
    <path d="M5 4h3.5l1.8 4.5-2.2 1.4a11 11 0 0 0 5 5l1.4-2.2L19 14.5V18a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
export const IconDownload = (p: P) => (
  <svg {...base(p)} {...stroke}>
    <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" />
  </svg>
);
export const IconArrow = (p: P) => (
  <svg {...base(p)} {...stroke}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);
export const IconClose = (p: P) => (
  <svg {...base(p)} {...stroke}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);
export const IconChevron = (p: P) => (
  <svg {...base(p)} {...stroke}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export const IconMenu = (p: P) => (
  <svg {...base(p)} {...stroke}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const IconSound = (p: P & { on?: boolean }) => {
  const { on, ...rest } = p;
  return (
    <svg {...base(rest)} {...stroke}>
      <path d="M4 10v4h3l4 3V7l-4 3H4Z" />
      {on ? <path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11" /> : <path d="m16 9 5 6m0-6-5 6" />}
    </svg>
  );
};
export const IconPackage = (p: P) => (
  <svg {...base(p)} {...stroke}>
    <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 9 8-4.5M12 12 4 7.5M12 12v9" />
  </svg>
);
export const IconCode = (p: P) => (
  <svg {...base(p)} {...stroke}>
    <path d="m8 8-4 4 4 4m8-8 4 4-4 4M14 5l-4 14" />
  </svg>
);

/** QMP badge, redrawn to match the company's dashboard header (amber tile with a cut corner). */
export function QmpLogo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <path d="M8 6h48a2 2 0 0 1 2 2v34l-14 16H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" fill="#f5b800" />
      <path d="M44 58V46a2 2 0 0 1 2-2h12Z" fill="#c78f00" />
      <text x="29" y="38" textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fontSize="19" fill="#141c2b" letterSpacing="0.5">
        QMP
      </text>
    </svg>
  );
}
