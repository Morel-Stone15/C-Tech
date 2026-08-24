import { SectionHead, dly } from "./ui";
import { IconArrowUR, IconClock, IconPin, IconUsers } from "./icons";

type Ev = {
  day: string;
  month: string;
  title: string;
  type: string;
  desc: string;
  time: string;
  place: string;
  seats: string;
  from: string;
  to: string;
  featured?: boolean;
};

const EVENTS: Ev[] = [
  {
    day: "14",
    month: "Mars",
    title: "Hackathon Printemps — « Build for Campus »",
    type: "Hackathon",
    desc: "48 h pour concevoir un outil qui améliore la vie étudiante. Équipes de 4, mentors présents en continu, 3 000 € de prix à répartir.",
    time: "Ven. 18 h → Dim. 18 h",
    place: "Bâtiment Innovation · Hall B",
    seats: "48 places restantes",
    from: "var(--color-indigo-brand)",
    to: "var(--color-violet-pop)",
    featured: true,
  },
  {
    day: "22",
    month: "Mars",
    title: "Workshop — Docker de zéro à la prod",
    type: "Workshop",
    desc: "Conteneurise ta première application et déploie-la. Amène ton laptop, on s'occupe du reste.",
    time: "18 h 30 → 20 h 30",
    place: "Salle C-204",
    seats: "12 places restantes",
    from: "var(--color-violet-pop)",
    to: "var(--color-blue-electric)",
  },
  {
    day: "04",
    month: "Avril",
    title: "Talk — « De la fac à Shopify »",
    type: "Conférence",
    desc: "Rencontre avec Inès Ferhat, ancienne membre du club, aujourd&apos;hui ingénieure plateforme à Berlin.",
    time: "19 h → 20 h 30",
    place: "Amphi Turing",
    seats: "Entrée libre",
    from: "var(--color-blue-electric)",
    to: "var(--color-cyan-bright)",
  },
  {
    day: "18",
    month: "Avril",
    title: "Contest algo — Qualifs nationales",
    type: "Compétition",
    desc: "Entraînement chronométré en conditions réelles, suivi d'une correction collective des problèmes.",
    time: "14 h → 18 h",
    place: "Labo informatique 2",
    seats: "20 places restantes",
    from: "var(--color-cyan-bright)",
    to: "var(--color-indigo-brand)",
  },
];

export default function Events() {
  const [hero, ...rest] = EVENTS;

  return (
    <section
      id="evenements"
      className="relative scroll-mt-24 overflow-hidden bg-white py-20 lg:py-28"
    >
      <div className="bg-dots absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHead
            eyebrow="Prochains événements"
            title={
              <>
                Ça se passe <span className="grad-text">bientôt</span>.
              </>
            }
            text="Tous nos événements sont gratuits et ouverts aux membres. Inscription en deux clics."
          />
          <a
            data-reveal
            style={dly(120)}
            href="#rejoindre"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-ink/12 px-5 py-3 text-[13px] font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-brand/40 hover:text-indigo-brand"
          >
            Ajouter au calendrier
            <IconArrowUR className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          {/* Événement phare */}
          <article
            data-reveal="left"
            className="group relative overflow-hidden rounded-[1.8rem] p-7 text-white lg:col-span-5 lg:p-9"
            style={{ background: `linear-gradient(150deg, ${hero.from}, ${hero.to})` }}
          >
            <div className="bg-grid-soft absolute inset-0 opacity-30" aria-hidden="true" />
            <span className="blob -right-10 -top-10 h-52 w-52 bg-white/20" aria-hidden="true" />

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] backdrop-blur">
                  {hero.type}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="ring-ping absolute inline-flex h-full w-full rounded-full bg-white" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                  Bientôt complet
                </span>
              </div>

              {/* Date géante */}
              <div className="mt-8 flex items-end gap-3">
                <span className="font-display text-[86px] font-bold leading-[0.82] tracking-[-0.05em] lg:text-[104px]">
                  {hero.day}
                </span>
                <span className="mb-2 font-display text-2xl font-semibold uppercase tracking-[0.05em] opacity-85">
                  {hero.month}
                </span>
              </div>

              <h3 className="mt-6 font-display text-[26px] font-bold leading-tight tracking-[-0.02em] lg:text-[30px]">
                {hero.title}
              </h3>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-white/80">{hero.desc}</p>

              <ul className="mt-6 space-y-2.5 border-t border-white/20 pt-5 text-[13px] text-white/85">
                <li className="flex items-center gap-2.5">
                  <IconClock className="h-4 w-4 opacity-70" />
                  {hero.time}
                </li>
                <li className="flex items-center gap-2.5">
                  <IconPin className="h-4 w-4 opacity-70" />
                  {hero.place}
                </li>
                <li className="flex items-center gap-2.5">
                  <IconUsers className="h-4 w-4 opacity-70" />
                  {hero.seats}
                </li>
              </ul>

              <a
                href="#rejoindre"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[13px] font-bold text-ink transition-transform duration-300 hover:-translate-y-0.5"
              >
                Je m&apos;inscris
                <IconArrowUR className="h-4 w-4" />
              </a>
            </div>
          </article>

          {/* Liste */}
          <div className="space-y-4 lg:col-span-7">
            {rest.map((e, i) => (
              <article
                key={e.title}
                data-reveal="right"
                style={dly(i * 110)}
                className="group relative flex gap-5 overflow-hidden rounded-[1.4rem] bg-paper p-5 ring-1 ring-ink/6 transition-all duration-400 hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_45px_-28px_var(--shadow-40)] sm:p-6"
              >
                {/* Barre latérale colorée */}
                <span
                  className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100"
                  style={{ background: `linear-gradient(${e.from}, ${e.to})` }}
                  aria-hidden="true"
                />

                {/* Date */}
                <div className="flex shrink-0 flex-col items-center justify-center">
                  <span
                    className="font-display text-[38px] font-bold leading-none tracking-[-0.04em] sm:text-[46px]"
                    style={{
                      backgroundImage: `linear-gradient(140deg, ${e.from}, ${e.to})`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {e.day}
                  </span>
                  <span className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/45">
                    {e.month}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-1 text-[10.5px] font-bold text-white"
                      style={{ background: `linear-gradient(120deg, ${e.from}, ${e.to})` }}
                    >
                      {e.type}
                    </span>
                    <span className="text-[11px] font-medium text-ink/40">{e.seats}</span>
                  </div>

                  <h3 className="mt-2 font-display text-[17px] font-bold leading-snug tracking-[-0.01em] text-ink sm:text-[18.5px]">
                    {e.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-body">{e.desc}</p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-ink/50">
                    <span className="inline-flex items-center gap-1.5">
                      <IconClock className="h-3.5 w-3.5" />
                      {e.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <IconPin className="h-3.5 w-3.5" />
                      {e.place}
                    </span>
                  </div>
                </div>

                <IconArrowUR className="mt-1 hidden h-5 w-5 shrink-0 self-start text-ink/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-brand sm:block" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
