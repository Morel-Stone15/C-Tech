import { useEffect, useState } from "react";
import { getStoredGallery, MediaItem } from "../lib/adminStorage";
import { SectionHead } from "./ui";
import { IconPlay } from "./icons";

export default function Gallery() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("Tous");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    setItems(getStoredGallery());
    const handler = () => setItems(getStoredGallery());
    window.addEventListener("ctech_gallery_updated", handler);
    return () => window.removeEventListener("ctech_gallery_updated", handler);
  }, []);

  const filtered = items.filter((item) => {
    if (activeFilter === "Tous") return true;
    if (activeFilter === "Photos") return item.type === "photo";
    if (activeFilter === "Vidéos") return item.type === "video";
    return item.category === activeFilter;
  });

  return (
    <section id="galerie" className="relative scroll-mt-24 overflow-hidden bg-white py-20 lg:py-28">
      <div className="bg-dots absolute inset-0 opacity-30" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHead
            eyebrow="Moments forts & Projets"
            title={
              <>
                Galerie <span className="grad-text">photos & vidéos</span>.
              </>
            }
            text="Explorez les coulisses du club, nos hackathons, workshops et sessions de code en images."
          />

          {/* Filtres rapides */}
          <div className="flex flex-wrap gap-2">
            {["Tous", "Photos", "Vidéos", "Hackathon", "Workshops"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                  activeFilter === f
                    ? "bg-ink text-white shadow-md"
                    : "border border-ink/10 bg-white text-ink/70 hover:border-indigo-brand/30 hover:text-indigo-brand"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grille responsive de médias */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <article
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-paper ring-1 ring-ink/8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:ring-indigo-brand/30"
            >
              {/* Conteneur avec ratio d'aspect fixe et redimensionnement automatique */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/5">
                {item.type === "video" ? (
                  <>
                    <video
                      src={item.url}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/30 transition-colors group-hover:bg-ink/40">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-indigo-brand shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <IconPlay className="h-5 w-5 fill-current ml-0.5" />
                      </span>
                    </div>
                  </>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* Badge type & catégorie */}
                <div className="absolute left-3 top-3 flex gap-2">
                  <span className="rounded-full bg-ink/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                    {item.type === "video" ? "🎬 Vidéo" : "📷 Photo"}
                  </span>
                  <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold text-ink backdrop-blur">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="p-4">
                <h4 className="font-display text-sm font-bold text-ink transition-colors group-hover:text-indigo-brand line-clamp-1">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="mt-1 text-xs leading-relaxed text-ink/60 line-clamp-2">
                    {item.caption}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-ink/40 border-t border-ink/5 pt-2">
                  <span>{item.date}</span>
                  <span className="text-indigo-brand font-semibold group-hover:underline">
                    {item.type === "video" ? "Regarder →" : "Agrandir →"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-ink/15 p-12 text-center text-ink/50">
            Aucun média disponible dans cette catégorie pour le moment.
          </div>
        )}
      </div>

      {/* Lightbox / Lecteur Modal */}
      {selectedMedia && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            className="absolute inset-0 bg-ink/85 backdrop-blur-md"
            onClick={() => setSelectedMedia(null)}
          />

          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-ink text-white shadow-2xl ring-1 ring-white/20">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label="Fermer"
            >
              ✕
            </button>

            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              {selectedMedia.type === "video" ? (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="max-h-[70vh] w-full object-contain"
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="max-h-[70vh] w-full object-contain"
                />
              )}
            </div>

            <div className="p-5 sm:p-6 bg-ink/90">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-bright">
                  {selectedMedia.category}
                </span>
                <span className="text-xs text-white/40">· {selectedMedia.date}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white">{selectedMedia.title}</h3>
              {selectedMedia.caption && (
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{selectedMedia.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
