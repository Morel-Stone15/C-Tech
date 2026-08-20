/**
 * Petit bus d'événements typé, basé sur CustomEvent.
 * Permet à n'importe quel composant de déclencher une notification (toast)
 * sans avoir à faire remonter l'état jusqu'à un parent commun.
 */

export type ToastPayload = {
  message: string;
  tone?: "success" | "error" | "info";
};

type EventMap = {
  "ms:toast": ToastPayload;
};

export function emit<K extends keyof EventMap>(type: K, detail: EventMap[K]) {
  window.dispatchEvent(new CustomEvent(type, { detail }));
}

export function on<K extends keyof EventMap>(type: K, handler: (detail: EventMap[K]) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<EventMap[K]>).detail);
  window.addEventListener(type, listener);
  return () => window.removeEventListener(type, listener);
}

/** Raccourci pour afficher une notification. */
export const toast = (message: string, tone: ToastPayload["tone"] = "info") =>
  emit("ms:toast", { message, tone });
