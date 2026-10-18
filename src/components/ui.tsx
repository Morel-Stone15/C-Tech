import type { CSSProperties, ReactNode } from "react";
import { IconArrow } from "./icons";

/** Délai de révélation en cascade (ms). */
export const dly = (ms: number): CSSProperties => ({ "--rd": `${ms}ms` }) as CSSProperties;

/* ---------- Étiquette de section ---------- */
export function Eyebrow({
  children,
  tone = "dark",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] ${
        tone === "light"
          ? "bg-white/10 text-cyan-soft ring-1 ring-white/15"
          : "bg-indigo-brand/8 text-indigo-brand ring-1 ring-indigo-brand/15"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-bright" aria-hidden="true" />
      {children}
    </span>
  );
}

/* ---------- Titre de section ---------- */
export function SectionHead({
  eyebrow,
  title,
  text,
  tone = "dark",
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
}) {
  const c = align === "center";
  return (
    <div data-reveal className={c ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        className={`mt-4 font-display text-[clamp(1.65rem,6vw,3rem)] font-bold leading-[1.08] tracking-[-0.03em] sm:mt-5 ${
          tone === "light" ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {text && (
        <p
          className={`mt-4 text-[15px] leading-relaxed ${c ? "mx-auto" : ""} ${
            tone === "light" ? "text-white/65" : "text-slate-body"
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );
}

/* ---------- Boutons (Dimensions calquées sur le Hackathon) ---------- */
const baseBtn =
  "group/b relative inline-flex items-center justify-center gap-2.5 min-h-[48px] rounded-full px-6 py-3 text-[14.5px] sm:text-[15px] font-extrabold tracking-[0.01em] transition-all duration-300";

export function GradButton({
  href,
  children,
  onClick,
  type,
  full = false,
}: {
  href?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  full?: boolean;
}) {
  const cls = `${baseBtn} grad-brand text-white shadow-[0_10px_28px_-10px_rgba(75,42,232,0.7)] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_-12px_rgba(75,42,232,0.85)] ${
    full ? "w-full" : ""
  }`;
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <IconArrow className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/b:translate-x-1" />
    </>
  );
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <button type={type ?? "button"} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function GhostButton({
  href,
  children,
  tone = "dark",
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  const cls =
    tone === "light"
      ? `${baseBtn} border border-white/25 text-white hover:-translate-y-0.5 hover:border-cyan-bright hover:bg-white/5`
      : `${baseBtn} border border-ink/12 bg-white text-ink hover:-translate-y-0.5 hover:border-indigo-brand/40 hover:text-indigo-brand`;
  return (
    <a href={href} className={cls}>
      <span>{children}</span>
      <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover/b:translate-x-1" />
    </a>
  );
}

/* ---------- Badge techno ---------- */
const TECH_COLORS: Record<string, string> = {
  React: "bg-cyan-bright/12 text-cyan-700 ring-cyan-bright/25",
  "Next.js": "bg-ink/8 text-ink ring-ink/15",
  Python: "bg-blue-electric/10 text-blue-electric ring-blue-electric/25",
  Figma: "bg-violet-pop/10 text-violet-pop ring-violet-pop/25",
  "Node.js": "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25",
  Flutter: "bg-sky-500/10 text-sky-700 ring-sky-500/25",
  TensorFlow: "bg-orange-500/10 text-orange-700 ring-orange-500/25",
  Arduino: "bg-teal-500/10 text-teal-700 ring-teal-500/25",
  Solidity: "bg-slate-500/10 text-slate-700 ring-slate-500/25",
  Supabase: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25",
  Rust: "bg-amber-600/10 text-amber-700 ring-amber-600/25",
  "Three.js": "bg-indigo-brand/10 text-indigo-brand ring-indigo-brand/25",
};

export function TechBadge({ name }: { name: string }) {
  const c = TECH_COLORS[name] ?? "bg-indigo-brand/8 text-indigo-brand ring-indigo-brand/20";
  return (
    <span className={`rounded-md px-2 py-1 text-[10.5px] font-semibold ring-1 ${c}`}>{name}</span>
  );
}
