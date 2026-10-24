/**
 * ============================================================
 *  CONFIGURATION EMAILJS — CLUB-Tech
 * ============================================================
 *
 *  Les 3 paramètres sont lus depuis `.env.local` (racine du projet).
 *  ⚠️ Toute variable exposée au navigateur DOIT commencer par `VITE_`.
 *
 *      VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
 *      VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
 *      VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
 *
 *  Redémarrez `npm run dev` après modification.
 *
 *  Où les trouver sur https://dashboard.emailjs.com :
 *    • SERVICE_ID  → Email Services
 *    • TEMPLATE_ID → Email Templates
 *    • PUBLIC_KEY  → Account ▸ General ▸ API Keys
 * ============================================================
 */

export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || import.meta.env.EMAILJS_SERVICE_ID || "service_7p6hu8i",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || import.meta.env.EMAILJS_TEMPLATE_ID || "template_p9uaz9f",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || import.meta.env.EMAILJS_PUBLIC_KEY || "swccw7PktiWD4AcAL",
} as const;

/** Si `false`, le formulaire bascule en mode démonstration. */
export const isEmailJsConfigured = (): boolean =>
  Boolean(EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.publicKey);

export const CLUB_EMAIL =
  import.meta.env.VITE_ORGANIZER_EMAIL ||
  import.meta.env.ORGANIZER_EMAIL ||
  import.meta.env.VITE_CLUB_EMAIL ||
  "ctech2798@gmail.com";

import type { StoredInscription } from "./localDb";

/** Envoi direct via l'API REST EmailJS — même méthode que le site Hackathon (qui fonctionne). */
async function _ejsSend(templateParams: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.serviceId,
        template_id: EMAILJS_CONFIG.templateId,
        user_id: EMAILJS_CONFIG.publicKey,
        template_params: templateParams,
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.warn("[CLUB-Tech] EmailJS API error:", res.status, txt);
    }
    return res.ok;
  } catch (e) {
    console.warn("[CLUB-Tech] EmailJS fetch error:", e);
    return false;
  }
}

/** Envoie immédiatement une notification e-mail détaillée à chaque nouvelle inscription */
export async function sendImmediateNotification(item: StoredInscription): Promise<boolean> {
  if (!isEmailJsConfigured()) return false;
  return _ejsSend({
    from_name: item.nom,
    from_email: item.email,
    to_email: CLUB_EMAIL,
    tel: item.tel || "Non renseigné",
    filiere: item.filiere || "Non renseignée",
    niveau: item.niveau || "Non spécifié",
    interets: Array.isArray(item.interets) ? item.interets.join(", ") : "Général",
    message: item.message || "Aucun message",
    sent_at: new Date().toLocaleString("fr-FR"),
  });
}

const LAST_REPORTED_KEY = "ctech_last_email_report_count";

/**
 * Envoie le rapport au compte du club : ctech2798@gmail.com
 * Dès qu'une nouvelle inscription arrive (pas besoin d'attendre 5 personnes).
 */
export async function checkAndSendBatchReport(allInscriptions: StoredInscription[]): Promise<boolean> {
  if (!isEmailJsConfigured()) return false;

  const count = allInscriptions.length;
  if (count === 0) return false;

  const lastReported = parseInt(localStorage.getItem(LAST_REPORTED_KEY) || "0", 10);
  if (count <= lastReported) return false;

  const batch = allInscriptions.slice(-5);
  const formattedBatch = batch
    .map((item, index) => {
      const num = lastReported + index + 1;
      const tel = item.tel || "Non renseigné";
      const filiere = item.filiere || "Non renseignée";
      const niveau = item.niveau ? ` (${item.niveau})` : "";
      const interets = item.interets && item.interets.length > 0 ? item.interets.join(", ") : "Général";
      const date = item.created_at ? new Date(item.created_at).toLocaleString("fr-FR") : "Récemment";
      const msg = item.message ? `\n   Motivation : ${item.message}` : "";
      return `${index + 1}. [Inscrit #${num}] ${item.nom}\n   • Téléphone/WhatsApp : ${tel}\n   • E-mail : ${item.email}\n   • Filière : ${filiere}${niveau}\n   • Pôles d'intérêt : ${interets}\n   • Date : ${date}${msg}`;
    })
    .join("\n\n----------------------------------------\n\n");

  const reportMessage = `RAPPORT D'INSCRIPTION — CLUB C-TECH (PALIER DE 5 PERSONNES)
========================================================
Nombre total d'inscrits en base : ${count}
Date du rapport : ${new Date().toLocaleString("fr-FR")}
Destinataire : ${CLUB_EMAIL}
========================================================

RÉCAPITULATIF DES 5 DERNIÈRES PERSONNES INSCRITES :

${formattedBatch}

========================================================
Rapport automatique généré par le site officiel CLUB-Tech.`;

  try {
    await _ejsSend({
      from_name: "Club C-Tech (Rapport Inscriptions)",
      from_email: CLUB_EMAIL,
      to_email: CLUB_EMAIL,
      filiere: `Rapport de 5 inscrits (Total: ${count})`,
      niveau: "Rapport Périodique",
      interets: "Bureau C-Tech",
      message: reportMessage,
      sent_at: new Date().toLocaleString("fr-FR"),
    });

    localStorage.setItem(LAST_REPORTED_KEY, String(count));
    console.info(`[CLUB-Tech] Rapport EmailJS des 5 inscrits transmis avec succès à ${CLUB_EMAIL}.`);
    return true;
  } catch (err) {
    console.warn("[CLUB-Tech] Erreur lors de l'envoi du rapport des 5 inscrits :", err);
    return false;
  }
}
