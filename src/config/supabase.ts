/**
 * ============================================================
 *  CONFIGURATION SUPABASE — CLUB-Tech
 * ============================================================
 *
 *  Les 2 paramètres sont lus depuis `.env.local` (racine du projet).
 *  ⚠️ Toute variable exposée au navigateur DOIT commencer par `VITE_`.
 *
 *      VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
 *      VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
 *
 *  Redémarrez `npm run dev` après modification.
 *
 *  Où les trouver sur https://supabase.com/dashboard :
 *    Projet ▸ Project Settings ▸ API ▸ Project URL / anon public key
 *
 *  ⚠️ Utilisez bien la clé "anon public", jamais la "service_role" côté
 *  client — cette dernière donne un accès total à la base de données.
 *
 *  Table attendue (voir `supabase/schema.sql` fourni avec le projet) :
 *
 *    create table inscriptions (
 *      id           uuid primary key default gen_random_uuid(),
 *      created_at   timestamptz not null default now(),
 *      nom          text not null,
 *      email        text not null,
 *      filiere      text,
 *      niveau       text,
 *      interets     text[],
 *      message      text,
 *      source       text not null default 'formulaire'
 *    );
 * ============================================================
 */
import { createClient } from "@supabase/supabase-js";

// Read strictly from environment — do NOT provide production secrets in source.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const looksLikeUrl = (v: unknown): v is string =>
  typeof v === "string" && /^(https?:)\/\//i.test(v);

export const isSupabaseConfigured = (): boolean =>
  Boolean(looksLikeUrl(SUPABASE_URL) && SUPABASE_ANON_KEY);

/**
 * Client Supabase. `null` si les variables d'environnement ne sont pas
 * renseignées ou invalides — les appelants doivent vérifier `isSupabaseConfigured()`
 * avant d'utiliser ce client (ou gérer le cas `null`).
 */
let _supabase = null as ReturnType<typeof createClient> | null;
if (looksLikeUrl(SUPABASE_URL) && SUPABASE_ANON_KEY) {
  try {
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    // Do not throw during module initialization — fail gracefully in dev.
    // Consumers should call `isSupabaseConfigured()` to detect the absent client.
    // Log a clear message to aid local debugging.
    // eslint-disable-next-line no-console
    console.error(
      "[CLUB-Tech] Supabase client initialization failed:",
      err instanceof Error ? err.message : err,
    );
    _supabase = null;
  }
}

export const supabase = _supabase;

export type InscriptionSource = "formulaire" | "inscription_rapide";

export type InscriptionRow = {
  nom: string;
  email: string;
  filiere?: string | null;
  niveau?: string | null;
  interets?: string[] | null;
  message?: string | null;
  source: InscriptionSource;
};

/**
 * Enregistre une inscription dans la table `inscriptions`.
 * Renvoie `{ error: null }` en cas de succès, `{ error: string }` sinon.
 * Si Supabase n'est pas configuré, renvoie une erreur explicite plutôt
 * que d'échouer silencieusement.
 */
export async function saveInscription(row: InscriptionRow): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: "not_configured" };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("inscriptions") as any).insert(row);
  if (error) {
    console.error("[CLUB-Tech] Échec Supabase :", error.message);
    return { error: error.message };
  }
  return { error: null };
}
