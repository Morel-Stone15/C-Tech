import { useRef, useState } from "react";
import { GradButton, Eyebrow } from "./ui";
import { IconArrow, IconCheck, IconDiscord, IconSpark } from "./icons";
import { CLUB_EMAIL, EMAILJS_CONFIG, isEmailJsConfigured, checkAndSendBatchReport, sendImmediateNotification } from "../config/emailjs";
import { saveInscriptionAsync, getAllInscriptions } from "../config/localDb";
import { SOCIAL_LINKS } from "../config/links";
import { toast } from "../lib/bus";

type Field = "from_name" | "from_email" | "tel" | "filiere" | "message";

const RULES: Record<Field, (v: string) => string | null> = {
  from_name: (v) =>
    !v.trim() ? "On aimerait bien savoir ton nom" : v.trim().length < 2 ? "Un peu court…" : null,
  from_email: (v) =>
    !v.trim()
      ? "Ton e-mail nous permet de te répondre."
      : !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim())
        ? "Cet e-mail a l&apos;air incorrect."
        : null,
  tel: (v) =>
    !v.trim()
      ? "Numéro de téléphone ou WhatsApp nécessaire."
      : v.trim().replace(/[\s\-\(\)\.]/g, "").length < 8
        ? "Numéro incomplet (minimum 8 chiffres)."
        : null,
  filiere: (v) => (!v.trim() ? "Indique ta filière et ton année." : null),
  message: (v) =>
    !v.trim()
      ? "Dis-nous en deux lignes ce qui t&apos;attire !"
      : v.trim().length < 15
        ? `Encore ${15 - v.trim().length} caractères…`
        : null,
};

const EMPTY: Record<Field, string> = { from_name: "", from_email: "", tel: "", filiere: "", message: "" };

const NIVEAUX = ["Grand débutant", "Je bricole un peu", "À l&apos;aise", "Confirmé"];
const POLES = ["Web", "Mobile", "IA / Data", "Design", "IoT", "Cybersécurité", "Événementiel"];

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3.5 text-[14px] text-ink placeholder:text-ink/30 transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-60";
const okCls = "border-ink/10 focus:border-indigo-brand focus:ring-indigo-brand/12";
const koCls = "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-400/15";
const goodCls = "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-400/15";
const labelCls = "mb-1.5 block text-[12px] font-bold text-ink";

