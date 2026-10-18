import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { GradButton, GhostButton } from "./ui";
import { IconArrow, IconCheck, IconSpark, IconUsers, LogoMark } from "./icons";
import { isSupabaseConfigured, saveInscription } from "../config/supabase";
import { toast } from "../lib/bus";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/* ---------- Inscription rapide — visible dès l'arrivée sur le site ---------- */
function QuickJoin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    if (name.trim().length < 2) {
      setErr("Ton prénom nous suffit — un peu plus long ?");
      toast("Il manque ton prénom", "error");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setErr("Cet e-mail a l&apos;air incorrect.");
      toast("Vérifie ton e-mail", "error");
      return;
    }
    setErr("");
    setStatus("sending");

    if (!isSupabaseConfigured()) {
      console.warn(
        "[CLUB-Tech] Supabase non configuré — l&apos;inscription rapide ne sera pas enregistrée en base.",
      );
      await new Promise((r) => setTimeout(r, 500));
      setStatus("done");
      toast("Inscription enregistrée ", "success");
      return;
    }

    const { error } = await saveInscription({
      nom: name.trim(),
      email: email.trim(),
      source: "inscription_rapide",
    });

    if (error) {
      const errMsg = error.toLowerCase();
      const dup = errMsg.includes("duplicate") || errMsg.includes("unique");
      const sourceMissing = errMsg.includes("source");
      if (sourceMissing) {
        setErr("Impossible d'enregistrer l'inscription – colonne 'source' manquante. Réessaie ou contacte‑nous à ctech2798@gmail.com.");
      } else {
        setErr(dup ? "Cet e-mail est déjà inscrit." : "L'inscription a échoué, réessaie.");
      }
      setStatus("error");
      toast(
        sourceMissing ? "Colonne 'source' manquante" : dup ? "Tu es déjà inscrit·e !" : "L'inscription a échoué",
        "error",
      );
      return;
    }

    setStatus("done");
    toast("Bienvenue dans le club", "success");
  };

  if (status === "done") {
    return (
      <div
        data-reveal
        style={{ "--rd": "600ms" } as CSSProperties}
        className="mt-8 flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15 backdrop-blur"
      >
        <span className="grad-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white">
          <IconCheck className="h-4 w-4" />
        </span>
        <p className="text-[13.5px] text-white/85">
          <strong className="text-white">Inscription reçue !</strong> Complète ton profil dans le
          formulaire plus bas pour recevoir l&apos;invitation Discord.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      data-reveal
      style={{ "--rd": "600ms" } as CSSProperties}
      className="mt-8 w-full max-w-lg"
    >
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50 sm:text-[12px]">
        Inscription rapide — 10 secondes, sans engagement
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="quick-name" className="sr-only">
          Prénom
        </label>
        <input
          id="quick-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ton prénom"
          disabled={status === "sending"}
          className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-[13px] text-white placeholder:text-white/40 backdrop-blur transition-all duration-300 focus:border-cyan-bright focus:outline-none focus:ring-4 focus:ring-cyan-bright/15 disabled:opacity-60 sm:py-3 sm:text-[13.5px]"
        />
        <label htmlFor="quick-email" className="sr-only">
          E-mail
        </label>
        <input
          id="quick-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="prenom.nom@etu.fr"
          disabled={status === "sending"}
          className="min-w-0 flex-[1.4] rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-[13px] text-white placeholder:text-white/40 backdrop-blur transition-all duration-300 focus:border-cyan-bright focus:outline-none focus:ring-4 focus:ring-cyan-bright/15 disabled:opacity-60 sm:py-3 sm:text-[13.5px]"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="grad-brand inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-bold text-white shadow-[0_10px_28px_-10px_rgba(75,42,232,0.7)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 sm:w-auto sm:shrink-0"
        >
          {status === "sending" ? (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              aria-hidden="true"
            />
          ) : (
            <>
              Je m&apos;inscris
              <IconArrow className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
      {err && <p className="mt-2 text-[12px] font-medium text-red-300">{err}</p>}
    </form>
  );
}

/* ---------- Particules connectées (canvas) ---------- */
function Particles() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;
    const mouse = { x: -9999, y: -9999 };
    type P = { x: number; y: number; vx: number; vy: number; r: number; c: string };
    let pts: P[] = [];
    const PAL = ["rgba(126,158,255,0.9)", "rgba(62,198,224,0.9)", "rgba(167,139,250,0.85)"];

    const init = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(26, Math.min(80, Math.round((w * h) / 17000)));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        r: Math.random() * 2 + 1,
        c: PAL[Math.floor(Math.random() * PAL.length)],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const D = 132;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < D * D) {
            const al = (1 - Math.sqrt(d2) / D) * 0.32;
            ctx.strokeStyle = `rgba(140,175,255,${al})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // Liens vers le curseur
        const mdx = a.x - mouse.x;
        const mdy = a.y - mouse.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 170) {
          ctx.strokeStyle = `rgba(62,198,224,${(1 - md / 170) * 0.5})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      for (const p of pts) {
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    init();
    if (reduced) draw();
    else {
      tick();
      canvas.parentElement?.addEventListener("mousemove", onMove);
      canvas.parentElement?.addEventListener("mouseleave", onLeave);
    }
    const onResize = () => {
      init();
      if (reduced) draw();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.parentElement?.removeEventListener("mousemove", onMove);
      canvas.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

/* ---------- Composition flottante (parallaxe) ---------- */
function FloatingArt() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"));

    const loop = () => {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      for (const l of layers) {
        const d = Number(l.dataset.depth ?? 1);
        l.style.transform = `translate3d(${(cx * d).toFixed(2)}px, ${(cy * d).toFixed(2)}px, 0)`;
      }
      raf = Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 46;
      ty = (e.clientY / window.innerHeight - 0.5) * 46;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrap}
      className="relative mx-auto h-[250px] w-full max-w-[300px] min-[420px]:h-[290px] min-[420px]:max-w-[360px] sm:h-[380px] sm:max-w-[460px] lg:h-[480px] lg:max-w-[500px] select-none"
      aria-hidden="true"
    >
      {/* Halos */}
      <span className="blob left-[8%] top-[6%] h-32 w-32 min-[420px]:h-40 min-[420px]:w-40 sm:h-52 sm:w-52 animate-float-a bg-indigo-brand/55" />
      <span className="blob right-[4%] top-[24%] h-36 w-36 min-[420px]:h-44 min-[420px]:w-44 sm:h-56 sm:w-56 animate-float-b bg-cyan-bright/50" />
      <span className="blob bottom-[6%] left-[26%] h-28 w-28 min-[420px]:h-36 min-[420px]:w-36 sm:h-44 sm:w-44 animate-float-c bg-violet-pop/45" />

      {/* Anneau pointillé */}
      <div data-depth="0.35" className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="h-[92%] w-[92%] animate-spin-slow">
          <circle
            cx="200"
            cy="200"
            r="196"
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1.2"
            strokeDasharray="3 12"
          />
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="rgba(62,198,224,0.22)"
            strokeWidth="1"
            strokeDasharray="80 320"
          />
        </svg>
      </div>

      {/* Logo central en verre */}
      <div data-depth="0.7" className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-28 w-28 min-[420px]:h-32 min-[420px]:w-32 items-center justify-center rounded-[1.5rem] bg-white/10 ring-1 ring-white/20 backdrop-blur-xl sm:h-40 sm:w-40 md:h-44 md:w-44 sm:rounded-[2rem]">
          <LogoMark id="hero" className="h-12 w-12 min-[420px]:h-14 min-[420px]:w-14 sm:h-20 sm:w-20 md:h-24 md:w-24" />
          <span className="grad-brand absolute -inset-px -z-10 rounded-[1.5rem] sm:rounded-[2rem] opacity-35 blur-xl" />
        </div>
      </div>

      {/* Cartes flottantes */}
      <div
        data-depth="1.5"
        className="absolute left-2 top-[8%] sm:left-0 sm:top-[12%] animate-float-a rounded-xl sm:rounded-2xl bg-white/95 px-2.5 py-1.5 sm:px-4 sm:py-3 shadow-[0_18px_40px_-16px_rgba(11,16,32,0.5)] backdrop-blur text-left"
      >
        <p className="font-mono text-[9.5px] sm:text-[11px] font-semibold text-indigo-brand">
          {"</>"} hackathon.js
        </p>
        <p className="mt-0.5 text-[9px] sm:text-[11px] text-ink/60">48 h · 12 équipes</p>
      </div>

      <div
        data-depth="1.2"
        className="absolute right-2 top-[36%] sm:right-0 sm:top-[38%] animate-float-b rounded-xl sm:rounded-2xl bg-white/95 px-2.5 py-1.5 sm:px-4 sm:py-3 shadow-[0_18px_40px_-16px_rgba(11,16,32,0.5)] backdrop-blur text-left"
      >
        <p className="flex items-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-[12px] font-bold text-ink">
          <IconUsers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-bright" />
          +340 membres
        </p>
        <div className="mt-1 flex -space-x-1.5 sm:-space-x-2">
          {[
            "var(--color-indigo-brand)",
            "var(--color-violet-pop)",
            "var(--color-blue-electric)",
            "var(--color-cyan-bright)",
          ].map((c, i) => (
            <span
              key={i}
              className="h-3.5 w-3.5 sm:h-5 sm:w-5 rounded-full ring-2 ring-white"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <div
        data-depth="1.8"
        className="absolute bottom-[6%] left-[8%] sm:bottom-[10%] sm:left-[14%] animate-float-c rounded-xl sm:rounded-2xl bg-ink/90 px-2.5 py-1.5 sm:px-4 sm:py-3 ring-1 ring-white/10 backdrop-blur text-left"
      >
        <p className="flex items-center gap-1.5 sm:gap-2 text-[9.5px] sm:text-[11.5px] font-semibold text-white">
          <IconSpark className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-bright" />
          Projet déployé
        </p>
      </div>
    </div>
  );
}


export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative overflow-hidden bg-ink pb-16 pt-24 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-36"
    >
      {/* Fonds */}
      <div className="grad-animated absolute inset-0 opacity-[0.22]" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_78%_12%,rgba(75,42,232,0.5),transparent_62%),radial-gradient(800px_500px_at_10%_88%,rgba(62,198,224,0.3),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="bg-grid-soft absolute inset-0 opacity-[0.5]" aria-hidden="true" />
      <Particles />
      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-paper"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        {/* Texte */}
        <div className="lg:col-span-7">
          <div
            data-reveal
            className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1.5 pr-3.5 ring-1 ring-white/15 backdrop-blur sm:gap-2.5 sm:py-1.5 sm:pr-4"
          >
            <span className="grad-brand rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white sm:px-2.5 sm:py-1 sm:text-[10px]">
              2026
            </span>
            <span className="text-[11px] font-medium text-white/80 sm:text-[12.5px]">
              Les inscriptions sont ouvertes · Promo #9
            </span>
          </div>

          <h1 className="mt-5 font-display text-[clamp(2.2rem,8vw,4.6rem)] font-bold leading-[1.02] tracking-[-0.04em] text-white sm:mt-6">
            <span className="line-mask">
              <span style={{ "--ld": "100ms" } as CSSProperties}>Apprends.</span>
            </span>
            <span className="line-mask">
              <span style={{ "--ld": "230ms" } as CSSProperties}>Code.</span>
            </span>
            <span className="line-mask">
              <span
                style={{ "--ld": "360ms" } as CSSProperties}
                className="bg-gradient-to-r from-cyan-bright via-blue-electric to-violet-pop bg-clip-text text-transparent"
              >
                Innove.
              </span>
            </span>
          </h1>

          <p
            data-reveal
            style={{ "--rd": "480ms" } as CSSProperties}
            className="mt-4 text-[14.5px] leading-relaxed text-white/70 sm:mt-6 sm:max-w-xl sm:text-[15.5px] lg:text-base"
          >
            CLUB-Tech, c&apos;est{" "}
            <strong className="font-semibold text-white">
              là où la tech rencontre la communauté
            </strong>
            . Hackathons, workshops, projets open-source et mentorat — on construit ensemble, on
            apprend en faisant, et personne ne reste sur le banc de touche.
          </p>

          <div
            data-reveal
            style={{ "--rd": "600ms" } as CSSProperties}
            className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8"
          >
            <GradButton href="#rejoindre">Rejoindre le club</GradButton>
            <GhostButton href="#projets" tone="light">
              Découvrir nos projets
            </GhostButton>
          </div>

          {/* Inscription rapide */}
          <QuickJoin />

          {/* Mini-stats */}
          <div
            data-reveal
            style={{ "--rd": "720ms" } as CSSProperties}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-5 sm:mt-10 sm:gap-x-8 sm:gap-y-4 sm:pt-6"
          >
            {[
              ["340+", "membres actifs"],
              ["58", "projets livrés"],
              ["4", "hackathons / an"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-xl font-bold text-white sm:text-2xl">{n}</p>
                <p className="mt-0.5 text-[11px] text-white/50 sm:text-[12px]">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visuel — masqué sur très petit écran */}
        <div
          data-reveal="zoom"
          style={{ "--rd": "300ms" } as CSSProperties}
          className="hidden sm:block lg:col-span-5"
        >
          <FloatingArt />
        </div>
      </div>
    </section>
  );
}
