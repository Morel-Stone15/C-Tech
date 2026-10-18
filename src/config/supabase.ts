/**
 * ============================================================
 *  supabase.ts — REDIRIGÉ vers la base interne localStorage
 * ============================================================
 *
 *  Supabase a été retiré. Ce fichier réexporte les mêmes
 *  symboles depuis localDb.ts pour garder la compatibilité
 *  avec les composants existants sans aucune modification
 *  d'import.
 *
 *  Toutes les inscriptions sont désormais stockées
 *  localement dans le navigateur (localStorage).
 * ============================================================
 */

export {
  saveInscription,
  isSupabaseConfigured,
  supabase,
} from "./localDb";

export type { InscriptionSource, InscriptionRow } from "./localDb";
