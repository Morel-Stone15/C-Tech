import { useEffect, useState } from "react";

const HACKATHON_URL = "https://ctech2798.github.io/Hackathon-UniC-Bon/";
const HACKATHON_DATE = new Date("2026-11-22T08:00:00");

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, over: true };
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { days, hours, minutes, seconds, over: false };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function Digit({ n, label }: { n: number; label: string }) {
  const s = String(n).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-1 sm:gap-1.5">
      <div
        className="flex h-14 w-14 xs:h-16 xs:w-16 sm:h-20 sm:w-20 md:h-22 md:w-22 lg:h-24 lg:w-24 items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.14)",
          backdropFilter: "blur(10px)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 24px -6px rgba(0,0,0,0.4)",
        }}
      >
        <span
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums text-white tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {s}
        </span>
      </div>
      <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
        {label}
      </span>
    </div>
  );
}

export default function HackathonBanner() {
  const { days, hours, minutes, seconds, over } = useCountdown(HACKATHON_DATE);

  return (
    <section
      id="hackathon"
      className="relative overflow-hidden py-14 sm:py-20 md:py-24 lg:py-28"
      aria-label="Hackathon UniC'bon 2026"
      style={{
        background:
          "linear-gradient(135deg, #06050f 0%, #170b38 35%, #0b1a3a 65%, #06050f 100%)",
      }}
    >
      {/* === Blobs flottants === */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-20 -top-20 h-[320px] w-[320px] sm:h-[500px] sm:w-[500px] rounded-full opacity-60 sm:opacity-80"
          style={{
            background: "radial-gradient(circle, rgba(75,42,232,0.45) 0%, transparent 70%)",
            animation: "float-a 9s ease-in-out infinite",
            filter: "blur(20px)",
          }}
        />
        <div
          className="absolute -bottom-20 -right-20 h-[280px] w-[280px] sm:h-[450px] sm:w-[450px] rounded-full opacity-60 sm:opacity-80"
          style={{
            background: "radial-gradient(circle, rgba(62,198,224,0.35) 0%, transparent 70%)",
            animation: "float-b 11s ease-in-out -3s infinite",
            filter: "blur(20px)",
          }}
        />
        <div
          className="hidden sm:block absolute right-1/4 top-1/4 h-64 w-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
            animation: "float-c 13s ease-in-out -6s infinite",
            filter: "blur(15px)",
          }}
        />

        {/* Grille */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "clamp(30px, 4vw, 50px) clamp(30px, 4vw, 50px)",
          }}
        />

        {/* Traits décoratifs */}
        <div
          className="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 opacity-15"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(75,42,232,0.8) 20%, rgba(62,198,224,0.8) 50%, rgba(75,42,232,0.8) 80%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Badge live */}
        <div className="mb-5 sm:mb-6 flex justify-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{
              background: "linear-gradient(90deg, rgba(75,42,232,0.35), rgba(62,198,224,0.25))",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#3ec6e0",
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: "#3ec6e0",
                boxShadow: "0 0 8px #3ec6e0, 0 0 16px rgba(62,198,224,0.6)",
                animation: "bob 1.2s ease-in-out infinite",
              }}
            />
            Hackathon UniC&apos;bon 2026 — Inscriptions ouvertes
          </span>
        </div>

        {/* Titre principal */}
        <h2
          className="mb-4 sm:mb-5 text-center text-3xl font-bold leading-[1.12] tracking-tight text-white xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          48 heures pour{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, #4b2ae8 0%, #7c3aed 40%, #3ec6e0 80%, #4b2ae8 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradient-shift 4s linear infinite",
            }}
          >
            innover
          </span>
        </h2>

        <p className="mx-auto mb-8 sm:mb-10 max-w-2xl text-center text-sm sm:text-base md:text-lg leading-relaxed text-white/70">
          Le grand hackathon du Club‑Tech est de retour. Forme ton équipe, relève
          le défi et construis quelque chose d&apos;extraordinaire en 48 h chrono.
          Places limitées — inscris‑toi dès maintenant.
        </p>

        {/* Countdown */}
        {!over && (
          <div className="mb-8 sm:mb-10 flex items-start justify-center gap-2 xs:gap-3 sm:gap-5 md:gap-6">
            <Digit n={days} label="Jours" />
            <span className="mt-2.5 xs:mt-3 sm:mt-4 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extralight text-white/30">:</span>
            <Digit n={hours} label="Heures" />
            <span className="mt-2.5 xs:mt-3 sm:mt-4 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extralight text-white/30">:</span>
            <Digit n={minutes} label="Minutes" />
            <span className="mt-2.5 xs:mt-3 sm:mt-4 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extralight text-white/30">:</span>
            <Digit n={seconds} label="Secondes" />
          </div>
        )}

        {/* Chips d'infos */}
        <div className="mb-8 sm:mb-10 flex flex-wrap justify-center gap-2 sm:gap-3">
          {[
            { icon: "📅", text: "22 novembre 2026" },
            { icon: "⏱️", text: "48 heures non-stop" },
            { icon: "👥", text: "Équipes de 2 à 5" },
            { icon: "🏆", text: "Prix & récompenses" },
            { icon: "📍", text: "Campus universitaire" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-1.5 sm:gap-2 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white/80 transition-all hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span aria-hidden="true">{icon}</span>
              {text}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-stretch sm:items-center sm:flex-row sm:justify-center gap-3 sm:gap-4 max-w-md mx-auto sm:max-w-none">
          {/* Bouton principal — basculement vers site hackathon */}
          <a
            id="hackathon-register-btn"
            href={HACKATHON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #4b2ae8 0%, #7c3aed 50%, #2563eb 100%)",
              backgroundSize: "200% auto",
              animation: "gradient-shift 3s linear infinite",
              boxShadow:
                "0 10px 40px -12px rgba(75,42,232,0.8), 0 0 0 1px rgba(255,255,255,0.15) inset",
            }}
            aria-label="S'inscrire à l'Hackathon UniC'bon — ouvre une nouvelle page"
          >
            <span>🚀 S&apos;inscrire à l&apos;Hackathon</span>
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>

          {/* Bouton secondaire — en savoir plus */}
          <a
            id="hackathon-discover-btn"
            href={HACKATHON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 sm:px-6 sm:py-3.5 text-sm font-semibold text-white/75 transition-all duration-300 hover:text-white hover:bg-white/10"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
            }}
            aria-label="Découvrir le site de l'Hackathon — ouvre une nouvelle page"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Découvrir le site de l&apos;Hackathon
          </a>
        </div>

        {/* Note de bas de section */}
        <p className="mt-8 text-center text-xs text-white/40">
          Événement organisé par{" "}
          <span className="text-white/60 font-medium">CLUB-Tech × UniC&apos;bon</span>
          {" "}· Ouvert à tous les étudiants
        </p>
      </div>
    </section>
  );
}
