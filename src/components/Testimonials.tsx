import { useCallback, useEffect, useRef, useState } from "react";
import { SectionHead } from "./ui";
import { IconArrow } from "./icons";
import { usePrefersReducedMotion, useTabVisible } from "../lib/hooks";

type T = {
  quote: string;
  name: string;
  role: string;
  photo: string;
  accent: string;
};

const ITEMS: T[] = [
  {
    quote:
      "Je suis arrivée en L1 sans savoir ce qu'était un terminal. Un an plus tard, je co-maintiens des projets d'entreprise en parallèle de mes études. C'est grâce au club.",
    name: "Christ Henzo",
    role: "L1 Genie logiciel· Lead projet NoteSwap",
    photo: "/images/henzo.png",
    accent: "var(--color-indigo-brand)",
  },
  {
    quote:
      "Avec le club tech, j’ai pu découvrir plusieurs facettes du monde de la tech et ça m’a vraiment plu. Et les conférences sont vraiment intéressantes !",
    name: "Alvaro Hely ",
    role: "L1 bio-medical",
    photo: "/images/hely.JPG",
    accent: "var(--color-cyan-bright)",
  },
];

const DUR = 6800;

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [prog, setProg] = useState(0);
  const reduced = usePrefersReducedMotion();
  const tab = useTabVisible();
  const drag = useRef({ x: 0, on: false });

  const n = ITEMS.length;
  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);
  const next = useCallback(() => go(i + 1), [go, i]);
  const prev = useCallback(() => go(i - 1), [go, i]);
  const running = !paused && !reduced && tab;

  useEffect(() => {
    if (!running) return;
    setProg(0);
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / DUR);
      setProg(p);
      if (p >= 1) setI((k) => (k + 1) % n);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [i, running, n]);

  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, on: true };
    setPaused(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onUp = (e: React.PointerEvent) => {
    if (!drag.current.on) return;
    const dx = e.clientX - drag.current.x;
    drag.current.on = false;
    if (Math.abs(dx) > 55) (dx < 0 ? next : prev)();
    setPaused(false);
  };

  return (
    <section className="relative overflow-hidden bg-paper py-20 lg:py-28">
      <span className="blob -left-20 top-16 h-72 w-72 bg-indigo-brand/12" aria-hidden="true" />
      <span className="blob -right-16 bottom-16 h-72 w-72 bg-cyan-bright/14" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          align="center"
          eyebrow="Témoignages membres"
          title={
            <>
              Ils sont passés par <span className="grad-text">là</span>.
            </>
          }
          text="Quatre parcours différents, une même porte d'entrée."
        />

        <div
          data-reveal
          className="mt-12 outline-none"
          tabIndex={0}
          role="region"
          aria-roledescription="carrousel"
          aria-label="Témoignages de membres"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              next();
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              prev();
            }
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div
            className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_70px_-40px_rgba(11,16,32,0.45)]"
            onPointerDown={onDown}
            onPointerUp={onUp}
            onPointerCancel={() => (drag.current.on = false)}
          >
            {/* Progression */}
            <div className="absolute inset-x-0 top-0 z-20 h-1 bg-ink/6" aria-hidden="true">
              <div
                className="grad-brand h-full"
                style={{
                  width: `${running ? prog * 100 : 0}%`,
                  transition: running ? "none" : "width .3s",
                }}
              />
            </div>

            <div
              className="flex touch-pan-y transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${i * 100}%)` }}
            >
              {ITEMS.map((t, k) => (
                <figure key={t.name} className="w-full shrink-0 select-none" aria-hidden={k !== i}>
                  <div className="grid gap-0 sm:grid-cols-5">
                    {/* Photo */}
                    <div className="relative h-44 overflow-hidden sm:col-span-2 sm:h-auto">
                      <img
                        src={t.photo}
                        alt={`Portrait de ${t.name}`}
                        loading="lazy"
                        draggable={false}
                        className="h-full w-full object-cover"
                      />
                      <span
                        className="absolute inset-0 opacity-35 mix-blend-multiply"
                        style={{
                          background: `linear-gradient(160deg, ${t.accent}, transparent 70%)`,
                        }}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Citation */}
                    <div className="flex flex-col justify-center p-5 sm:col-span-3 sm:p-10">
                      <span
                        className="font-display text-5xl leading-none"
                        style={{ color: t.accent }}
                        aria-hidden="true"
                      >
                        &ldquo;
                      </span>
                      <blockquote>
                        <p className="mt-1 font-display text-[17px] font-medium leading-relaxed tracking-[-0.01em] text-ink sm:text-[20px]">
                          {t.quote}
                        </p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/8 pt-5">
                        <span
                          className="h-9 w-1 rounded-full"
                          style={{
                            background: `linear-gradient(${t.accent}, var(--color-cyan-bright))`,
                          }}
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-[14px] font-bold text-ink">{t.name}</p>
                          <p className="mt-0.5 text-[12.5px] text-slate-body">{t.role}</p>
                        </div>
                      </figcaption>
                    </div>
                  </div>
                </figure>
              ))}
            </div>
          </div>

          {/* Contrôles */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2" role="tablist" aria-label="Choisir un témoignage">
              {ITEMS.map((t, k) => (
                <button
                  key={t.name}
                  role="tab"
                  aria-selected={k === i}
                  aria-label={`Témoignage ${k + 1} : ${t.name}`}
                  onClick={() => go(k)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    k === i ? "grad-brand w-9" : "w-2 bg-ink/15 hover:bg-ink/30"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="hidden font-mono text-[11.5px] text-ink/35 sm:block">
                {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </span>
              <button
                onClick={prev}
                aria-label="Témoignage précédent"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink ring-1 ring-ink/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-brand hover:text-white hover:ring-transparent"
              >
                <IconArrow className="h-4 w-4 rotate-180" />
              </button>
              <button
                onClick={next}
                aria-label="Témoignage suivant"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink ring-1 ring-ink/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-brand hover:text-white hover:ring-transparent"
              >
                <IconArrow className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
