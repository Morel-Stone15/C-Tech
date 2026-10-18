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

/**
 * ------------------------------------------------------------
 *  VARIABLES DU MODÈLE EMAILJS
 * ------------------------------------------------------------
 *    {{from_name}}   — Nom complet
 *    {{from_email}}  — E-mail (à placer en « Reply-To »)
 *    {{filiere}}     — Filière / année
 *    {{niveau}}      — Niveau en code
 *    {{interets}}    — Pôles d'intérêt (liste)
 *    {{message}}     — Motivation
 *    {{sent_at}}     — Date d'envoi
 *    {{to_email}}    — Destinataire
 * ------------------------------------------------------------
 */
