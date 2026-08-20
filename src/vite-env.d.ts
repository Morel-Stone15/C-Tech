/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Identifiant du service EmailJS (ex. service_ab12cde) */
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  /** Identifiant du modèle EmailJS (ex. template_fg34hij) */
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  /** Clé publique EmailJS (Account ▸ API Keys ▸ Public Key) */
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
