/**
 * ============================================================
 *  CLIENT SUPABASE — CLUB-Tech & Hackathon
 * ============================================================
 *  Ajoute dans .env :
 *    VITE_SUPABASE_URL=https://xxxx.supabase.co
 *    VITE_SUPABASE_ANON_KEY=eyJhb...
 * ============================================================
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseReady = (): boolean =>
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseReady()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export type DbInscription = {
  id: string;
  nom: string;
  email: string;
  tel?: string | null;
  filiere?: string | null;
  niveau?: string | null;
  interets?: string[] | null;
  message?: string | null;
  source: string;
  created_at: string;
};
