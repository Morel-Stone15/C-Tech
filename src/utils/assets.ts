/**
 * Utilitaire pour résoudre correctement les chemins d'images et vidéos
 * selon l'environnement (base URL GitHub Pages '/C-Tech/' ou Vercel/Local '/')
 */
export function assetUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || "/";
  return base.endsWith("/") ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
}
