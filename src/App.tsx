import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HackathonBanner from "./components/HackathonBanner";
import About from "./components/About";
import Activities from "./components/Activities";
import Projects from "./components/Projects";
import Events from "./components/Events";
import Stats from "./components/Stats";
import Testimonials from "./components/Testimonials";
import Partners from "./components/Partners";
import Join from "./components/Join";
import Footer from "./components/Footer";
import { Toaster } from "./components/Overlays";
import { IconArrow } from "./components/icons";

/* Retour en haut */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      aria-label="Retour en haut de page"
      className={`grad-brand fixed bottom-6 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_14px_32px_-12px_var(--glow-indigo-strong)] transition-all duration-500 hover:-translate-y-1 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <IconArrow className="h-5 w-5 -rotate-90" />
    </button>
  );
}

export default function App() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" },
    );
    const scan = () =>
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")
        .forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div className="bg-paper font-sans">
      <a
        href="#accueil"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-[13px] focus:font-bold focus:text-white"
      >
        Aller au contenu
      </a>

      <Header />
      <main>
        <Hero />
        <HackathonBanner />
        <About />
        <Activities />
        <Projects />
        <Events />
        <Stats />
        <Testimonials />
        <Partners />
        <Join />
      </main>
      <Footer />

      <BackToTop />
      <Toaster />
    </div>
  );
}
