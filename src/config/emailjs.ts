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
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || import.meta.env.EMAILJS_SERVICE_ID || "",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || import.meta.env.EMAILJS_TEMPLATE_ID || "",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || import.meta.env.EMAILJS_PUBLIC_KEY || "",
} as const;

/** Si `false`, le formulaire bascule en mode démonstration. */
export const isEmailJsConfigured = (): boolean =>
  Boolean(EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.publicKey);

export const CLUB_EMAIL =
  import.meta.env.VITE_ORGANIZER_EMAIL ||
  import.meta.env.ORGANIZER_EMAIL ||
  import.meta.env.VITE_CLUB_EMAIL ||
  "ctech2798@gmail.com";

import emailjs from "@emailjs/browser";
import type { StoredInscription } from "./localDb";

const LAST_REPORTED_KEY = "ctech_last_email_report_count";

/**
 * Vérifie si un nouveau palier de 5 inscriptions a été atteint.
 * Si oui, génère et envoie un rapport détaillé avec les 5 derniers inscrits
 * (nom, e-mail, téléphone/WhatsApp, filière, message) au compte du club : ctech2798@gmail.com
 */
export async function checkAndSendBatchReport(allInscriptions: StoredInscription[]): Promise<boolean> {
  if (!isEmailJsConfigured()) return false;

  const count = allInscriptions.length;
  if (count < 5) return false;

  const lastReported = parseInt(localStorage.getItem(LAST_REPORTED_KEY) || "0", 10);

  // Se déclenche dès qu'un groupe de 5 personnes s'est inscrit depuis le dernier rapport
  if (count - lastReported < 5) return false;

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
    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        from_name: "Club C-Tech (Rapport Inscriptions)",
        from_email: CLUB_EMAIL,
        to_email: CLUB_EMAIL,
        filiere: `Rapport de 5 inscrits (Total: ${count})`,
        niveau: "Rapport Périodique",
        interets: "Bureau C-Tech",
        message: reportMessage,
        sent_at: new Date().toLocaleString("fr-FR"),
      },
      EMAILJS_CONFIG.publicKey,
    );

    localStorage.setItem(LAST_REPORTED_KEY, String(count));
    console.info(`[CLUB-Tech] Rapport EmailJS des 5 inscrits transmis avec succès à ${CLUB_EMAIL}.`);
    return true;
  } catch (err) {
    console.warn("[CLUB-Tech] Erreur lors de l'envoi du rapport des 5 inscrits :", err);
    return false;
  }
}
