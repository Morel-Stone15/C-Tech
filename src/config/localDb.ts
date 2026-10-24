/**
 * ============================================================
 *  BASE DE DONNÉES — CLUB-Tech
 * ============================================================
 *
 *  Priorité :
 *    1. Supabase (cloud) si VITE_SUPABASE_URL est défini
 *    2. localStorage (fallback local)
 *
 *  Aucune perte de données : les deux sont toujours écrits
 *  pour garantir la disponibilité hors-ligne.
 * ============================================================
 */

import { supabase, isSupabaseReady } from "../lib/supabaseClient";

export type InscriptionSource = "formulaire" | "inscription_rapide";

export type InscriptionRow = {
  nom: string;
  email: string;
  filiere?: string | null;
  niveau?: string | null;
  interets?: string[] | null;
  message?: string | null;
  source: InscriptionSource;
  tel?: string | null;
};

export type StoredInscription = InscriptionRow & {
  id: string;
  created_at: string;
};

const INSCRIPTIONS_KEY = "ctech_inscriptions";

function generateId(): string {
  return "ins_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
}

// ── LocalStorage helpers ───────────────────────────────────

function getLocalInscriptions(): StoredInscription[] {
  try {
    const raw = localStorage.getItem(INSCRIPTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setLocalInscriptions(items: StoredInscription[]): void {
  localStorage.setItem(INSCRIPTIONS_KEY, JSON.stringify(items));
}

// ── Public API ─────────────────────────────────────────────

/** Récupère toutes les inscriptions (Supabase en priorité, sinon localStorage) */
export async function getAllInscriptionsAsync(): Promise<StoredInscription[]> {
  if (isSupabaseReady() && supabase) {
    const { data, error } = await supabase
      .from("inscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) return data as StoredInscription[];
    console.warn("[DB] Supabase read error, falling back to localStorage:", error);
  }
  return getLocalInscriptions();
}

/** Version synchrone (localStorage uniquement) — pour compatibilité */
export function getAllInscriptions(): StoredInscription[] {
  return getLocalInscriptions();
}

export const listInscriptions = getAllInscriptions;

/** Sauvegarde une inscription dans Supabase ET localStorage */
export async function saveInscriptionAsync(
  row: InscriptionRow
): Promise<{ error: string | null }> {
  const existing = getLocalInscriptions();

  // Vérifier doublon localement d'abord (rapide)
  const isDuplicateLocal = existing.some(
    (ins) => ins.email.toLowerCase().trim() === (row.email || "").toLowerCase().trim()
  );
  if (isDuplicateLocal) return { error: "duplicate_email" };

  const newEntry: StoredInscription = {
    ...row,
    id: generateId(),
    created_at: new Date().toISOString(),
  };

  // 1) Supabase (cloud)
  if (isSupabaseReady() && supabase) {
    const { error } = await supabase.from("inscriptions").insert({
      id: newEntry.id,
      nom: newEntry.nom,
      email: newEntry.email,
      tel: newEntry.tel || null,
      filiere: newEntry.filiere || null,
      niveau: newEntry.niveau || null,
      interets: newEntry.interets || null,
      message: newEntry.message || null,
      source: newEntry.source,
      created_at: newEntry.created_at,
    });

    if (error) {
      // Email déjà dans Supabase
      if (error.code === "23505") return { error: "duplicate_email" };
      console.warn("[DB] Supabase insert error:", error.message);
      // On continue avec localStorage même si Supabase échoue
    }
  }

  // 2) localStorage (fallback / cache hors-ligne)
  existing.push(newEntry);
  setLocalInscriptions(existing);

  // Événement pour rafraîchissement admin
  window.dispatchEvent(new CustomEvent("ctech_inscription_added", { detail: newEntry }));

  return { error: null };
}

/** Synchrone pour rétrocompatibilité (localStorage uniquement) */
export function saveInscription(row: InscriptionRow): { error: string | null } {
  const existing = getLocalInscriptions();
  const isDuplicate = existing.some(
    (ins) => ins.email.toLowerCase().trim() === (row.email || "").toLowerCase().trim()
  );
  if (isDuplicate) return { error: "duplicate_email" };

  const newEntry: StoredInscription = {
    ...row,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  existing.push(newEntry);
  setLocalInscriptions(existing);
  window.dispatchEvent(new CustomEvent("ctech_inscription_added", { detail: newEntry }));
  return { error: null };
}

/** Supprime une inscription */
export async function deleteInscription(id: string): Promise<boolean> {
  // Supabase
  if (isSupabaseReady() && supabase) {
    await supabase.from("inscriptions").delete().eq("id", id);
  }
  // localStorage
  const existing = getLocalInscriptions();
  const filtered = existing.filter((ins) => ins.id !== id);
  setLocalInscriptions(filtered);
  return true;
}

export function clearAllInscriptions(): void {
  localStorage.removeItem(INSCRIPTIONS_KEY);
}

export const isSupabaseConfigured = isSupabaseReady;
