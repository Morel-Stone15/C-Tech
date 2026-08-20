/**
 * Liens externes du club — à personnaliser avant mise en production.
 * Centralisés ici pour éviter les liens morts disséminés dans les composants.
 */
export const SOCIAL_LINKS = {
  discord: "https://discord.gg/club-tech",
  github: "https://github.com/club-tech",
  instagram: "https://instagram.com/club.tech",
  linkedin: "https://linkedin.com/company/club-tech",
} as const;

/** Construit l'URL du dépôt GitHub d'un projet à partir de son titre. */
export const githubRepoUrl = (projectTitle: string): string =>
  `${SOCIAL_LINKS.github}/${projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

export const LEGAL_LINKS = {
  mentionsLegales: "/mentions-legales",
  confidentialite: "/confidentialite",
  codeDeConduite: "/code-de-conduite",
} as const;
