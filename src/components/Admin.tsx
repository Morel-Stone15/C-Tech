import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllInscriptions, getAllInscriptionsAsync, deleteInscription } from "../config/localDb";
import { supabase, isSupabaseReady } from "../lib/supabaseClient";
import {
  getStoredEvents,
  getStoredGallery,
  saveStoredEvents,
  saveStoredGallery,
  EventItem,
  MediaItem,
} from "../lib/adminStorage";
import { toast } from "../lib/bus";

const ADMIN_PASSWORD_DEFAULT =
  import.meta.env.VITE_ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD || "ctech1994";

type InscriptionItem = {
  id: string;
  nom: string;
  email: string;
  filiere?: string | null;
  niveau?: string | null;
  tel?: string | null;
  message?: string | null;
  source: string;
  created_at: string;
};

export default function Admin({ onBackToSite }: { onBackToSite: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("ctech_admin_auth") === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"inscriptions" | "events" | "gallery">("inscriptions");

  // --- Inscriptions ---
  const [inscriptions, setInscriptions] = useState<InscriptionItem[]>([]);
  const [loadingInscriptions, setLoadingInscriptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "hackathon" | "club">("all");
  const importFileRef = useRef<HTMLInputElement>(null);

  // --- Événements ---
  const [events, setEvents] = useState<EventItem[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string>("");
  const [newEvent, setNewEvent] = useState<Partial<EventItem>>({
    day: "15",
    month: "Déc",
    title: "",
    type: "Workshop",
    desc: "",
    time: "18h00 - 20h00",
    place: "Campus Cap · Libreville",
    seats: "20 places",
    url: "",
    image: "",
    price: "",
  });

  // --- Galerie ---
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [newMedia, setNewMedia] = useState<Partial<MediaItem>>({
    type: "photo",
    title: "",
    caption: "",
    url: "",
    category: "Hackathon",
    date: new Date().getFullYear().toString(),
  });
  const [uploadPreview, setUploadPreview] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated) {
      loadInscriptions();
      setEvents(getStoredEvents());
      setGallery(getStoredGallery());

      // Écouter les nouvelles inscriptions en temps réel (événement local et cross-tab)
      const onNewInscription = () => { loadInscriptions(); };
      window.addEventListener("ctech_inscription_added", onNewInscription);
      window.addEventListener("storage", onNewInscription);

      // Souscription Supabase Realtime si configuré
      let channel: any = null;
      if (isSupabaseReady() && supabase) {
        channel = supabase
          .channel("admin_realtime_inscriptions")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "inscriptions" },
            () => {
              loadInscriptions();
              toast("Nouvelle inscription synchronisée en direct !", "success");
            }
          )
          .subscribe();
      }

      // Rafraîchissement automatique toutes les 5 secondes (polling de sécurité)
      const interval = setInterval(() => loadInscriptions(), 5000);

      return () => {
        window.removeEventListener("ctech_inscription_added", onNewInscription);
        window.removeEventListener("storage", onNewInscription);
        if (channel && supabase) {
          supabase.removeChannel(channel);
        }
        clearInterval(interval);
      };
    }
  }, [isAuthenticated]);

  // Authentification
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD_DEFAULT) {
      setIsAuthenticated(true);
      sessionStorage.setItem("ctech_admin_auth", "true");
      setAuthError("");
      toast("Connexion administrateur réussie", "success");
    } else {
      setAuthError("Mot de passe incorrect.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("ctech_admin_auth");
    toast("Déconnexion effectuée", "info");
  };

  // Chargement des inscriptions depuis la base Supabase et/ou interne (localStorage)
  const loadInscriptions = async () => {
    setLoadingInscriptions(true);
    let items: InscriptionItem[] = [];

    // 1) Inscriptions du club (C-Tech) sauvegardées via Supabase et/ou localDb
    try {
      const clubIns = await getAllInscriptionsAsync();
      items = clubIns.map((d) => ({
        id: d.id,
        nom: d.nom || "Anonyme",
        email: d.email || "",
        filiere: d.filiere || "Non renseignée",
        niveau: d.niveau || "",
        tel: d.tel || "N/A",
        message: d.message || "",
        source: (d.source || "formulaire").toLowerCase(),
        created_at: d.created_at || new Date().toISOString(),
      }));
    } catch (err) {
      console.warn("[Admin] Erreur chargement inscriptions club:", err);
    }

    // 2) Inscriptions hackathon stockées localement par le site hackathon
    try {
      const demoParts = JSON.parse(localStorage.getItem("hk-demo-participants") || "[]");
      if (Array.isArray(demoParts)) {
        demoParts.forEach((p: any, i: number) => {
          if (!items.some((it) => it.email.toLowerCase() === (p.mail || "").toLowerCase())) {
            items.push({
              id: `hk-${i}`,
              nom: p.name || "Participant Hackathon",
              email: p.mail || "",
              filiere: p.fil || "Non renseignée",
              tel: p.tel || "N/A",
              message: `[Hackathon UniC'bon] Équipe: ${p.team_id || "?"}`,
              source: "hackathon",
              created_at: p.created_at || new Date().toISOString(),
            });
          }
        });
      }
    } catch {}

    // Trier par date décroissante
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setInscriptions(items);
    setLoadingInscriptions(false);
  };

  // Filtrage
  const filteredInscriptions = inscriptions.filter((it) => {
    const isHack =
      it.source.includes("hackathon") ||
      (it.message && it.message.toLowerCase().includes("hackathon"));
    if (filterType === "hackathon" && !isHack) return false;
    if (filterType === "club" && isHack) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      it.nom.toLowerCase().includes(q) ||
      it.email.toLowerCase().includes(q) ||
      (it.tel && it.tel.toLowerCase().includes(q)) ||
      (it.filiere && it.filiere.toLowerCase().includes(q)) ||
      (it.message && it.message.toLowerCase().includes(q))
    );
  });

  // ── Supprimer une inscription ──────────────────────────────────────────
  const handleDeleteInscription = async (id: string) => {
    if (!confirm("Supprimer cette inscription ? Cette action est irréversible.")) return;
    await deleteInscription(id);
    setInscriptions((prev) => prev.filter((it) => it.id !== id));
    toast("Inscription supprimée", "info");
  };

  // ── Sauvegarde JSON (export) ───────────────────────────────────────────
  const handleExportJSON = () => {
    try {
      const data = JSON.stringify(inscriptions, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sauvegarde-inscriptions-ctech-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast(`Sauvegarde téléchargée — ${inscriptions.length} inscrit(s)`, "success");
    } catch (e) {
      console.error(e);
      toast("Erreur lors de la sauvegarde", "error");
    }
  };

  // ── Restaurer depuis JSON (import) ────────────────────────────────────
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!Array.isArray(parsed)) throw new Error("Format invalide");
        // Fusionner avec les inscriptions existantes (sans doublons par id)
        const existingIds = new Set(inscriptions.map((it) => it.id));
        const newItems = parsed.filter((it: InscriptionItem) => !existingIds.has(it.id));
        const merged = [...inscriptions, ...newItems].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        // Sauvegarder dans localStorage
        const INSCRIPTIONS_KEY = "ctech_inscriptions";
        const toStore = merged.map(({ id, nom, email, tel, filiere, niveau, message, source, created_at }) => ({
          id, nom, email, tel, filiere, niveau, message, source, created_at
        }));
        localStorage.setItem(INSCRIPTIONS_KEY, JSON.stringify(toStore));
        setInscriptions(merged);
        toast(`${newItems.length} nouvelle(s) inscription(s) restaurée(s) — Total : ${merged.length}`, "success");
      } catch (err) {
        toast("Fichier invalide. Utilisez une sauvegarde JSON C-Tech.", "error");
      }
    };
    reader.readAsText(file);
    // Reset input pour permettre de recharger le même fichier
    e.target.value = "";
  };

  // ── Export PDF détaillé ────────────────────────────────────────────────
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      // Fond de l'en-tête
      doc.setFillColor(11, 16, 32); // #0B1020
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 80, "F");

      // Logo vectoriel simplifié du Club
      doc.setFillColor(75, 42, 232); // indigo
      doc.circle(44, 40, 18, "F");
      doc.setFillColor(62, 198, 224); // cyan
      doc.circle(52, 34, 9, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("C", 38, 45);

      // Titres
      doc.setFontSize(18);
      doc.text("CLUB-TECH × HACKATHON UNIC'BON 2026", 75, 36);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(180, 200, 240);
      doc.text(
        `Liste officielle des inscriptions · Date d'extraction : ${new Date().toLocaleString("fr-FR")} · Total : ${filteredInscriptions.length} inscrit(s)`,
        75,
        54,
      );

      // Préparation du tableau
      const tableData = filteredInscriptions.map((it, idx) => {
        const isHack =
          it.source.includes("hackathon") ||
          (it.message && it.message.toLowerCase().includes("hackathon"));
        const dateStr = new Date(it.created_at).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return [
          idx + 1,
          dateStr,
          it.nom,
          it.email,
          it.tel || "N/A",
          it.filiere || "-",
          isHack ? "Hackathon" : "Club C-Tech",
          (it.message || "").replace(/\[Hackathon UniC’bon 2026\]/i, "").trim() || "Aucune note",
        ];
      });

      autoTable(doc, {
        startY: 95,
        head: [["N°", "Date", "Nom complet", "E-mail", "Téléphone", "Filière", "Événement", "Détails / Projet"]],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: [75, 42, 232],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9,
        },
        styles: {
          fontSize: 8.5,
          cellPadding: 6,
          valign: "middle",
          overflow: "linebreak",
        },
        columnStyles: {
          0: { cellWidth: 26, halign: "center" },
          1: { cellWidth: 72 },
          2: { cellWidth: 95, fontStyle: "bold" },
          3: { cellWidth: 120 },
          4: { cellWidth: 80 },
          5: { cellWidth: 80 },
          6: { cellWidth: 70, halign: "center" },
          7: { cellWidth: "auto" },
        },
        alternateRowStyles: {
          fillColor: [247, 248, 252],
        },
        didDrawPage: (data) => {
          // Pied de page
          const str = `Page ${data.pageNumber} — Document officiel généré par la direction CLUB-Tech & IST`;
          doc.setFontSize(8);
          doc.setTextColor(140, 140, 140);
          doc.text(
            str,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 14,
            { align: "center" },
          );
        },
      });

      doc.save(`inscriptions-ctech-hackathon-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast("Export PDF généré avec succès !", "success");
    } catch (e) {
      console.error(e);
      toast("Erreur lors de la création du PDF", "error");
    }
  };

  // Gestion des événements
  const handleEventImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setEventImagePreview(result);
      setNewEvent((prev) => ({ ...prev, image: result }));
      toast("Image de l'événement chargée avec succès !", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleEditEvent = (ev: EventItem) => {
    setEditingEventId(ev.id);
    setNewEvent({
      day: ev.day,
      month: ev.month,
      title: ev.title,
      type: ev.type,
      desc: ev.desc,
      time: ev.time,
      place: ev.place,
      seats: ev.seats,
      url: ev.url || "",
      image: ev.image || "",
      price: ev.price || "",
    });
    setEventImagePreview(ev.image || "");
    toast(`Modification de l'événement : ${ev.title}`, "info");

    // Défiler vers le formulaire d'édition
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleCancelEditEvent = () => {
    setEditingEventId(null);
    setEventImagePreview("");
    setNewEvent({
      day: "15",
      month: "Déc",
      title: "",
      type: "Workshop",
      desc: "",
      time: "18h00 - 20h00",
      place: "Campus Cap · Libreville",
      seats: "20 places",
      url: "",
      image: "",
      price: "",
    });
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title?.trim()) {
      toast("Le titre de l'événement est requis", "error");
      return;
    }

    if (editingEventId) {
      // Mode mise à jour
      const updated = events.map((ev) => {
        if (ev.id === editingEventId) {
          return {
            ...ev,
            day: newEvent.day || ev.day,
            month: newEvent.month || ev.month,
            title: newEvent.title?.trim() || ev.title,
            type: newEvent.type || ev.type,
            desc: newEvent.desc || "",
            time: newEvent.time || ev.time,
            place: newEvent.place || ev.place,
            seats: newEvent.seats || ev.seats,
            url: newEvent.url || "",
            image: newEvent.image || eventImagePreview || ev.image || "",
            price: newEvent.price || ev.price || "",
          };
        }
        return ev;
      });

      setEvents(updated);
      saveStoredEvents(updated);
      toast("Événement mis à jour avec succès !", "success");
      handleCancelEditEvent();
    } else {
      // Mode création
      const item: EventItem = {
        id: `ev-${Date.now()}`,
        day: newEvent.day || "15",
        month: newEvent.month || "Mois",
        title: newEvent.title.trim(),
        type: newEvent.type || "Workshop",
        desc: newEvent.desc || "",
        time: newEvent.time || "18h00",
        place: newEvent.place || "Campus Cap · Libreville",
        seats: newEvent.seats || "Places disponibles",
        url: newEvent.url || "",
        image: newEvent.image || eventImagePreview || "",
        price: newEvent.price || "",
        from: "var(--color-indigo-brand)",
        to: "var(--color-cyan-bright)",
      };

      const updated = [item, ...events];
      setEvents(updated);
      saveStoredEvents(updated);
      toast("Événement ajouté et publié !", "success");
      handleCancelEditEvent();
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Confirmez-vous la suppression de cet événement ?")) {
      const updated = events.filter((ev) => ev.id !== id);
      setEvents(updated);
      saveStoredEvents(updated);
      if (editingEventId === id) {
        handleCancelEditEvent();
      }
      toast("Événement supprimé", "info");
    }
  };

  // Gestion des médias de la galerie
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    setNewMedia((prev) => ({
      ...prev,
      type: isVideo ? "video" : "photo",
      title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
    }));

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setUploadPreview(result);
      setNewMedia((prev) => ({ ...prev, url: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.title?.trim()) {
      toast("Le titre du média est requis", "error");
      return;
    }
    if (!newMedia.url?.trim() && !uploadPreview) {
      toast("Veuillez sélectionner un fichier ou renseigner une URL", "error");
      return;
    }

    const item: MediaItem = {
      id: `media-${Date.now()}`,
      type: newMedia.type || "photo",
      title: newMedia.title.trim(),
      caption: newMedia.caption || "",
      url: newMedia.url || uploadPreview,
      category: (newMedia.category as any) || "Hackathon",
      date: newMedia.date || new Date().getFullYear().toString(),
    };

    const updated = [item, ...gallery];
    setGallery(updated);
    saveStoredGallery(updated);
    toast("Média ajouté avec redimensionnement automatique !", "success");
    setNewMedia({
      type: "photo",
      title: "",
      caption: "",
      url: "",
      category: "Hackathon",
      date: new Date().getFullYear().toString(),
    });
    setUploadPreview("");
  };

  const handleDeleteMedia = (id: string) => {
    const updated = gallery.filter((m) => m.id !== id);
    setGallery(updated);
    saveStoredGallery(updated);
    toast("Média supprimé de la galerie", "info");
  };

  // Si non authentifié -> Formulaire de connexion
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white/5 p-8 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
          <div className="text-center">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 text-3xl ring-1 ring-indigo-400/30">
              🔐
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold">Espace Administration</h2>
            <p className="mt-1 text-sm text-white/60">
              Accès réservé aux organisateurs du Club C-Tech & IST
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {authError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-200">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Clé d&apos;administration / Mot de passe
              </label>
              <input
                type="password"
                required
                autoFocus
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Entrez votre mot de passe (ex: ctech1994)"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-cyan-bright focus:outline-none focus:ring-2 focus:ring-cyan-bright/20"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #4b2ae8 0%, #3ec6e0 100%)" }}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={onBackToSite}
              className="w-full text-center text-xs text-white/50 hover:text-white py-1 cursor-pointer"
            >
              ← Retour au site public
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Statistiques calculées
  const totalCount = inscriptions.length;
  const hackathonCount = inscriptions.filter(
    (i) =>
      i.source.includes("hackathon") || (i.message && i.message.toLowerCase().includes("hackathon")),
  ).length;
  const clubCount = totalCount - hackathonCount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Admin */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/90 backdrop-blur-md px-3 sm:px-8 py-3 sm:py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 font-display text-base sm:text-lg font-bold text-white shadow-md">
              C
            </span>
            <div>
              <h1 className="font-display text-sm sm:text-lg font-bold text-white">
                CLUB-Tech · Administration
              </h1>
              <p className="text-[10px] sm:text-[11px] text-white/50">Gestion en temps réel & contenu dynamique</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToSite}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              🌐 Voir le site
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full bg-red-500/20 px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-red-300 hover:bg-red-500/30 cursor-pointer"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Navigation des Onglets */}
      <div className="border-b border-white/10 bg-slate-900 px-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl gap-2 sm:gap-4 overflow-x-auto">
          {[
            { id: "inscriptions", label: "👥 Inscriptions en direct", count: totalCount },
            { id: "events", label: "📅 Gestion Événements", count: events.length },
            { id: "gallery", label: "🎬 Galeries Photos & Vidéos", count: gallery.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex shrink-0 items-center gap-2 border-b-2 py-3.5 sm:py-4 px-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === t.id
                  ? "border-cyan-400 text-cyan-300"
                  : "border-transparent text-white/50 hover:text-white"
              }`}
            >
              <span>{t.label}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] sm:text-[11px]">
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenu principal de l'admin */}
      <main className="flex-1 p-4 sm:p-8">
        <div className="mx-auto max-w-7xl">
          {/* ========================================================= */}
          {/* ONGLET 1 : INSCRIPTIONS & EXPORT PDF                      */}
          {/* ========================================================= */}
          {activeTab === "inscriptions" && (
            <div className="space-y-6">
              {/* Cartes KPI */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    Total Inscriptions
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold text-white">
                      {totalCount}
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">En direct</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    Hackathon UniC&apos;bon
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold text-indigo-300">
                      {hackathonCount}
                    </span>
                    <span className="text-xs text-white/50">candidats</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Membres Club C-Tech
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold text-cyan-300">
                      {clubCount}
                    </span>
                    <span className="text-xs text-white/50">inscrits</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                    Action Rapide
                  </span>
                  <div className="mt-2">
                    <button
                      onClick={handleExportPDF}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 cursor-pointer"
                    >
                      <span>📄 Exporter en PDF avec Logo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Barre de contrôle, recherche et actions */}
              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom, email, téléphone ou filière..."
                    className="w-full max-w-sm rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
                  />
                  <div className="flex gap-1.5">
                    {[
                      { id: "all", label: "Tous" },
                      { id: "hackathon", label: "Hackathon" },
                      { id: "club", label: "Club" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFilterType(f.id as any)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                          filterType === f.id
                            ? "bg-indigo-600 text-white"
                            : "bg-white/5 text-white/60 hover:text-white"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-3">
                  {/* Actualiser */}
                  <button
                    onClick={loadInscriptions}
                    disabled={loadingInscriptions}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/10 cursor-pointer disabled:opacity-50"
                  >
                    <span>🔄 {loadingInscriptions ? "Actualisation..." : "Actualiser"}</span>
                  </button>

                  {/* Sauvegarde JSON */}
                  <button
                    onClick={handleExportJSON}
                    title="Télécharger toutes les inscriptions en fichier JSON (sauvegarde)"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 cursor-pointer"
                  >
                    <span>💾 Sauvegarder ({inscriptions.length})</span>
                  </button>

                  {/* Restaurer depuis JSON */}
                  <button
                    onClick={() => importFileRef.current?.click()}
                    title="Charger une sauvegarde JSON pour restaurer des inscriptions"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-violet-500/40 bg-violet-500/10 px-4 py-2.5 text-xs font-bold text-violet-300 hover:bg-violet-500/20 cursor-pointer"
                  >
                    <span>📂 Charger sauvegarde</span>
                  </button>

                  {/* Input fichier caché pour l'import JSON */}
                  <input
                    ref={importFileRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />

                  {/* Télécharger PDF */}
                  <button
                    onClick={handleExportPDF}
                    title="Générer et télécharger la liste en PDF"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow cursor-pointer"
                  >
                    <span>📄 Télécharger PDF ({filteredInscriptions.length})</span>
                  </button>
                </div>
              </div>

              {/* Tableau détaillé des inscrits */}
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-white/80">
                    <thead className="border-b border-white/10 bg-white/5 text-[11px] font-bold uppercase tracking-wider text-white/60">
                      <tr>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Nom complet</th>
                        <th className="py-3.5 px-4">Contact</th>
                        <th className="py-3.5 px-4">Filière</th>
                        <th className="py-3.5 px-4">Événement</th>
                        <th className="py-3.5 px-4">Détails / Motivation</th>
                        <th className="py-3.5 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredInscriptions.map((it) => {
                        const isHack =
                          it.source.includes("hackathon") ||
                          (it.message && it.message.toLowerCase().includes("hackathon"));
                        const dateStr = new Date(it.created_at).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                        return (
                          <tr key={it.id} className="hover:bg-white/[0.03] transition-colors">
                            <td className="py-3 px-4 text-xs text-white/50 whitespace-nowrap">
                              {dateStr}
                            </td>
                            <td className="py-3 px-4 font-bold text-white">{it.nom}</td>
                            <td className="py-3 px-4">
                              <div className="text-xs text-white">{it.email}</div>
                              <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                                {it.tel || "Pas de numéro"}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-xs text-white/70">
                              <span className="rounded bg-white/10 px-2 py-0.5">{it.filiere}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  isHack
                                    ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30"
                                    : "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/30"
                                }`}
                              >
                                {isHack ? "Hackathon" : "Club C-Tech"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs text-white/60 max-w-xs truncate">
                              {it.message || "Aucun message spécifique"}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDeleteInscription(it.id)}
                                title="Supprimer cette inscription"
                                className="rounded-lg bg-red-500/15 px-2.5 py-1 text-[11px] font-bold text-red-400 hover:bg-red-500/30 cursor-pointer"
                              >
                                × Suppr.
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredInscriptions.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <span className="text-4xl">📋</span>
                              <p className="text-white/50 text-sm font-semibold">
                                {inscriptions.length === 0
                                  ? "Aucune inscription enregistrée sur ce navigateur."
                                  : "Aucun résultat pour cette recherche."}
                              </p>
                              {inscriptions.length === 0 && (
                                <p className="text-white/30 text-xs max-w-sm text-center leading-relaxed">
                                  Les inscriptions s'affichent ici dès qu'un visiteur soumet le formulaire
                                  d'adhésion sur ce même navigateur/appareil. Elles sont stockées localement.
                                </p>
                              )}
                              <button
                                onClick={loadInscriptions}
                                className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 cursor-pointer"
                              >
                                🔄 Actualiser maintenant
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ONGLET 2 : GESTION DES ÉVÉNEMENTS                          */}
          {/* ========================================================= */}
          {activeTab === "events" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Formulaire ajout / modification événement */}
              <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold text-white">
                    {editingEventId ? "✏️ Modifier l'événement" : "➕ Ajouter un événement"}
                  </h3>
                  {editingEventId && (
                    <button
                      type="button"
                      onClick={handleCancelEditEvent}
                      className="text-xs text-white/50 hover:text-white underline cursor-pointer"
                    >
                      Annuler
                    </button>
                  )}
                </div>

                {editingEventId && (
                  <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                    Mode modification actif. Modifiez les champs ci-dessous puis cliquez sur « Enregistrer les modifications ».
                  </div>
                )}

                <form onSubmit={handleSaveEvent} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">
                      Titre de l&apos;événement *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex. Hackathon UniC’bon 2026"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1">
                        Jour (ex. 13)
                      </label>
                      <input
                        type="text"
                        required
                        value={newEvent.day}
                        onChange={(e) => setNewEvent({ ...newEvent, day: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1">
                        Mois (ex. Nov)
                      </label>
                      <input
                        type="text"
                        required
                        value={newEvent.month}
                        onChange={(e) => setNewEvent({ ...newEvent, month: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1">Type</label>
                      <select
                        value={newEvent.type}
                        onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-slate-800 px-3 py-2 text-sm text-white"
                      >
                        <option value="Hackathon">Hackathon</option>
                        <option value="Hackathon Officiel">Hackathon Officiel</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Conférence">Conférence</option>
                        <option value="Compétition">Compétition</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1">
                        Places
                      </label>
                      <input
                        type="text"
                        value={newEvent.seats}
                        onChange={(e) => setNewEvent({ ...newEvent, seats: e.target.value })}
                        placeholder="Ex. 20 équipes"
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">
                      Cotisation / Tarif estimé (ex. 15 000 FCFA / personne)
                    </label>
                    <input
                      type="text"
                      value={newEvent.price || ""}
                      onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
                      placeholder="Ex. 15 000 FCFA / personne ou Inclus adhésion"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white placeholder:text-white/30"
                    />
                  </div>

                  {/* Image de l'événement */}
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">
                      Image / Affiche de l&apos;événement
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEventImageFile}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/70 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-indigo-500 cursor-pointer"
                      />
                      <input
                        type="text"
                        placeholder="Ou URL de l'image (ex. /images/hackathon.jpeg)"
                        value={newEvent.image || ""}
                        onChange={(e) => {
                          setNewEvent({ ...newEvent, image: e.target.value });
                          setEventImagePreview(e.target.value);
                        }}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs text-white placeholder:text-white/30"
                      />
                    </div>

                    {(eventImagePreview || newEvent.image) && (
                      <div className="mt-2 relative rounded-xl overflow-hidden border border-white/15 bg-black/40 p-2">
                        <div className="flex items-center justify-between mb-1.5 px-1">
                          <span className="text-[11px] font-semibold text-cyan-400">Aperçu de l&apos;image :</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEventImagePreview("");
                              setNewEvent({ ...newEvent, image: "" });
                            }}
                            className="text-[11px] text-red-400 hover:underline cursor-pointer"
                          >
                            Retirer l&apos;image
                          </button>
                        </div>
                        <img
                          src={eventImagePreview || newEvent.image}
                          alt="Aperçu événement"
                          className="h-28 w-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">
                      Lieu & Horaires
                    </label>
                    <input
                      type="text"
                      value={newEvent.place}
                      onChange={(e) => setNewEvent({ ...newEvent, place: e.target.value })}
                      placeholder="Campus Cap · Libreville"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white mb-2"
                    />
                    <input
                      type="text"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      placeholder="Ven. 18h → Dim. 18h"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">
                      Description complète
                    </label>
                    <textarea
                      rows={3}
                      value={newEvent.desc}
                      onChange={(e) => setNewEvent({ ...newEvent, desc: e.target.value })}
                      placeholder="Détails sur l'événement..."
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white placeholder:text-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">
                      Lien d&apos;inscription / URL (optionnel)
                    </label>
                    <input
                      type="url"
                      value={newEvent.url}
                      onChange={(e) => setNewEvent({ ...newEvent, url: e.target.value })}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className={`flex-1 rounded-xl py-3 text-sm font-bold text-white shadow-md transition cursor-pointer ${
                        editingEventId
                          ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110"
                          : "bg-indigo-600 hover:bg-indigo-500"
                      }`}
                    >
                      {editingEventId ? "💾 Enregistrer les modifications" : "Publier l'événement"}
                    </button>
                    {editingEventId && (
                      <button
                        type="button"
                        onClick={handleCancelEditEvent}
                        className="rounded-xl bg-white/10 hover:bg-white/15 px-4 py-3 text-sm font-semibold text-white/70 cursor-pointer"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Liste des événements actuels */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-display text-lg font-bold text-white mb-2 flex items-center justify-between">
                  <span>Événements en ligne ({events.length})</span>
                  <span className="text-xs font-normal text-white/40">Cliquez sur « ✏️ » pour modifier</span>
                </h3>

                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className={`flex flex-col sm:flex-row items-start justify-between gap-4 rounded-2xl border p-5 shadow-sm transition ${
                      editingEventId === ev.id
                        ? "border-cyan-400 bg-slate-900/90 ring-2 ring-cyan-400/30"
                        : "border-white/10 bg-slate-900"
                    }`}
                  >
                    <div className="flex gap-4 flex-1">
                      {/* Date ou miniature */}
                      <div className="relative shrink-0">
                        {ev.image ? (
                          <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/15">
                            <img
                              src={ev.image}
                              alt={ev.title}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                              <span className="font-display text-xs font-bold leading-none">{ev.day}</span>
                              <span className="text-[9px] uppercase font-bold">{ev.month}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30">
                            <span className="font-display text-2xl font-bold leading-none">
                              {ev.day}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider">
                              {ev.month}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70 uppercase">
                            {ev.type}
                          </span>
                          <span className="text-xs text-white/40">{ev.seats}</span>
                          {ev.price && (
                            <span className="rounded bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30 px-2 py-0.5 text-[10px] font-bold">
                              💰 {ev.price}
                            </span>
                          )}
                        </div>
                        <h4 className="font-display text-base font-bold text-white mt-1">
                          {ev.title}
                        </h4>
                        <p className="text-xs text-white/60 mt-1 line-clamp-2">{ev.desc}</p>
                        <p className="text-[11px] text-cyan-400 mt-2">📍 {ev.place} · {ev.time}</p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleEditEvent(ev)}
                        className="rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ring-1 ring-cyan-400/30"
                        title="Modifier cet événement"
                      >
                        ✏️ <span>Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/25 px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer ring-1 ring-red-400/30"
                        title="Supprimer cet événement"
                      >
                        🗑️ <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ONGLET 3 : GESTION DES GALERIES PHOTOS & VIDÉOS          */}
          {/* ========================================================= */}
          {activeTab === "gallery" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Formulaire ajout photo / vidéo */}
              <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-md">
                <h3 className="font-display text-lg font-bold text-white mb-4">
                  📸 Ajouter une Photo ou Vidéo
                </h3>
                <form onSubmit={handleAddMedia} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1">Type</label>
                      <select
                        value={newMedia.type}
                        onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value as any })}
                        className="w-full rounded-xl border border-white/15 bg-slate-800 px-3 py-2 text-sm text-white"
                      >
                        <option value="photo">Photo</option>
                        <option value="video">Vidéo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1">
                        Catégorie
                      </label>
                      <select
                        value={newMedia.category}
                        onChange={(e) =>
                          setNewMedia({ ...newMedia, category: e.target.value as any })
                        }
                        className="w-full rounded-xl border border-white/15 bg-slate-800 px-3 py-2 text-sm text-white"
                      >
                        <option value="Hackathon">Hackathon</option>
                        <option value="Workshops">Workshops</option>
                        <option value="Vie du Club">Vie du Club</option>
                        <option value="Conférences">Conférences</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">
                      Fichier local (image ou vidéo MP4)
                    </label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/70 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white hover:file:bg-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">
                      Ou chemin / URL vers le média
                    </label>
                    <input
                      type="text"
                      placeholder="Ex. /images/hackathon.jpeg ou https://..."
                      value={newMedia.url}
                      onChange={(e) => {
                        setNewMedia({ ...newMedia, url: e.target.value });
                        setUploadPreview(e.target.value);
                      }}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white"
                    />
                  </div>

                  {/* Aperçu avec redimensionnement automatique */}
                  {(uploadPreview || newMedia.url) && (
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                      <p className="text-[11px] font-semibold text-cyan-400 mb-2">
                        ✓ Aperçu avec redimensionnement automatique
                      </p>
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                        {newMedia.type === "video" ? (
                          <video
                            src={uploadPreview || newMedia.url}
                            controls
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src={uploadPreview || newMedia.url}
                            alt="Aperçu"
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">
                      Titre du média *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex. Présentation des projets Hackathon"
                      value={newMedia.title}
                      onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">
                      Légende / Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Description concise..."
                      value={newMedia.caption}
                      onChange={(e) => setNewMedia({ ...newMedia, caption: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 py-3 text-sm font-bold text-white shadow-md transition cursor-pointer"
                  >
                    Ajouter à la galerie
                  </button>
                </form>
              </div>

              {/* Médias existants */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-display text-lg font-bold text-white mb-2">
                  Galerie en ligne ({gallery.length} éléments)
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {gallery.map((item) => (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-sm"
                    >
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                        {item.type === "video" ? (
                          <video
                            src={item.url}
                            className="h-full w-full object-cover"
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                        <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur">
                          {item.type === "video" ? "Vidéo" : "Photo"}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-cyan-400 font-bold uppercase">
                            {item.category}
                          </span>
                          <h4 className="font-display text-xs font-bold text-white line-clamp-1">
                            {item.title}
                          </h4>
                        </div>
                        <button
                          onClick={() => handleDeleteMedia(item.id)}
                          className="text-white/40 hover:text-red-400 p-1 text-xs cursor-pointer"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
