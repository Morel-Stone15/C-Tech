import { Eyebrow } from "./ui";

/* Logos textuels stylisés — remplaçables par de vrais fichiers SVG */
const ROW_A = ["Université Lyon Tech", "Datadog", "OVHcloud", "Figma", "Doctolib", "GitHub Education", "Algolia"];
const ROW_B = ["Station F", "Sopra Steria", "Malt", "Hugging Face", "Qonto", "École 42", "Scaleway"];

function Logo({ name }: { name: string }) {
  return (
    <span className="group mx-3 inline-flex shrink-0 items-center gap-2.5 rounded-2xl bg-white px-6 py-4 ring-1 ring-ink/6 transition-all duration-300 hover:ring-indigo-brand/30">
      <span className="grad-brand h-2.5 w-2.5 shrink-0 rounded-full opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="whitespace-nowrap font-display text-[15px] font-bold tracking-[-0.01em] text-ink/55 transition-colors duration-300 group-hover:text-ink">
        {name}
      </span>
    </span>
  );
}

export default function Partners() {
  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-20">
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div data-reveal className="text-center">
          <Eyebrow>Nos partenaires</Eyebrow>
          <h2 className="mt-4 font-display text-[26px] font-bold tracking-[-0.03em] text-ink sm:text-[32px]">
            Ils soutiennent la <span className="grad-text">communauté</span>
          </h2>
          <p className="mx-auto mt-2.5 max-w-lg text-[14px] text-slate-body">
            Entreprises, écoles et associations qui financent nos événements, offrent des licences ou
            envoient leurs ingénieurs animer nos workshops.
          </p>
        </div>
      </div>

      {/* Bandes défilantes */}
      <div className="mq-wrap relative mt-10 space-y-4">
        <div className="flex w-max mq">
          {[...ROW_A, ...ROW_A].map((n, i) => (
            <Logo key={`a-${i}`} name={n} />
          ))}
        </div>
        <div className="flex w-max mq-rev">
          {[...ROW_B, ...ROW_B].map((n, i) => (
            <Logo key={`b-${i}`} name={n} />
          ))}
        </div>

        {/* Fondus latéraux */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent sm:w-40" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent sm:w-40" aria-hidden="true" />
      </div>

      <div className="relative mx-auto mt-10 max-w-7xl px-5 text-center lg:px-8">
        <a
          data-reveal
          href="#rejoindre"
          className="inline-flex items-center gap-2 text-[13px] font-bold text-indigo-brand transition-colors hover:text-violet-pop"
        >
          Devenir partenaire du club →
        </a>
      </div>
    </section>
  );
}
