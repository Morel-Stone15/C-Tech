import type { ComponentType, SVGProps } from "react";
import { SectionHead, dly } from "./ui";
import { IconArrowUR, IconBook, IconBranch, IconCompass, IconMic, IconRocket, IconTrophy } from "./icons";

type Act = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  text: string;
  tag: string;
  from: string;
  to: string;
  glow: string;
};

const ACTS: Act[] = [
  {
    Icon: IconRocket,
    title: "Hackathons",
    text: "48 h, une idée, une équipe et beaucoup de café. Quatre éditions par an, ouvertes à tous les niveaux.",
    tag: "4 × / an",
    from: "var(--color-indigo-brand)",
    to: "var(--color-violet-pop)",
    glow: "rgba(75,42,232,0.35)",
  },
  {
    Icon: IconBook,
    title: "Workshops & formations",
    text: "Sessions pratiques de 2 h : Git, React, Docker, IA générative, design system… animées par des membres.",
    tag: "Chaque mardi",
    from: "var(--color-violet-pop)",
    to: "var(--color-blue-electric)",
    glow: "rgba(124,58,237,0.35)",
  },
  {
    Icon: IconBranch,
    title: "Projets collaboratifs",
    text: "Des squads de 4 à 6 personnes qui livrent un vrai produit sur un semestre, en open source.",
    tag: "Par semestre",
    from: "var(--color-blue-electric)",
    to: "var(--color-cyan-bright)",
    glow: "rgba(37,99,235,0.35)",
  },
  {
    Icon: IconMic,
    title: "Conférences & speakers",
    text: "On invite des ingénieurs, fondateurs et chercheurs à venir raconter leur parcours, sans filtre.",
    tag: "1 × / mois",
    from: "var(--color-cyan-bright)",
    to: "var(--color-indigo-brand)",
    glow: "rgba(62,198,224,0.35)",
  },
  {
    Icon: IconCompass,
    title: "Mentorat",
    text: "Chaque nouveau membre est associé à un mentor : entretiens blancs, revue de CV, conseils de carrière.",
    tag: "Toute l'année",
    from: "#4B2AE8",
    to: "#3EC6E0",
    glow: "rgba(75,42,232,0.35)",
  },
  {
    Icon: IconTrophy,
    title: "Compétitions de code",
    text: "Entraînements algo hebdomadaires et participation aux contests nationaux et internationaux.",
    tag: "Chaque jeudi",
    from: "#7C3AED",
    to: "#3EC6E0",
    glow: "rgba(124,58,237,0.35)",
  },
];

export default function Activities() {
  return (
    <section id="ressources" className="relative scroll-mt-24 overflow-hidden bg-white py-20 lg:py-28">
      <div className="bg-dots absolute inset-0 opacity-45" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHead
            eyebrow="Nos activités"
            title={
              <>
                Six façons de <span className="grad-text">progresser</span> avec nous.
              </>
            }
            text="Tu choisis ton rythme et ton format. Rien n'est obligatoire, tout est cumulable."
          />
          <a
            data-reveal
            style={dly(120)}
            href="#evenements"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-ink/12 bg-white px-5 py-3 text-[13px] font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-brand/40 hover:text-indigo-brand"
          >
            Voir le calendrier
            <IconArrowUR className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ACTS.map((a, i) => (
            <article
              key={a.title}
              data-reveal
              style={dly((i % 3) * 100)}
              className="group relative overflow-hidden rounded-[1.6rem] bg-white p-6 ring-1 ring-ink/8 transition-all duration-500 hover:-translate-y-2 hover:ring-transparent"
            >
              {/* Voile dégradé au survol */}
              <span
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `linear-gradient(140deg, ${a.from}, ${a.to})` }}
                aria-hidden="true"
              />
              {/* Ombre colorée */}
              <span
                className="absolute -inset-2 -z-10 rounded-[1.8rem] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: a.glow }}
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-all duration-500 group-hover:bg-white/20 group-hover:backdrop-blur"
                    style={{ background: `linear-gradient(140deg, ${a.from}, ${a.to})` }}
                  >
                    <a.Icon className="h-7 w-7" />
                  </span>
                  <span className="rounded-full bg-paper-2 px-2.5 py-1 text-[10.5px] font-bold text-indigo-brand transition-colors duration-500 group-hover:bg-white/20 group-hover:text-white">
                    {a.tag}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-[20px] font-bold tracking-[-0.02em] text-ink transition-colors duration-500 group-hover:text-white">
                  {a.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-body transition-colors duration-500 group-hover:text-white/85">
                  {a.text}
                </p>

                <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-indigo-brand transition-colors duration-500 group-hover:text-white">
                  En savoir plus
                  <IconArrowUR className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
