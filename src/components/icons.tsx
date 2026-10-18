import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function S({ children, ...p }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      {children}
    </svg>
  );
}

/* ---------- Activités ---------- */
export const IconRocket = (p: P) => (
  <S {...p}>
    <path d="M12.5 3.5c3.4 1 5.8 4 6 7.6l-4.6 4.6-4.6-4.6c.2-3.6 2.6-6.6 6-7.6Z" />
    <circle cx="12.5" cy="10.2" r="1.9" />
    <path d="M9.3 15.7 6.6 18.4M7.5 13.9 4.8 16.6l.4 3.2 3.2.4 2.7-2.7" />
    <path d="M17.4 15.7 20 18.4" />
  </S>
);
export const IconBook = (p: P) => (
  <S {...p}>
    <path d="M4 5.2A2 2 0 0 1 6 3.5h5.2v15H6A2 2 0 0 0 4 20.5Z" />
    <path d="M20 5.2a2 2 0 0 0-2-1.7h-5.2v15H18a2 2 0 0 1 2 2Z" />
  </S>
);
export const IconBranch = (p: P) => (
  <S {...p}>
    <circle cx="7" cy="5.5" r="2.2" />
    <circle cx="7" cy="18.5" r="2.2" />
    <circle cx="17" cy="9.5" r="2.2" />
    <path d="M7 7.7v8.6" />
    <path d="M17 11.7c0 3-2.6 4.3-6.2 4.9" />
  </S>
);
export const IconMic = (p: P) => (
  <S {...p}>
    <rect x="9.3" y="2.8" width="5.4" height="10.4" rx="2.7" />
    <path d="M5.5 11.2a6.5 6.5 0 0 0 13 0" />
    <path d="M12 17.7v3.5M8.8 21.2h6.4" />
  </S>
);
export const IconCompass = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1Z" />
  </S>
);
export const IconTrophy = (p: P) => (
  <S {...p}>
    <path d="M7.5 3.8h9v5a4.5 4.5 0 0 1-9 0Z" />
    <path d="M7.5 5.3H5a2.2 2.2 0 0 0 2.5 3.9M16.5 5.3H19a2.2 2.2 0 0 1-2.5 3.9" />
    <path d="M12 13.3v3.4M8.8 20.2h6.4l-.7-3.5H9.5Z" />
  </S>
);

/* ---------- Génériques ---------- */
export const IconArrow = (p: P) => (
  <S {...p}>
    <path d="M4 12h15" />
    <path d="m13.5 6 6 6-6 6" />
  </S>
);
export const IconArrowUR = (p: P) => (
  <S {...p}>
    <path d="M6.5 17.5 17.5 6.5" />
    <path d="M8.5 6.5h9v9" />
  </S>
);
export const IconCheck = (p: P) => (
  <S strokeWidth={2.2} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </S>
);
export const IconSpark = (p: P) => (
  <S {...p}>
    <path d="m12 3 1.9 5.4L19.5 10l-5.6 1.6L12 17l-1.9-5.4L4.5 10l5.6-1.6Z" />
    <path d="m18.5 16.5.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z" />
  </S>
);
export const IconCalendar = (p: P) => (
  <S {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.2" />
    <path d="M3.5 9.8h17M8.2 3v4M15.8 3v4" />
  </S>
);
export const IconPin = (p: P) => (
  <S {...p}>
    <path d="M12 21s-6.5-5.3-6.5-10a6.5 6.5 0 0 1 13 0c0 4.7-6.5 10-6.5 10Z" />
    <circle cx="12" cy="10.6" r="2.3" />
  </S>
);
export const IconClock = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 7.4V12l3 2.2" />
  </S>
);
export const IconUsers = (p: P) => (
  <S {...p}>
    <circle cx="9" cy="8" r="3.3" />
    <path d="M3.2 19.6a5.8 5.8 0 0 1 11.6 0" />
    <path d="M16 5.2a3.3 3.3 0 0 1 0 6.4M17.6 14.6a5.8 5.8 0 0 1 3.2 5" />
  </S>
);
export const IconMail = (p: P) => (
  <S {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 7 7.5 6 7.5-6" />
  </S>
);
export const IconPlay = (p: P) => (
  <S {...p}>
    <path d="M8.5 6.2 17.8 12l-9.3 5.8Z" />
  </S>
);

/* ---------- Réseaux ---------- */
export const IconDiscord = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M19.6 5.6A16.7 16.7 0 0 0 15.5 4.3l-.2.4a12.6 12.6 0 0 1 3.7 1.9 15.7 15.7 0 0 0-14 0 12.6 12.6 0 0 1 3.7-1.9l-.2-.4A16.7 16.7 0 0 0 4.4 5.6C1.8 9.5 1.1 13.3 1.4 17a16.9 16.9 0 0 0 5.1 2.6l1.1-1.7a11 11 0 0 1-1.7-.8l.4-.3a11.9 11.9 0 0 0 10.2 0l.4.3a11 11 0 0 1-1.7.8l1.1 1.7a16.9 16.9 0 0 0 5.1-2.6c.4-4.3-.7-8.1-1.8-11.4ZM8.5 14.7c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
  </svg>
);
export const IconGithub = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  </svg>
);
export const IconFacebook = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
export const IconLinkedin = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M4.98 3.5a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2ZM3.4 9.2h3.2v11.3H3.4V9.2Zm5.6 0h3.05v1.55h.05c.43-.8 1.47-1.66 3.02-1.66 3.23 0 3.83 2.07 3.83 4.76v6.65h-3.2v-5.9c0-1.4-.03-3.2-2.05-3.2-2.05 0-2.36 1.6-2.36 3.1v6h-3.38V9.2Z" />
  </svg>
);

/* ============================================================
   MARQUE — silhouettes connectées en dégradé indigo → cyan
   ============================================================ */
export function LogoMark({ className = "", id = "lm" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-indigo-deep)" />
          <stop offset="100%" stopColor="var(--color-indigo-brand)" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-indigo-brand)" />
          <stop offset="100%" stopColor="var(--color-cyan-bright)" />
        </linearGradient>
      </defs>
      <g transform="rotate(-45 32 32)" fill="none" strokeWidth="9" strokeLinecap="round">
        <path d="M15 25h13a6 6 0 0 1 0 12h-5" stroke={`url(#${id}-a)`} />
        <path d="M49 39H36a6 6 0 0 1 0-12h5" stroke={`url(#${id}-b)`} />
      </g>
      <circle cx="46.5" cy="14.5" r="5.2" fill="var(--color-cyan-bright)" />
      <circle cx="17.5" cy="49.5" r="5.2" fill="var(--color-indigo-deep)" />
    </svg>
  );
}

export function Brand({
  tone = "dark",
  compact = false,
}: {
  tone?: "dark" | "light";
  compact?: boolean;
}) {
  return (
    <a href="#accueil" className="group flex items-center gap-2.5" aria-label="CLUB-Tech — Accueil">
      <LogoMark className="h-8 w-8 shrink-0 transition-transform duration-500 group-hover:rotate-[90deg] md:h-9 md:w-9" />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[16px] md:text-[19px] tracking-[-0.02em] ${
            tone === "light" ? "text-white" : "text-ink"
          }`}
        >
          <span className="font-bold">CLUB-T</span>
          <span className="font-normal">ech</span>
        </span>
        {!compact && (
          <span
            className={`mt-1 text-[7.5px] font-semibold uppercase tracking-[0.3em] ${
              tone === "light" ? "text-cyan-soft" : "text-indigo-brand/70"
            }`}
          >
            Initiative universitaire
          </span>
        )}
      </span>
    </a>
  );
}