export default function Join() {
  const formRef = useRef<HTMLFormElement>(null);
  const [v, setV] = useState<Record<Field, string>>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [niveau, setNiveau] = useState(NIVEAUX[0]);
  const [interets, setInterets] = useState<string[]>(["Web"]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const errors = (Object.keys(RULES) as Field[]).reduce<Partial<Record<Field, string>>>((a, f) => {
    const e = RULES[f](v[f]);
    if (e) a[f] = e;
    return a;
  }, {});
  const valid = Object.keys(errors).length === 0;
  const done = (Object.keys(EMPTY) as Field[]).filter((f) => !errors[f]).length;
  const pct = Math.round((done / 5) * 100);

  const set = (f: Field, val: string) => setV((p) => ({ ...p, [f]: val }));
  const blur = (f: Field) => setTouched((p) => ({ ...p, [f]: true }));
  const bad = (f: Field) => touched[f] && errors[f];
  const cls = (f: Field) =>
    `${inputBase} ${bad(f) ? koCls : touched[f] && v[f].trim() ? goodCls : okCls}`;

  const toggleInteret = (p: string) =>
    setInterets((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    if (!valid) {
      setTouched({ from_name: true, from_email: true, tel: true, filiere: true, message: true });
      const first = (Object.keys(RULES) as Field[]).find((f) => errors[f]);
      if (first) document.getElementById(`j-${first}`)?.focus();
      toast("Il manque encore quelques infos", "error");
      return;
    }

    const hp = formRef.current?.elements.namedItem("website") as HTMLInputElement | null;
    if (hp?.value) return;

    setStatus("sending");
    setErrMsg("");

    // 1) Enregistrement dans la base interne locale
    const { error } = await saveInscriptionAsync({
      nom: v.from_name.trim(),
      email: v.from_email.trim(),
      tel: v.tel.trim(),
      filiere: v.filiere.trim(),
      niveau,
      interets,
      message: v.message.trim(),
      source: "formulaire",
    });

    if (error) {
      const dup = error === "duplicate_email";
      setErrMsg(
        dup
          ? "Cet e-mail est déjà inscrit — un membre du bureau te recontactera sous peu."
          : "L'enregistrement a échoué. Vérifie le stockage local de ton navigateur.",
      );
      setStatus("error");
      toast(dup ? "Tu es déjà inscrit·e !" : "L'enregistrement a échoué, réessaie", "error");
      return;
    }

    // 2) Notification e-mail immédiate via EmailJS
    if (isEmailJsConfigured()) {
      try {
        await sendImmediateNotification({
          id: "",
          nom: v.from_name.trim(),
          email: v.from_email.trim(),
          tel: v.tel.trim(),
          filiere: v.filiere.trim(),
          niveau,
          interets,
          message: v.message.trim(),
          source: "formulaire",
          created_at: new Date().toISOString(),
        });
        console.info("[CLUB-Tech] Notification e-mail instantanée transmise.");
      } catch (err: unknown) {
        console.warn("[CLUB-Tech] Notification EmailJS échec :", err);
      }

      // 3) Rapport automatique tous les 5 inscrits → ctech2798@gmail.com
      try {
        const all = getAllInscriptions();
        await checkAndSendBatchReport(all);
      } catch (err: unknown) {
        console.warn("[CLUB-Tech] Rapport automatique EmailJS :", err);
      }
    }

    setStatus("done");
    toast("Bienvenue dans le club !", "success");
  };

  const Err = ({ f }: { f: Field }) =>
    bad(f) ? <p className="mt-1.5 text-[11.5px] font-medium text-red-600">{errors[f]}</p> : null;

  return (
    <section id="rejoindre" className="relative scroll-mt-24 overflow-hidden bg-ink py-16 sm:py-20 lg:py-28">
      <div className="grad-animated absolute inset-0 opacity-[0.2]" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(800px_420px_at_20%_10%,rgba(75,42,232,0.5),transparent_65%),radial-gradient(700px_380px_at_85%_85%,rgba(62,198,224,0.28),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="bg-grid-soft absolute inset-0 opacity-25" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Argumentaire */}
          <div className="lg:col-span-5">
            <div data-reveal>
              <Eyebrow tone="light">Rejoindre le club</Eyebrow>
              <h2 className="mt-4 font-display text-[28px] font-bold leading-[1.06] tracking-[-0.03em] text-white sm:mt-5 sm:text-[34px] lg:text-[42px]">
                Prêt à écrire ta{" "}
                <span className="bg-gradient-to-r from-cyan-bright to-violet-pop bg-clip-text text-transparent">
                  première ligne
                </span>{" "}
                avec nous ?
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/65">
                Deux minutes pour t&apos;inscrire. Adhésion fixée à seulement 3 000 FCFA pour l&apos;année
                universitaire. On te répond rapidement avec le lien Discord et les prochaines sessions.
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {[
                "Adhésion à 3 000 FCFA pour les étudiants",
                "Accès au Discord, aux ateliers et aux hackathons",
                "Un mentor attribué dès ta première semaine",
                "Aucun niveau minimum requis — vraiment",
              ].map((t, i) => (
                <li
                  key={t}
                  data-reveal
                  style={{ "--rd": `${i * 90}ms` } as React.CSSProperties}
                  className="flex items-start gap-3 text-[14px] text-white/80"
                >
                  <span className="grad-brand mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white">
                    <IconCheck className="h-3 w-3" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            {/* Discord */}
            <a
              href={SOCIAL_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
              className="mt-8 flex items-center gap-4 rounded-2xl bg-white/8 p-5 ring-1 ring-white/12 backdrop-blur transition-colors duration-300 hover:bg-white/12"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ background: "var(--color-discord)" }}
              >
                <IconDiscord className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-[13.5px] font-bold text-white">Juste curieux ?</p>
                <p className="mt-0.5 text-[12.5px] text-white/55">
                  Passe d&apos;abord sur le Discord — 412 membres, aucune question bête.
                </p>
              </div>
              <IconArrow className="ml-auto hidden h-4 w-4 shrink-0 text-white/40 sm:block" />
            </a>
          </div>

          {/* Formulaire */}
          <div data-reveal="right" className="lg:col-span-7">
            <div className="rounded-[1.4rem] bg-white p-5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] sm:rounded-[1.8rem] sm:p-8">
              {status === "done" ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center py-8 text-center">
                  <span className="grad-brand flex h-16 w-16 items-center justify-center rounded-2xl text-white">
                    <IconSpark className="h-8 w-8" />
                  </span>
                  <h3 className="mt-6 font-display text-[26px] font-bold tracking-[-0.02em] text-ink">
                    Bienvenue dans le club !
                  </h3>
                  <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-slate-body">
                    On a bien reçu ta candidature. Un membre du bureau te répond sous{" "}
                    <strong className="text-ink">48 h</strong> avec l&apos;invitation Discord et le
                    calendrier.
                  </p>
                  <p className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[12px] font-semibold text-emerald-700 ring-1 ring-emerald-500/20">
                    <IconCheck className="h-4 w-4" /> Candidature enregistrée dans la base du club
                  </p>
                  <button
                    onClick={() => {
                      setV(EMPTY);
                      setTouched({});
                      setInterets(["Web"]);
                      setStatus("idle");
                    }}
                    className="mt-8 inline-flex items-center gap-2 text-[13px] font-bold text-indigo-brand transition-colors hover:text-violet-pop"
                  >
                    <IconArrow className="h-4 w-4 rotate-180" />
                    Inscrire quelqu&apos;un d&apos;autre
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={submit} noValidate>
                  <input type="hidden" name="to_email" value={CLUB_EMAIL} />
                  <input type="hidden" name="sent_at" value={new Date().toLocaleString("fr-FR")} />
                  <input type="hidden" name="niveau" value={niveau} />
                  <input type="hidden" name="interets" value={interets.join(", ")} />
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute h-0 w-0 opacity-0"
                  />

                  {/* Progression */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-ink/45">Formulaire d&apos;adhésion</span>
                      <span className={pct === 100 ? "text-emerald-600" : "text-indigo-brand"}>
                        {pct} %
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/8">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct === 100 ? "bg-emerald-500" : "grad-brand"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <fieldset disabled={status === "sending"} className="contents">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="j-from_name" className={labelCls}>
                          Nom complet *
                        </label>
                        <input
                          id="j-from_name"
                          name="from_name"
                          value={v.from_name}
                          onChange={(e) => set("from_name", e.target.value)}
                          onBlur={() => blur("from_name")}
                          placeholder="Ex. Yasmine Ould"
                          className={cls("from_name")}
                        />
                        <Err f="from_name" />
                      </div>
                      <div>
                        <label htmlFor="j-from_email" className={labelCls}>
                          E-mail *
                        </label>
                        <input
                          id="j-from_email"
                          name="from_email"
                          type="email"
                          value={v.from_email}
                          onChange={(e) => set("from_email", e.target.value)}
                          onBlur={() => blur("from_email")}
                          placeholder="prenom.nom@univ.ga"
                          className={cls("from_email")}
                        />
                        <Err f="from_email" />
                      </div>
                      <div>
                        <label htmlFor="j-tel" className={labelCls}>
                          Téléphone ou WhatsApp *
                        </label>
                        <input
                          id="j-tel"
                          name="tel"
                          type="tel"
                          value={v.tel}
                          onChange={(e) => set("tel", e.target.value)}
                          onBlur={() => blur("tel")}
                          placeholder="Ex. +241 65 36 96 29"
                          className={cls("tel")}
                        />
                        <Err f="tel" />
                      </div>
                      <div>
                        <label htmlFor="j-filiere" className={labelCls}>
                          Filière &amp; niveau *
                        </label>
                        <input
                          id="j-filiere"
                          name="filiere"
                          value={v.filiere}
                          onChange={(e) => set("filiere", e.target.value)}
                          onBlur={() => blur("filiere")}
                          placeholder="Ex. Génie Logiciel · L3"
                          className={cls("filiere")}
                        />
                        <Err f="filiere" />
                      </div>
                    </div>

                    {/* Niveau */}
                    <div className="mt-5">
                      <p className={labelCls}>Ton niveau en code</p>
                      <div className="flex flex-wrap gap-2">
                        {NIVEAUX.map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setNiveau(n)}
                            aria-pressed={niveau === n}
                            className={`rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-all duration-300 ${
                              niveau === n
                                ? "grad-brand text-white shadow-[0_6px_16px_-6px_rgba(75,42,232,0.8)]"
                                : "bg-paper text-ink/60 ring-1 ring-ink/8 hover:text-indigo-brand hover:ring-indigo-brand/30"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Intérêts */}
                    <div className="mt-5">
                      <p className={labelCls}>
                        Ce qui t&apos;intéresse{" "}
                        <span className="font-medium text-ink/40">
                          ({interets.length} sélectionné{interets.length > 1 ? "s" : ""})
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {POLES.map((p) => {
                          const on = interets.includes(p);
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => toggleInteret(p)}
                              aria-pressed={on}
                              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-all duration-300 ${
                                on
                                  ? "bg-ink text-white"
                                  : "bg-paper text-ink/60 ring-1 ring-ink/8 hover:text-indigo-brand hover:ring-indigo-brand/30"
                              }`}
                            >
                              {on && <IconCheck className="h-3 w-3 text-cyan-bright" />}
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Motivation */}
                    <div className="mt-5">
                      <label htmlFor="j-message" className={labelCls}>
                        Pourquoi tu veux nous rejoindre ? *
                      </label>
                      <textarea
                        id="j-message"
                        name="message"
                        rows={4}
                        maxLength={600}
                        value={v.message}
                        onChange={(e) => set("message", e.target.value)}
                        onBlur={() => blur("message")}
                        placeholder="Pas besoin d'une lettre de motivation — deux phrases sincères suffisent."
                        className={`${cls("message")} resize-none`}
                      />
                      <div className="mt-1 flex items-center justify-between">
                        <Err f="message" />
                        <span className="ml-auto text-[11px] tabular-nums text-ink/35">
                          {v.message.length}/600
                        </span>
                      </div>
                    </div>
                  </fieldset>

                  {status === "error" && (
                    <div
                      role="alert"
                      className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-800 ring-1 ring-red-200"
                    >
                      <strong>Oups, l&apos;envoi a échoué.</strong> {errMsg} — réessaie ou
                      écris-nous à{" "}
                      <a href={`mailto:${CLUB_EMAIL}`} className="font-bold underline">
                        {CLUB_EMAIL}
                      </a>
                      .
                    </div>
                  )}

                  <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                    {status === "sending" ? (
                      <span className="grad-brand inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-[13px] font-bold text-white">
                        <span
                          className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                          aria-hidden="true"
                        />
                        Envoi en cours…
                      </span>
                    ) : (
                      <GradButton type="submit">Envoyer ma candidature</GradButton>
                    )}
                    <p className="text-[11.5px] text-ink/40">
                      Réponse sous 48 h · aucune donnée revendue
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
