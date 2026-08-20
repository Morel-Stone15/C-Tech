import { useEffect, useState } from "react";
import { Brand } from "./icons";
import { useScrollLock, useScrollSpy } from "../lib/hooks";

const LINKS: [string, string][] = [
  ["Accueil", "accueil"],
  ["Membres", "membres"],
  ["Ressources", "ressources"],
  ["Projets", "projets"],
  ["Événements", "evenements"],
  ["Rejoindre", "rejoindre"],
];

const IDS = LINKS.map(([, id]) => id);

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(IDS);
  useScrollLock(open);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 20);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/85 py-2.5 shadow-[0_1px_0_rgba(11,16,32,0.06),0_12px_30px_-22px_rgba(11,16,32,0.4)] backdrop-blur-xl"
          : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8">
        <Brand tone={scrolled ? "dark" : "light"} />

        {/* Nav desktop — pilule flottante */}
        <nav
          className={`hidden items-center gap-1 rounded-full p-1.5 transition-colors duration-500 lg:flex ${
            scrolled ? "bg-paper-2/80" : "bg-white/10 ring-1 ring-white/15 backdrop-blur-md"
          }`}
          aria-label="Navigation principale"
        >
          {LINKS.map(([label, id]) => {
            const on = active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={on ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 ${
                  on
                    ? "grad-brand text-white shadow-[0_6px_18px_-6px_rgba(75,42,232,0.7)]"
                    : scrolled
                      ? "text-ink/65 hover:bg-white hover:text-ink"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#rejoindre"
            className="grad-brand hidden rounded-full px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_22px_-8px_rgba(75,42,232,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-8px_rgba(75,42,232,0.9)] md:inline-flex"
          >
            Rejoindre le club
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className={`flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-xl transition-colors duration-300 lg:hidden ${
              open ? "grad-brand" : scrolled ? "bg-paper-2" : "bg-white/12 ring-1 ring-white/20"
            }`}
          >
            <span
              className={`h-[2px] w-5 rounded-full transition-all duration-300 ${
                open ? "translate-y-[7px] rotate-45 bg-white" : scrolled ? "bg-ink" : "bg-white"
              }`}
            />
            <span
              className={`h-[2px] w-5 rounded-full transition-all duration-300 ${
                open ? "opacity-0" : scrolled ? "bg-ink" : "bg-white"
              }`}
            />
            <span
              className={`h-[2px] w-5 rounded-full transition-all duration-300 ${
                open ? "-translate-y-[7px] -rotate-45 bg-white" : scrolled ? "bg-ink" : "bg-white"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Progression */}
      <div
        className={`grad-brand absolute bottom-0 left-0 h-[2px] transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{ width: `${progress * 100}%` }}
        aria-hidden="true"
      />

      {/* Menu mobile */}
      <div
        className={`absolute inset-x-0 top-full origin-top px-4 transition-all duration-400 lg:hidden ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"
        }`}
      >
        <nav
          className="mt-2 overflow-hidden rounded-3xl bg-ink/97 p-4 shadow-[0_30px_60px_-25px_rgba(11,16,32,0.7)] backdrop-blur-xl"
          aria-label="Navigation mobile"
        >
          {LINKS.map(([label, id], i) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between rounded-2xl px-4 py-3.5 transition-colors duration-300 ${
                active === id ? "grad-brand text-white" : "text-white/80 hover:bg-white/8"
              }`}
            >
              <span className="font-display text-lg font-semibold">{label}</span>
              <span className="font-mono text-[11px] opacity-50">0{i + 1}</span>
            </a>
          ))}
          <a
            href="#rejoindre"
            onClick={() => setOpen(false)}
            className="grad-brand mt-3 flex items-center justify-center rounded-2xl px-5 py-4 text-[14px] font-bold text-white"
          >
            Rejoindre le club →
          </a>
        </nav>
      </div>
    </header>
  );
}
