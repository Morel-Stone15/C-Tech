import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { saveInscription, isSupabaseConfigured } from "../config/supabase";
import { EMAILJS_CONFIG, isEmailJsConfigured, CLUB_EMAIL } from "../config/emailjs";
import { toast } from "../lib/bus";

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
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    filiere: "",
    tel: "",
    idee: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    if (!formData.nom.trim() || formData.nom.trim().length < 2) {
      setErr("Merci de renseigner votre nom complet.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(formData.email.trim())) {
      setErr("Veuillez saisir une adresse e-mail valide.");
      return;
    }
    if (!formData.filiere.trim()) {
      setErr("Veuillez indiquer votre filière.");
      return;
    }
    if (!formData.tel.trim() || formData.tel.trim().length < 8) {
      setErr("Veuillez indiquer votre numéro WhatsApp ou téléphone.");
      return;
    }

    setErr("");
    setStatus("submitting");

    // 1) Enregistrement Supabase (identique au backend Hackathon)
    const supabasePayload = {
      nom: formData.nom.trim(),
      email: formData.email.trim(),
      filiere: formData.filiere.trim(),
      message: `[Hackathon UniC’bon 2026] Tél: ${formData.tel.trim()} | Idée: ${formData.idee.trim() || "Projet à définir pendant l'événement"}`,
      source: "formulaire" as const,
    };

    if (isSupabaseConfigured()) {
      const { error } = await saveInscription(supabasePayload);
      if (error && !error.toLowerCase().includes("duplicate")) {
        console.warn("[HackathonBanner] Supabase save warning:", error);
      }
    }

    // 2) Notification EmailJS (partagée avec les clés .env de l'organisation)
    if (isEmailJsConfigured()) {
      try {
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            from_name: formData.nom.trim(),
            from_email: formData.email.trim(),
            filiere: formData.filiere.trim(),
            niveau: "Candidat Hackathon",
            interets: "Hackathon UniC’bon 2026",
            message: `Nouvelle inscription Hackathon depuis le site C-Tech :\n• Nom : ${formData.nom.trim()}\n• E-mail : ${formData.email.trim()}\n• Téléphone : ${formData.tel.trim()}\n• Filière : ${formData.filiere.trim()}\n• Idée : ${formData.idee.trim() || "Non renseignée"}`,
            to_email: CLUB_EMAIL,
            sent_at: new Date().toLocaleString("fr-FR"),
          },
          EMAILJS_CONFIG.publicKey,
        );
      } catch (e) {
        console.warn("[HackathonBanner] EmailJS error:", e);
      }
    }

    setStatus("done");
    toast("Préinscription Hackathon validée !", "success");
  };

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
          {/* Bouton pour ouvrir l'inscription sur place */}
          <button
            type="button"
            id="hackathon-register-btn"
            onClick={() => setOpenModal(true)}
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl shadow-lg cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, #4b2ae8 0%, #7c3aed 50%, #2563eb 100%)",
              backgroundSize: "200% auto",
              animation: "gradient-shift 3s linear infinite",
              boxShadow:
                "0 10px 40px -12px rgba(75,42,232,0.8), 0 0 0 1px rgba(255,255,255,0.15) inset",
            }}
            aria-label="S'inscrire à l'Hackathon UniC'bon"
          >
            <span>🚀 S&apos;inscrire à l&apos;Hackathon</span>
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>

          {/* Bouton pour basculer directement sur le site de l'hackathon */}
          <a
            id="hackathon-discover-btn"
            href={HACKATHON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2.5 rounded-full px-5 py-3 sm:px-6 sm:py-3.5 text-sm font-semibold text-white/80 transition-all duration-300 hover:text-white hover:bg-white/10"
            style={{
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.06)",
            }}
            aria-label="Basculer vers le site officiel de l'Hackathon — ouvre une nouvelle page"
          >
            <span>🌐 Basculer sur le site de l&apos;Hackathon</span>
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div>

        {/* Note de bas de section */}
        <p className="mt-8 text-center text-xs text-white/40">
          Événement officiel organisé par{" "}
          <span className="text-white/60 font-medium">CLUB-Tech × UniC&apos;bon</span>
          {" "}· Ouvert à tous les étudiants de l&apos;IST
        </p>
      </div>

      {/* ========================================================= */}
      {/* MODAL D'INSCRIPTION HACKATHON DIRECTEMENT DEPUIS C-TECH   */}
      {/* ========================================================= */}
      {openModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop avec flou */}
          <div
            className="absolute inset-0 bg-ink/80 backdrop-blur-md transition-opacity"
            onClick={() => setOpenModal(false)}
          />

          {/* Boîte de dialogue */}
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl ring-1 ring-white/15"
            style={{
              background: "linear-gradient(145deg, #0d1224 0%, #170d38 50%, #081a28 100%)",
            }}
          >
            {/* Bouton fermer */}
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
              aria-label="Fermer la boîte de dialogue"
            >
              ✕
            </button>

            {status === "done" ? (
              <div className="py-4 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40">
                  <span className="text-3xl font-bold">✓</span>
                </div>
                <h3 className="mb-2 font-display text-2xl font-bold text-white">
                  Préinscription enregistrée !
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-white/75">
                  Félicitations <strong>{formData.nom}</strong> ! Vos informations ont été enregistrées
                  dans la base de données officielle et l’équipe organisatrice a reçu votre candidature.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href={HACKATHON_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5"
                    style={{
                      background: "linear-gradient(135deg, #4b2ae8 0%, #3ec6e0 100%)",
                    }}
                  >
                    <span>🚀 Basculer vers le site officiel de l&apos;Hackathon</span>
                    <span>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setOpenModal(false);
                      setFormData({ nom: "", email: "", filiere: "", tel: "", idee: "" });
                    }}
                    className="rounded-full bg-white/10 py-2.5 text-xs font-semibold text-white/70 hover:bg-white/15 hover:text-white"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-300 ring-1 ring-cyan-400/30">
                    Hackathon UniC&apos;bon 2026
                  </div>
                  <h3 id="modal-title" className="mt-2.5 font-display text-2xl font-bold text-white">
                    Préinscription individuelle
                  </h3>
                  <p className="mt-1 text-xs text-white/60">
                    Tu seras affecté(e) dans l&apos;une des 20 équipes de 5 étudiants. Les données sont
                    enregistrées dans la même base cloud (Supabase) que le site officiel.
                  </p>
                </div>

                {err && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-medium text-red-200">
                    ⚠️ {err}
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-white/80">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex. Sarah Ndong"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-white/80">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="nom@etudiant.ga"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-white/80">
                        Filière *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex. G.LOG et IA, L2"
                        value={formData.filiere}
                        onChange={(e) => setFormData({ ...formData, filiere: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-white/80">
                      Téléphone ou WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex. +241 65 36 96 29"
                      value={formData.tel}
                      onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-white/80">
                      Idée de projet ou motivation <span className="text-white/40">(facultatif)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Santé, agriculture, éducation, énergie..."
                      value={formData.idee}
                      onChange={(e) => setFormData({ ...formData, idee: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50 cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #4b2ae8 0%, #3ec6e0 100%)",
                    }}
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Enregistrement en cours...
                      </>
                    ) : (
                      "Confirmer ma préinscription"
                    )}
                  </button>

                  <a
                    href={HACKATHON_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center text-xs text-white/60 hover:text-white hover:underline pt-1"
                  >
                    Préférer s&apos;inscrire directement sur le site officiel de l&apos;Hackathon →
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
