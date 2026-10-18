/**
 * ============================================================
 *  BASE DE DONNÉES INTERNE — CLUB-Tech
 * ============================================================
 *
 *  Toutes les inscriptions sont stockées localement dans le
 *  localStorage du navigateur. Aucune dépendance cloud externe.
 *
 *  Clés localStorage utilisées :
 *    ctech_inscriptions   → liste des inscriptions du club
 *    hk-demo-participants → inscriptions hackathon (partagé)
 * ============================================================
 */

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

/** Génère un identifiant unique simple */
function generateId(): string {
  return "ins_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
}

/** Récupère toutes les inscriptions locales */
export function getAllInscriptions(): StoredInscription[] {
  try {
    const raw = localStorage.getItem(INSCRIPTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const listInscriptions = getAllInscriptions;

/** Sauvegarde une inscription en base locale.
 *  Renvoie `{ error: null }` si OK, `{ error: string }` en cas d'échec.
 */
export function saveInscription(row: InscriptionRow): { error: string | null } {
  try {
    const existing = getAllInscriptions();

    // Vérifier doublons par email
    const isDuplicate = existing.some(
      (ins) => ins.email.toLowerCase().trim() === (row.email || "").toLowerCase().trim()
    );
    if (isDuplicate) {
      return { error: "duplicate_email" };
    }

    const newEntry: StoredInscription = {
      ...row,
      id: generateId(),
      created_at: new Date().toISOString(),
    };

    existing.push(newEntry);
    localStorage.setItem(INSCRIPTIONS_KEY, JSON.stringify(existing));

    // Déclencher un événement pour que l'admin se rafraîchisse
    window.dispatchEvent(new CustomEvent("ctech_inscription_added", { detail: newEntry }));

    return { error: null };
  } catch (err) {
    console.error("[CLUB-Tech] Erreur sauvegarde inscription locale:", err);
    return { error: "storage_error" };
  }
}

/** Supprime une inscription par son id */
export function deleteInscription(id: string): boolean {
  try {
    const existing = getAllInscriptions();
    const filtered = existing.filter((ins) => ins.id !== id);
    localStorage.setItem(INSCRIPTIONS_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

/** Efface toutes les inscriptions (attention : irréversible) */
export function clearAllInscriptions(): void {
  localStorage.removeItem(INSCRIPTIONS_KEY);
}

// Alias pour compatibilité avec l'ancien code Supabase
export const isSupabaseConfigured = (): boolean => false;
export const supabase = null;
