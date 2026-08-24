import { SectionHead, dly } from "./ui";
import { IconCheck, IconSpark } from "./icons";

const VALUES = [
  {
    title: "Ouvert à tous",
    text: "Débutant complet ou dev confirmé — on t&apos;accompagne depuis ta première ligne de code.",
  },
  {
    title: "Apprendre en faisant",
    text: "Zéro cours magistral. On construit de vrais projets, avec de vrais utilisateurs.",
  },
  {
    title: "Open source d'abord",
    text: "Tout ce qu'on produit est public sur GitHub. Ton portfolio se construit tout seul.",
  },
  {
    title: "Zéro compétition toxique",
    text: "On partage, on s&apos;entraide, on célèbre les réussites de chacun. Simple.",
  },
];

export default function About() {
  return (
    <section id="membres" className="relative scroll-mt-24 overflow-hidden bg-paper py-20 lg:py-28">
      <span className="blob -left-20 top-20 h-72 w-72 bg-indigo-brand/10" aria-hidden="true" />
      <span className="blob -right-16 bottom-10 h-80 w-80 bg-cyan-bright/12" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Colonne visuelle asymétrique */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Image principale */}
              <div
                data-reveal="left"
                className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_70px_-30px_rgba(11,16,32,0.45)]"
              >
                <img
                  src="/images/louise.PNG"
                  alt="Membres de CLUB-Tech en session de travail collaboratif"
                  loading="lazy"
                  className="h-[400px] w-full object-cover sm:h-[460px]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>

              {/* Image secondaire décalée */}
              <div
                data-reveal="zoom"
                style={dly(200)}
                className="absolute -bottom-8 -right-4 hidden w-44 overflow-hidden rounded-2xl ring-[6px] ring-paper sm:block lg:-right-10 lg:w-52"
              >
                <img
                  src="/images/hackathon.jpeg"
                  alt="Atelier de code entre étudiantes"
                  loading="lazy"
                  className="h-32 w-full object-cover lg:h-36"
                />
              </div>

              {/* Pastille flottante */}
              <div
                data-reveal
                style={dly(320)}
                className="absolute -left-3 top-8 rounded-2xl bg-white px-4 py-3 shadow-[0_16px_36px_-14px_rgba(11,16,32,0.4)] lg:-left-8"
              >
                <p className="font-display text-2xl font-bold grad-text">2025</p>
                <p className="text-[11px] font-medium text-ink/50">année de création</p>
              </div>
            </div>
          </div>

          {/* Colonne texte */}
          <div className="lg:col-span-7">
            <SectionHead
              eyebrow="Qui sommes-nous"
              title={
                <>
                  Une communauté d&apos;étudiants qui{" "}
                  <span className="grad-text">construisent pour de vrai</span>.
                </>
              }
              text="CLUB-Tech est né dans un amphi presque vide, avec sept étudiants et un projet un peu fou : créer l'espace tech qu'on aurait aimé trouver en arrivant à la fac. Neuf ans plus tard, on est plus de 340 — et l'esprit n'a pas bougé d'un pixel."
            />

            {/* Mission */}
            <div
              data-reveal
              style={dly(120)}
              className="mt-8 rounded-2xl border-l-4 border-cyan-bright bg-white p-5 shadow-[0_10px_30px_-20px_rgba(11,16,32,0.35)]"
            >
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-brand">
                <IconSpark className="h-4 w-4" />
                Notre mission
              </p>
              <p className="mt-2 font-display text-[17px] font-medium leading-snug text-ink">
                Rendre la tech accessible, concrète et collective — pour que chaque étudiant reparte
                avec des compétences, un réseau et des projets dont il est fier.
              </p>
            </div>

            {/* Valeurs */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {VALUES.map((v, i) => (
                <div
                  key={v.title}
                  data-reveal
                  style={dly(160 + i * 90)}
                  className="grad-border group rounded-2xl p-5 shadow-[0_8px_24px_-18px_rgba(11,16,32,0.4)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <h3 className="font-display text-[16px] font-bold text-ink">{v.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-body">{v.text}</p>
                </div>
              ))}
            </div>

            <ul data-reveal style={dly(500)} className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5">
              {[
                "Aucun prérequis technique",
                "Gratuit pour les étudiants",
                "Toutes filières bienvenues",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2 text-[13px] font-medium text-ink/70">
                  <span className="grad-brand flex h-4.5 w-4.5 items-center justify-center rounded-full p-1 text-white">
                    <IconCheck className="h-3 w-3" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
