import { useState } from "react";
import { Brand, IconArrow, IconCheck, IconDiscord, IconGithub, IconInstagram, IconLinkedin, IconMail } from "./icons";
import { CLUB_EMAIL } from "../config/emailjs";
import { LEGAL_LINKS, SOCIAL_LINKS } from "../config/links";
import { toast } from "../lib/bus";

const NAV: [string, string][] = [
  ["Accueil", "#accueil"],
  ["Membres", "#membres"],
  ["Ressources", "#ressources"],
  ["Projets", "#projets"],
  ["Événements", "#evenements"],
  ["Rejoindre", "#rejoindre"],
];

const RESSOURCES: [string, string][] = [
  ["Guide du débutant", "#ressources"],
  ["Replays des workshops", "#ressources"],
  ["Templates de projets", "#projets"],
  ["Devenir mentor", "#rejoindre"],
  ["Kit partenaire", "#rejoindre"],
];

const SOCIALS = [
  { label: "Discord", Icon: IconDiscord, color: "hover:bg-[#5865F2]", href: SOCIAL_LINKS.discord },
  { label: "GitHub", Icon: IconGithub, color: "hover:bg-[#24292F]", href: SOCIAL_LINKS.github },
  { label: "Instagram", Icon: IconInstagram, color: "hover:bg-[#C13584]", href: SOCIAL_LINKS.instagram },
  { label: "LinkedIn", Icon: IconLinkedin, color: "hover:bg-[#0A66C2]", href: SOCIAL_LINKS.linkedin },
];

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim())) {
      toast("Cet e-mail a l'air incorrect 🤔", "error");
      return;
    }
    setSent(true);
    setEmail("");
    toast("Inscrit à la newsletter ! 📬", "success");
    window.setTimeout(() => setSent(false), 4000);
  };

  return (
    <form onSubmit={submit} className="mt-5">
      <div className="flex overflow-hidden rounded-full bg-white/8 p-1.5 ring-1 ring-white/12 transition-colors focus-within:ring-cyan-bright/50">
        <span className="flex items-center pl-3 pr-1 text-white/35" aria-hidden="true">
          <IconMail className="h-4 w-4" />
        </span>
        <label htmlFor="nl-email" className="sr-only">
          Adresse e-mail
        </label>
        <input
          id="nl-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton.email@etu.fr"
          className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[13.5px] text-white placeholder:text-white/30 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="S'inscrire à la newsletter"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            sent ? "bg-emerald-500 text-white" : "grad-brand text-white hover:scale-105"
          }`}
        >
          {sent ? <IconCheck className="h-4 w-4" /> : <IconArrow className="h-4 w-4" />}
        </button>
      </div>
      <p className="mt-2.5 text-[11.5px] text-white/35">
        Un e-mail par mois : projets, événements, offres de stage. Désinscription en un clic.
      </p>
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-16 text-white/70 lg:pt-20">
      <span className="grad-brand absolute inset-x-0 top-0 h-px opacity-60" aria-hidden="true" />
      <span className="blob -left-24 top-0 h-72 w-72 bg-indigo-brand/25" aria-hidden="true" />
      <span className="blob -right-20 bottom-0 h-80 w-80 bg-cyan-bright/15" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Marque */}
          <div className="lg:col-span-4">
            <Brand tone="light" />
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-white/50">
              Initiative universitaire dédiée à la tech, au code et à l&apos;innovation. Créée par des
              étudiants, pour des étudiants — depuis 2017.
            </p>

            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map(({ label, Icon, color, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 text-white/70 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:text-white hover:ring-transparent ${color}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-soft">Navigation</p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map(([l, h]) => (
                <li key={h}>
                  <a
                    href={h}
                    className="group inline-flex items-center gap-2 text-[13.5px] text-white/55 transition-colors duration-300 hover:text-white"
                  >
                    <span className="grad-brand h-px w-0 transition-all duration-300 group-hover:w-3.5" aria-hidden="true" />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div className="lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-soft">Ressources</p>
            <ul className="mt-4 space-y-2.5">
              {RESSOURCES.map(([l, h]) => (
                <li key={l}>
                  <a
                    href={h}
                    className="group inline-flex items-center gap-2 text-[13.5px] text-white/55 transition-colors duration-300 hover:text-white"
                  >
                    <span className="grad-brand h-px w-0 transition-all duration-300 group-hover:w-3.5" aria-hidden="true" />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-soft">Newsletter</p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/55">
              Reste au courant des prochains hackathons et workshops.
            </p>
            <Newsletter />
          </div>
        </div>

        {/* Bandeau bas */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/8 py-7 sm:flex-row">
          <p className="text-[12px] text-white/35">
            © 2026 CLUB-Tech · Association loi 1901 · Université Lyon Tech
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {[
              ["Mentions légales", LEGAL_LINKS.mentionsLegales],
              ["Confidentialité", LEGAL_LINKS.confidentialite],
              ["Code de conduite", LEGAL_LINKS.codeDeConduite],
            ].map(([m, href]) => (
              <a key={m} href={href} className="text-[12px] text-white/35 transition-colors hover:text-cyan-soft">
                {m}
              </a>
            ))}
            <a
              href={`mailto:${CLUB_EMAIL}`}
              className="text-[12px] font-semibold text-white/50 transition-colors hover:text-cyan-soft"
            >
              {CLUB_EMAIL}
            </a>
          </div>
        </div>

        {/* Signature géante */}
        <p
          className="pointer-events-none select-none pb-4 text-center font-display text-[15vw] font-bold leading-[0.8] tracking-[-0.05em] text-white/[0.03]"
          aria-hidden="true"
        >
          CLUB-Tech
        </p>
      </div>
    </footer>
  );
}
