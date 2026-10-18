import { useState } from "react";
import { SectionHead, TechBadge, dly } from "./ui";
import { IconArrowUR, IconGithub, IconPlay, IconUsers } from "./icons";
import { githubRepoUrl, SOCIAL_LINKS } from "../config/links";
import { assetUrl } from "../utils/assets";

const CATS = ["Tous", "Web", "Mobile", "IA / Data", "Design", "IoT"] as const;
type Cat = (typeof CATS)[number];

type Project = {
  title: string;
  tagline: string;
  cat: Exclude<Cat, "Tous">;
  tech: string[];
  team: number;
  year: string;
  img: string;
  stars: number;
  accent: string;
};

const PROJECTS: Project[] = [
  {
    title: "Quiz Tech",
    tagline: "Un quiz pour tester vos connaissances en technologies.",
    cat: "Web",
    tech: ["HTML", "CSS", "JavaScript"],
    team: 3,
    year: "2025",
    img: assetUrl("/images/quiz tech.png"),
    stars: 128,
    accent: "var(--color-indigo-brand)",
  },
  {
    title: "Partenariat avec la Startup Clikpay",
    tagline: "Clikpay, une plateforme de paiement mobile.",
    cat: "Mobile",
    tech: ["Flutter", " Supabase", "Python"],
    team: 6,
    year: "2025",
    img: assetUrl("/images/clikpay_brown.png"),
    stars: 342,
    accent: "var(--color-blue-electric)",
  },
  {
    title: "Animation pour un evenement React Native avec l'ANIMF ",
    tagline: "Mise en place d'un espace d'animation pour la découverte de l'ecosysteme mobile.",
    cat: "IoT",
    tech: ["React Native"],
    team: 4,
    year: "2024",
    img: assetUrl("/images/Evenement ANIMF.jpg"),
    stars: 96,
    accent: "var(--color-cyan-bright)",
  },
  {
    title: "Pré-organisation d'un Hackathon par le club ",
    tagline: "Pré-organisation d'un Hackathon par le club avec l'ANIMF.",
    cat: "IoT",
    tech: ["Python", "Flutter"],
    team: 14,
    year: "2025",
    img: assetUrl("/images/hackathon.jpeg"),
    stars: 517,
    accent: "var(--color-violet-pop)",
  },
];

export default function Projects() {
  const [cat, setCat] = useState<Cat>("Tous");
  const visible = PROJECTS.filter((p) => cat === "Tous" || p.cat === cat);
  const count = (c: Cat) =>
    c === "Tous" ? PROJECTS.length : PROJECTS.filter((p) => p.cat === c).length;

  return (
    <section id="projets" className="relative scroll-mt-24 overflow-hidden bg-paper py-20 lg:py-28">
      <span className="blob -right-24 top-24 h-80 w-80 bg-violet-pop/12" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Projets réalisés"
          title={
            <>
              Ce que nos membres ont <span className="grad-text">construit</span>.
            </>
          }
          text="Tous nos projets sont open source. Clone, contribue, ou inspire-toi — c'est fait pour ça."
        />

        {/* Filtres */}
        <div data-reveal style={dly(120)} className="mt-8 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-bold transition-all duration-300 ${
                cat === c
                  ? "grad-brand text-white shadow-[0_8px_20px_-8px_rgba(75,42,232,0.8)]"
                  : "bg-white text-ink/65 ring-1 ring-ink/8 hover:-translate-y-0.5 hover:text-indigo-brand hover:ring-indigo-brand/30"
              }`}
            >
              {c}
              <span
                className={`text-[10px] tabular-nums ${cat === c ? "text-white/70" : "text-ink/35"}`}
              >
                {count(c)}
              </span>
            </button>
          ))}
        </div>

        {/* Grille */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3">
          {visible.map((p, i) => (
            <article
              key={p.title}
              data-reveal
              style={dly((i % 3) * 100)}
              className="group relative flex flex-col overflow-hidden rounded-[1.6rem] bg-white ring-1 ring-ink/8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_60px_-30px_rgba(11,16,32,0.45)]"
            >
              {/* Vignette */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.img}
                  alt={`Aperçu du projet ${p.title}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110"
                />
                <span
                  className="absolute inset-0 opacity-70 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-40"
                  style={{ background: `linear-gradient(150deg, ${p.accent}, var(--color-ink))` }}
                  aria-hidden="true"
                />

                {/* Badges flottants */}
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-bold text-ink backdrop-blur">
                  {p.cat}
                </span>
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-ink/70 px-2.5 py-1 text-[10.5px] font-bold text-white backdrop-blur">
                  ★ {p.stars}
                </span>

                {/* Actions au survol */}
                <div className="absolute inset-x-4 bottom-4 flex translate-y-3 gap-2 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                  <a
                    href={githubRepoUrl(p.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-[11.5px] font-bold text-ink transition-colors hover:bg-paper-2"
                  >
                    <IconGithub className="h-3.5 w-3.5" />
                    Code
                  </a>
                  <a
                    href={githubRepoUrl(p.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grad-brand inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[11.5px] font-bold text-white"
                  >
                    <IconPlay className="h-3.5 w-3.5" />
                    Démo
                  </a>
                </div>
              </div>

              {/* Contenu */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-[19px] font-bold tracking-[-0.02em] text-ink">
                    {p.title}
                  </h3>
                  <IconArrowUR className="mt-1 h-4 w-4 shrink-0 text-ink/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-brand" />
                </div>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-slate-body">
                  {p.tagline}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <TechBadge key={t} name={t} />
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-ink/6 pt-3.5 text-[11.5px] font-medium text-ink/45">
                  <span className="inline-flex items-center gap-1.5">
                    <IconUsers className="h-3.5 w-3.5" />
                    {p.team} membres
                  </span>
                  <span>{p.year}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bandeau GitHub */}
        <div
          data-reveal
          className="mt-10 flex flex-col items-center justify-between gap-5 rounded-[1.6rem] bg-ink p-6 sm:flex-row sm:p-8"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <IconGithub className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[17px] font-bold text-white">Tout est sur GitHub</p>
              <p className="mt-0.5 text-[13px] text-white/55">
                58 dépôts publics · 1 360 étoiles cumulées · contributions ouvertes
              </p>
            </div>
          </div>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-bold text-ink transition-transform duration-300 hover:-translate-y-0.5"
          >
            <IconGithub className="h-4 w-4" />
            Voir l&apos;organisation
          </a>
        </div>
      </div>
    </section>
  );
}
