export type MediaItem = {
  id: string;
  type: "photo" | "video";
  title: string;
  caption?: string;
  url: string;
  category: "Hackathon" | "Workshops" | "Vie du Club" | "Conférences";
  date: string;
};

export type EventItem = {
  id: string;
  day: string;
  month: string;
  title: string;
  type: string;
  desc: string;
  time: string;
  place: string;
  seats: string;
  from?: string;
  to?: string;
  url?: string;
  image?: string;
  price?: string;
  featured?: boolean;
};

const DEFAULT_GALLERY: MediaItem[] = [
  {
    id: "g-1",
    type: "photo",
    title: "Hackathon UniC’bon — Édition 2026",
    caption: "Travail d'équipe et émulation collective autour des prototypes numériques.",
    url: "/images/hackathon.jpeg",
    category: "Hackathon",
    date: "Novembre 2026",
  },
  {
    id: "g-2",
    type: "video",
    title: "Vidéo officielle — Esprit C-Tech",
    caption: "Immersion dans les projets, les sessions de code et la communauté.",
    url: "/images/VD C-tech.mp4",
    category: "Vie du Club",
    date: "2026",
  },
  {
    id: "g-3",
    type: "photo",
    title: "Événement tech avec l'ANIMF",
    caption: "Atelier de découverte de l'écosystème mobile et React Native.",
    url: "/images/Evenement ANIMF.jpg",
    category: "Workshops",
    date: "2025",
  },
  {
    id: "g-4",
    type: "video",
    title: "Teaser et coulisses du club",
    caption: "Retour vidéo sur nos sessions de prototypage et d'entraide.",
    url: "/images/video cahe.mp4",
    category: "Vie du Club",
    date: "2026",
  },
  {
    id: "g-5",
    type: "photo",
    title: "Plateforme Clikpay mobile",
    caption: "Partenariat étudiant avec la startup Clikpay pour le paiement mobile.",
    url: "/images/clikpay_brown.png",
    category: "Workshops",
    date: "2025",
  },
  {
    id: "g-6",
    type: "photo",
    title: "Développement Quiz Tech",
    caption: "Projet collaboratif de quiz interactif pour les étudiants de l'IST.",
    url: "/images/quiz tech.png",
    category: "Workshops",
    date: "2025",
  },
  {
    id: "g-7",
    type: "photo",
    title: "Membres actifs en session",
    caption: "Brainstorming et architecture logicielle entre étudiants.",
    url: "/images/henzo.png",
    category: "Vie du Club",
    date: "2026",
  },
  {
    id: "g-8",
    type: "photo",
    title: "Mentorat et entraide",
    caption: "Accompagnement des nouveaux membres sur les bases du web.",
    url: "/images/hely.JPG",
    category: "Workshops",
    date: "2026",
  },
];

const DEFAULT_EVENTS: EventItem[] = [
  {
    id: "ev-1",
    day: "13",
    month: "Nov",
    title: "Hackathon UniC’bon 2026 — IST × C-Tech",
    type: "Hackathon Officiel",
    desc: "3 jours et 20 équipes de 5 étudiants réunis à Libreville pour imaginer des solutions numériques gabonaises. Cotisation estimée à 15 000 FCFA par personne (repas, espace 48h, goodies, encadrement).",
    time: "13 → 15 nov. 2026",
    place: "Campus Cap · Libreville",
    seats: "20 équipes · Places limitées",
    from: "var(--color-indigo-brand)",
    to: "var(--color-violet-pop)",
    featured: true,
    url: "https://ctech2798.github.io/Hackathon-UniC-Bon/",
    image: "/images/hackathon.jpeg",
    price: "15 000 FCFA / pers.",
  },
  {
    id: "ev-2",
    day: "22",
    month: "Mars",
    title: "Workshop — Docker de zéro à la prod",
    type: "Workshop",
    desc: "Conteneurise ta première application et déploie-la. Amène ton laptop, on s'occupe du reste.",
    time: "18 h 30 → 20 h 30",
    place: "Salle C-204",
    seats: "12 places restantes",
    from: "var(--color-violet-pop)",
    to: "var(--color-blue-electric)",
    image: "/images/Evenement ANIMF.jpg",
    price: "Inclus adhésion club",
  },
  {
    id: "ev-3",
    day: "04",
    month: "Avril",
    title: "Talk — « De la fac à l'entreprise »",
    type: "Conférence",
    desc: "Rencontre avec d'anciens membres du club devenus ingénieurs logiciels et data scientists.",
    time: "19 h → 20 h 30",
    place: "Amphi Turing",
    seats: "Entrée libre",
    from: "var(--color-blue-electric)",
    to: "var(--color-cyan-bright)",
  },
  {
    id: "ev-4",
    day: "18",
    month: "Avril",
    title: "Contest algo — Qualifications régionales",
    type: "Compétition",
    desc: "Entraînement chronométré en conditions réelles, suivi d'une correction collective des problèmes.",
    time: "14 h → 18 h",
    place: "Labo informatique 2",
    seats: "20 places restantes",
    from: "var(--color-cyan-bright)",
    to: "var(--color-indigo-brand)",
  },
];

const GALLERY_KEY = "ctech_gallery_media";
const EVENTS_KEY = "ctech_events_list";

import { assetUrl } from "../utils/assets";

export function getStoredGallery(): MediaItem[] {
  try {
    const raw = localStorage.getItem(GALLERY_KEY);
    const list = raw ? JSON.parse(raw) : DEFAULT_GALLERY;
    const cleanList = Array.isArray(list) && list.length > 0 ? list : DEFAULT_GALLERY;
    return cleanList.map((item: MediaItem) => ({
      ...item,
      url: assetUrl(item.url),
    }));
  } catch {
    return DEFAULT_GALLERY.map((item) => ({ ...item, url: assetUrl(item.url) }));
  }
}

export function saveStoredGallery(items: MediaItem[]) {
  try {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("ctech_gallery_updated"));
  } catch (e) {
    console.error("Erreur sauvegarde galerie:", e);
  }
}

export function getStoredEvents(): EventItem[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    const list = raw ? JSON.parse(raw) : DEFAULT_EVENTS;
    const cleanList = Array.isArray(list) && list.length > 0 ? list : DEFAULT_EVENTS;
    return cleanList.map((item: EventItem) => ({
      ...item,
      image: item.image ? assetUrl(item.image) : undefined,
    }));
  } catch {
    return DEFAULT_EVENTS.map((item) => ({
      ...item,
      image: item.image ? assetUrl(item.image) : undefined,
    }));
  }
}

export function saveStoredEvents(events: EventItem[]) {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    window.dispatchEvent(new CustomEvent("ctech_events_updated"));
  } catch (e) {
    console.error("Erreur sauvegarde événements:", e);
  }
}
