/**
 * ============================================================
 *  Supabase Data Accessors – Hackathon
 * ============================================================
 *  Provides simple wrappers for the three tables we created:
 *    - participants
 *    - jury_applications
 *    - inscriptions (club)
 *  All functions automatically fall back to localStorage when Supabase
 *  is not configured, preserving the offline experience.
 */

import { supabase, isSupabaseReady } from "../lib/supabaseClient";

/** Participants --------------------------------------------------- */
export type Participant = {
  id: number;
  name: string;
  mail: string;
  tel?: string | null;
  fil?: string | null;
  team_id?: number | null;
  team_name?: string | null;
  is_leader?: boolean;
  created_at: string;
};

export async function fetchParticipants(): Promise<Participant[]> {
  if (isSupabaseReady() && supabase) {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data as Participant[];
    console.warn("[Supabase] participants fetch error:", error);
  }
  // Fallback – read from localStorage used by demo mode
  try {
    const raw = localStorage.getItem("hk-demo-participants") || "[]";
    return JSON.parse(raw) as Participant[];
  } catch {
    return [];
  }
}

/** Jury Applications --------------------------------------------- */
export type JuryApplication = {
  id: number;
  name: string;
  mail: string;
  tel?: string | null;
  organization?: string | null;
  expertise?: string | null;
  days?: string[] | null;
  created_at: string;
};

export async function fetchJuryApplications(): Promise<JuryApplication[]> {
  if (isSupabaseReady() && supabase) {
    const { data, error } = await supabase
      .from("jury_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data as JuryApplication[];
    console.warn("[Supabase] jury fetch error:", error);
  }
  // Fallback – demo local storage
  try {
    const raw = localStorage.getItem("hk-demo-jury") || "[]";
    return JSON.parse(raw) as JuryApplication[];
  } catch {
    return [];
  }
}

/** Club inscriptions -------------------------------------------- */
export async function fetchClubInscriptions() {
  // Le module localDb expose déjà getAllInscriptionsAsync
  const { getAllInscriptionsAsync } = await import("./localDb");
  return getAllInscriptionsAsync();
}
