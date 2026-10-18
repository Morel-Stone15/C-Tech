import { useCountUp, useInView } from "../lib/hooks";
import { dly } from "./ui";

type S = { value: number; suffix: string; label: string; sub: string };

const STATS: S[] = [
  {
    value: 340,
    suffix: "+",
    label: "Membres actifs",
    sub: "toutes filières confondues",
  },
  { value: 20, suffix: "", label: "Projets réalisés", sub: "solutions concrètes & open source" },
  { value: 5, suffix: "", label: "Événements organisés", sub: "en 2025" },
  { value: 14, suffix: "+", label: "Partenaires", sub: "entreprises & institutions gabonaises" },
];

function Stat({
  value,
  suffix,
  label,
  sub,
  started,
  delay,
}: S & { started: boolean; delay: number }) {
  const v = useCountUp(value, started);
  return (
    <div
      data-reveal
      style={dly(delay)}
      className="group relative overflow-hidden rounded-[1.5rem] bg-white/8 p-6 text-center ring-1 ring-white/12 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:bg-white/12 sm:p-7"
    >
      <span
        className="absolute inset-x-0 -top-16 mx-auto h-32 w-32 rounded-full bg-cyan-bright/25 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
      <p className="relative font-display text-[44px] font-bold leading-none tracking-[-0.04em] text-white tabular-nums sm:text-[52px]">
        {Math.round(v).toLocaleString("fr-FR")}
        <span className="bg-gradient-to-r from-cyan-bright to-violet-pop bg-clip-text text-transparent">
          {suffix}
        </span>
      </p>
      <p className="relative mt-3 text-[13.5px] font-bold text-white">{label}</p>
      <p className="relative mt-1 text-[11.5px] text-white/45">{sub}</p>
    </div>
  );
}

export default function Stats() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);

  return (
    <section className="relative overflow-hidden bg-ink py-20 lg:py-24">
      <div className="grad-animated absolute inset-0 opacity-[0.18]" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(700px_320px_at_50%_0%,rgba(75,42,232,0.45),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="bg-grid-soft absolute inset-0 opacity-30" aria-hidden="true" />

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-reveal className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-[30px] font-bold leading-tight tracking-[-0.03em] text-white sm:text-[38px]">
            Une communauté qui{" "}
            <span className="bg-gradient-to-r from-cyan-bright to-violet-pop bg-clip-text text-transparent">
              grandit vite
            </span>
          </h2>
          <p className="mt-3 text-[14.5px] text-white/55">
            Les chiffres de la promo 2025-2026, mis à jour chaque semestre.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Stat key={s.label} {...s} started={inView} delay={i * 110} />
          ))}
        </div>
      </div>
    </section>
  );
}
