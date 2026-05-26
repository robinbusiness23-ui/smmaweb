"use client";

import { useState, useEffect, useRef } from "react";
import {
  EditorProvider, EditableText, DraggableLogo,
  FloatingToolbar, EditorTopBar, ImageSlot,
} from "@/app/components/Editor";
import { MonthlyReportModal } from "@/app/components/MonthlyReport";

/* ── SC Freiburg Badge ── */
function SCFreiburgBadge({ size = 80, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="52" r="48" fill="rgba(180,0,0,0.15)" />
      <circle cx="50" cy="50" r="46" fill="#CC0000" />
      <path d="M 4 50 A 46 46 0 0 1 96 50 Z" fill="#111111" />
      <line x1="4" y1="50" x2="96" y2="50" stroke="white" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="2" />
      <text x="50" y="41" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="Arial Black, Arial, sans-serif">SC</text>
      <text x="50" y="70" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="1.5">FREIBURG</text>
      <text x="50" y="82" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="6" fontFamily="Arial, sans-serif" letterSpacing="0.5">• 1904 •</text>
    </svg>
  );
}

/* ── iPhone scroll pop-in ── */
function usePhonePopEffect(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("iphone-popped"); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
}

/* ── Tilt card wrapper ── */
function TiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref as React.RefObject<HTMLElement | null>);
  return <div ref={ref} className={className} style={{ ...style, transition: "transform 0.15s ease, box-shadow 0.3s ease" }}>{children}</div>;
}

/* ── Scroll-reveal hook ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Scroll progress bar ── */
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[999] pointer-events-none">
      <div
        className="h-full transition-none"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg, #3b5bdb, #6366f1, #a855f7)",
          boxShadow: "0 0 10px rgba(99,102,241,0.8)",
        }}
      />
    </div>
  );
}

/* ── Hero floating particles ── */
const PARTICLES = [
  { w: 3,  h: 3,  top: "18%", left: "12%",  dur: "7s",  delay: "0s",   color: "rgba(99,102,241,0.6)" },
  { w: 2,  h: 2,  top: "32%", left: "6%",   dur: "9s",  delay: "1.2s", color: "rgba(165,180,252,0.5)" },
  { w: 4,  h: 4,  top: "60%", left: "15%",  dur: "6s",  delay: "2.5s", color: "rgba(59,91,219,0.7)" },
  { w: 2,  h: 2,  top: "75%", left: "8%",   dur: "8s",  delay: "0.7s", color: "rgba(165,180,252,0.4)" },
  { w: 3,  h: 3,  top: "45%", left: "3%",   dur: "11s", delay: "3s",   color: "rgba(99,102,241,0.5)" },
  { w: 5,  h: 5,  top: "22%", left: "82%",  dur: "8s",  delay: "0.4s", color: "rgba(59,91,219,0.5)" },
  { w: 2,  h: 2,  top: "55%", left: "88%",  dur: "6s",  delay: "1.8s", color: "rgba(165,180,252,0.6)" },
  { w: 3,  h: 3,  top: "70%", left: "78%",  dur: "10s", delay: "2.2s", color: "rgba(99,102,241,0.45)" },
  { w: 4,  h: 4,  top: "85%", left: "90%",  dur: "7s",  delay: "0.9s", color: "rgba(59,91,219,0.6)" },
  { w: 2,  h: 2,  top: "40%", left: "92%",  dur: "9s",  delay: "3.5s", color: "rgba(165,180,252,0.5)" },
  { w: 6,  h: 6,  top: "10%", left: "48%",  dur: "12s", delay: "1s",   color: "rgba(99,102,241,0.25)" },
  { w: 2,  h: 2,  top: "92%", left: "55%",  dur: "8s",  delay: "4s",   color: "rgba(59,91,219,0.5)" },
];

function HeroParticles() {
  return (
    <>
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: p.w,
            height: p.h,
            top: p.top,
            left: p.left,
            background: p.color,
            boxShadow: `0 0 ${p.w * 3}px ${p.color}`,
            "--dur": p.dur,
            "--delay": p.delay,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

/* ── Card tilt hook ── */
function useTilt(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(6px)`;
    };
    const onLeave = () => { el.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0)"; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [ref]);
}

/* ── Animated counter ── */
function Counter({ target, suffix = "", duration = 1800 }: { target: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || fired.current) return;
      fired.current = true;
      io.disconnect();
      const startTime = performance.now();
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const tick = (now: number) => {
        const elapsed = Math.min((now - startTime) / duration, 1);
        setVal(Math.round(easeOut(elapsed) * target));
        if (elapsed < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const NAV_LINKS = [
  { label: "Leistungen", href: "#leistungen" },
  { label: "Warum wir", href: "#warum-wir" },
  { label: "Preise", href: "#preise" },
  { label: "Kontakt", href: "#kontakt" },
];

const STATS = [
  { value: 300, suffix: "%", label: "mehr organische Reichweite nach 90 Tagen", duration: 2000 },
  { value: 48, suffix: "h", label: "maximale Reaktionszeit auf aktuelle Trends", duration: 1600 },
  { value: 100, suffix: "%", label: "Inhouse produziert – kein Outsourcing", duration: 1800 },
  { value: 12, suffix: "+", label: "Posts & Reels pro Monat, maßgeschneidert", duration: 1400 },
];

const SERVICES = [
  {
    icon: "◈",
    title: "Content-Strategie",
    desc: "Wir analysieren euren Betrieb, eure Region, eure Leute – und bauen daraus eine Strategie, die nicht nach Agentur riecht. Sondern nach euch.",
  },
  {
    icon: "◉",
    title: "Foto & Video Produktion",
    desc: "Unser Fotograf arbeitet u.a. für den SC Freiburg. Das gleiche professionelle Auge, das Bundesliga-Content produziert, dreht jetzt für euren Betrieb.",
  },
  {
    icon: "◈",
    title: "Content Creation & Posting",
    desc: "Wir übernehmen alles: Konzept, Produktion, Texte, Timing. Ihr müsst nichts mehr anfassen – außer eurem Kerngeschäft.",
  },
  {
    icon: "◉",
    title: "Community Management",
    desc: "Kommentare, DMs, Bewertungen – wir sind eure Stimme online. Schnell, menschlich und passend zu eurem Ton.",
  },
  {
    icon: "◈",
    title: "Performance Tracking",
    desc: "Monatliche Reports. Kein Buzzword-Bingo. Klare Zahlen, klare Konsequenzen.",
  },
  {
    icon: "◉",
    title: "Employer Branding",
    desc: "Der Fachkräftemangel ist real. Wer online zeigt, wie es bei euch wirklich zugeht – zieht die richtigen Leute an.",
  },
];

const REASONS = [
  {
    num: "01",
    title: "Wir verkaufen kein Social Media. Wir zeigen eure DNA.",
    desc: "Die meisten Agenturen packen jedes Unternehmen in dieselbe Schablone. Wir verbringen Zeit in eurem Betrieb, verstehen wie ihr tickt – und genau das erzählen wir.",
  },
  {
    num: "02",
    title: "Bundesliga-Qualität. Mittelstands-Preis.",
    desc: "Unser Inhouse-Fotograf dreht für den SC Freiburg. Ihr bekommt denselben Anspruch an visueller Qualität – ohne das Budget einer Profi-Sportorganisation.",
  },
  {
    num: "03",
    title: "Regional verankert. Nicht irgendwo in einer Großstadt.",
    desc: "Wir kennen die Straßen, die Betriebe, die Gesichter. Von Freiburg über das Dreisamtal bis Breisach, vom Kaiserstuhl bis nach Offenburg – wir wissen, was Vertrauen hier aufbaut. Und was Menschen in dieser Region wirklich überzeugt.",
  },
  {
    num: "04",
    title: "Keine 10.000€-Pakete. Kein Bullshit.",
    desc: "Faire, transparente Preise. Monatlich kündbar. Ihr zahlt für echte Leistung – nicht für ein Hochglanz-Deck, das dann in der Schublade verschwindet.",
  },
];

const PRICING = [
  {
    name: "Start",
    price: "890",
    tag: "Einstieg",
    features: [
      "8 Posts pro Monat (Feed + Stories)",
      "Instagram & Facebook",
      "Content-Strategie & Planung",
      "Professionelle Bildbearbeitung",
      "Community Management (Kommentare & DMs)",
      "Monatliches Reporting",
      "WhatsApp-Support",
    ],
    cta: "Jetzt starten",
    highlight: false,
  },
  {
    name: "Wachstum",
    price: "1.490",
    tag: "Beliebteste Wahl",
    features: [
      "16 Posts + Reels pro Monat",
      "Instagram, Facebook & LinkedIn",
      "Vollständiges Community Management",
      "Aktives Engagement & Follower-Aufbau",
      "Monatlicher Strategie-Call mit Robin",
      "Hashtag- & Zielgruppen-Optimierung",
      "Detailliertes Reporting & Analyse",
      "Prioritäts-Support",
    ],
    cta: "Jetzt wachsen",
    highlight: true,
  },
  {
    name: "Vollgas",
    price: "2.390",
    tag: "Maximale Präsenz",
    features: [
      "30+ Posts, Reels & Stories pro Monat",
      "Alle relevanten Plattformen",
      "Vollständiges Community Management",
      "Paid Social Ads Management (Budget separat)",
      "Employer Branding Content",
      "Wöchentliche Strategie-Calls",
      "Direktzugang zum Team",
      "Bewerbermanagement via Social Media",
    ],
    cta: "Maximale Präsenz",
    highlight: false,
  },
];

const MARQUEE_ITEMS = [
  "SC Freiburg", "Metallbauer", "Schreiner", "Region Freiburg",
  "Elektriker", "Dachdecker", "Authentischer Content", "Keine Templates",
  "Sanitär & Heizung", "Bundesliga-Qualität", "Ehrliche Preise", "Maler & Lackierer",
  "Social Media", "Employer Branding", "Kfz-Betriebe", "Inhouse Produktion",
  "SC Freiburg", "Metallbauer", "Schreiner", "Region Freiburg",
  "Elektriker", "Dachdecker", "Authentischer Content", "Keine Templates",
  "Sanitär & Heizung", "Bundesliga-Qualität", "Ehrliche Preise", "Maler & Lackierer",
  "Social Media", "Employer Branding", "Kfz-Betriebe", "Inhouse Produktion",
];

function Home({ editorMode, setEditorMode }: { editorMode: boolean; setEditorMode: (v: boolean) => void }) {
  useReveal();
  const phoneSceneRef = useRef<HTMLDivElement>(null);
  usePhonePopEffect(phoneSceneRef as React.RefObject<HTMLElement | null>);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", company: "", email: "", message: "" });
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // ── Easter egg ──
  const [footerClicks, setFooterClicks] = useState(0);
  const [showPwModal, setShowPwModal]   = useState(false);
  const [pwInput, setPwInput]           = useState("");
  const [pwError, setPwError]           = useState(false);
  const [reportOpen, setReportOpen]     = useState(false);
  const [pricingVisible, setPricingVisible] = useState(false);
  const pricingRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = pricingRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPricingVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleFooterSecretClick = () => {
    const next = footerClicks + 1;
    if (next >= 5) { setFooterClicks(0); setShowPwModal(true); }
    else setFooterClicks(next);
  };

  const checkPassword = () => {
    if (pwInput === "1312") { setEditorMode(true); setShowPwModal(false); setPwInput(""); setPwError(false); }
    else { setPwError(true); setPwInput(""); }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <ScrollProgress />

      {/* ─────────────────── NAV ─────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(10,10,15,0.92)" : "rgba(10,10,15,0.4)",
          backdropFilter: "blur(24px)",
          borderBottom: scrolled ? "1px solid rgba(59,91,219,0.2)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="text-white font-black text-xl tracking-tight group">
            Funken<span className="text-[#4c6ef5] group-hover:text-[#74c0fc] transition-colors">flug</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}
                className="text-[#b0b0c8] hover:text-white text-sm font-medium transition-all duration-200 hover:tracking-wide">
                {l.label}
              </a>
            ))}
            <a href="#kontakt"
              className="relative bg-[#3b5bdb] hover:bg-[#4c6ef5] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden group"
              style={{ boxShadow: "0 0 20px rgba(59,91,219,0.4)" }}>
              <span className="relative z-10">Gespräch buchen</span>
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2">
            <div className="w-6 space-y-1.5">
              <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 pb-6 flex flex-col gap-4 max-w-6xl mx-auto animate-fade-up">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="text-[#b0b0c8] hover:text-white text-base font-medium transition-colors py-2 border-b border-white/5">
                {l.label}
              </a>
            ))}
            <a href="#kontakt" onClick={() => setMenuOpen(false)}
              className="bg-[#3b5bdb] text-white px-5 py-3 rounded-xl text-sm font-semibold text-center mt-2">
              Gespräch buchen
            </a>
          </div>
        )}
      </nav>

      {/* ─────────────────── HERO ─────────────────── */}
      <section className="relative min-h-[85vh] md:min-h-screen flex items-center pt-20 pb-10 md:pb-0 overflow-hidden hero-bg">
        <HeroParticles />

        {/* Animated orbs */}
        <div className="absolute top-1/4 right-[8%] w-[520px] h-[520px] rounded-full pointer-events-none animate-orb"
          style={{ background: "radial-gradient(circle, rgba(59,91,219,0.25) 0%, rgba(59,91,219,0.05) 50%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-[15%] left-[5%] w-[380px] h-[380px] rounded-full pointer-events-none animate-orb-reverse"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="absolute top-[60%] right-[30%] w-[200px] h-[200px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(116,192,252,0.1) 0%, transparent 70%)", filter: "blur(30px)", animation: "orbReverse 20s ease-in-out infinite" }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-6xl mx-auto px-6 w-full py-28 relative z-10">
          <div className="max-w-3xl">

            <div className="animate-fade-up inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8"
              style={{ background: "rgba(59,91,219,0.12)", border: "1px solid rgba(59,91,219,0.35)" }}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4c6ef5] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4c6ef5]" />
              </span>
              <span className="text-[#a5b4fc] text-sm font-medium">Für Metallbauer, Schreiner, Elektriker & Co. · Region Freiburg</span>
              <span className="animate-blink text-[#4c6ef5] font-bold ml-0.5">|</span>
            </div>

            <h1
              data-eid="hero-h1"
              className="text-[clamp(2.8rem,8vw,5.5rem)] font-black leading-[1.03] mb-8 tracking-tight">
              <span className="animate-fade-up block text-white delay-100" style={{ opacity: 0 }}>Euer Betrieb.</span>
              <span className="animate-fade-up block delay-200 shimmer-text" style={{ opacity: 0 }}>
                Sichtbar gemacht.
              </span>
            </h1>

            <p
              data-eid="hero-p"
              className="animate-fade-up delay-300 text-lg md:text-xl text-[#a0a0b8] leading-relaxed mb-10 max-w-2xl"
              style={{ opacity: 0 }}>
              Wir produzieren keinen Content, der wie alle anderen aussieht.
              Wir zeigen, wer ihr wirklich seid – mit professioneller Foto- und
              Videoproduktion, die sonst für Bundesliga-Vereine gemacht wird.
            </p>

            <div className="animate-fade-up delay-400 flex flex-wrap gap-4" style={{ opacity: 0 }}>
              <a href="#kontakt"
                className="relative inline-flex items-center gap-2.5 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 overflow-hidden group animate-pulse-glow animate-bob"
                style={{ background: "linear-gradient(135deg, #3b5bdb 0%, #4c6ef5 100%)" }}>
                <span className="relative z-10 flex items-center gap-2.5">
                  Kostenloses Erstgespräch
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white/15 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600 skew-x-12" />
              </a>
              <a href="#leistungen"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-[#a5b4fc] hover:text-white transition-all duration-300 hover:bg-white/5"
                style={{ border: "1px solid rgba(165,180,252,0.2)" }}>
                Leistungen ansehen
              </a>
            </div>

            <div className="animate-fade-up delay-500 mt-14 flex flex-wrap gap-6" style={{ opacity: 0 }}>
              {[
                "Keine Knebelverträge",
                "100% Inhouse-Produktion",
                "Ab 690 €/Monat",
              ].map((label, i) => (
                <div key={i} className="flex items-center gap-2.5 group">
                  <div className="w-5 h-5 rounded-full bg-[#3b5bdb]/25 flex items-center justify-center flex-shrink-0 group-hover:bg-[#3b5bdb]/50 transition-colors">
                    <svg className="w-3 h-3 text-[#4c6ef5]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[#b0b0c8] text-sm group-hover:text-white transition-colors">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-800" style={{ opacity: 0 }}>
          <span className="text-[#4c6ef5] text-xs tracking-[0.25em] uppercase font-medium">Scroll</span>
          <div className="w-px h-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#3b5bdb] to-transparent animate-float" />
          </div>
        </div>
      </section>

      {/* ─────────────────── MARQUEE ─────────────────── */}
      <div className="py-5 overflow-hidden relative" style={{ background: "rgba(59,91,219,0.08)", borderTop: "1px solid rgba(59,91,219,0.2)", borderBottom: "1px solid rgba(59,91,219,0.2)" }}>
        <div className="flex animate-marquee whitespace-nowrap">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-8 text-sm font-semibold text-[#a0a0b8] uppercase tracking-widest">
              {item}
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b5bdb] flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ─────────────────── FÜR WEN ─────────────────── */}
      <section className="py-10 md:py-20 relative" style={{ background: "#0f0f17" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10 md:mb-14">
            <p className="reveal text-[#4c6ef5] text-xs font-bold uppercase tracking-[0.2em] mb-3">Für wen ist das hier</p>
            <h2 className="reveal delay-100 text-3xl md:text-5xl font-black text-white">
              Erkennst du euch?
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                name: "Metallbauer",
                hook: "Zeig, was du schweißt — bevor der Auftrag kommt.",
                accent: "#f97316",
                bg: "rgba(249,115,22,0.08)",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
              },
              {
                name: "Schreiner",
                hook: "Makellose Oberflächen verdienen mehr als ein Handyfoto.",
                accent: "#b45309",
                bg: "rgba(180,83,9,0.08)",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="17" width="12" height="4" rx="1"/></svg>,
              },
              {
                name: "Elektriker",
                hook: "Sauberkeit und Präzision, die Kunden vertrauen lässt.",
                accent: "#eab308",
                bg: "rgba(234,179,8,0.08)",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
              },
              {
                name: "Dachdecker",
                hook: "Euer Werk sieht von oben spektakulär aus. Zeigt es.",
                accent: "#94a3b8",
                bg: "rgba(148,163,184,0.08)",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
              },
              {
                name: "Sanitär & Heizung",
                hook: "Sauber, verlässlich, unsichtbar — macht das sichtbar.",
                accent: "#0ea5e9",
                bg: "rgba(14,165,233,0.08)",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>,
              },
              {
                name: "Maler & Lackierer",
                hook: "Vorher-Nachher ist der stärkste Content, den es gibt.",
                accent: "#a855f7",
                bg: "rgba(168,85,247,0.08)",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21.71 3.29a1 1 0 00-1.42 0L9 14.59l-.65 3.06 3.06-.65L20.71 6.71l1-1a1 1 0 000-1.42z"/><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/></svg>,
              },
              {
                name: "Kfz-Betriebe",
                hook: "Werkstatt-Atmosphäre, die sofort Vertrauen schafft.",
                accent: "#6366f1",
                bg: "rgba(99,102,241,0.08)",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
              },
              {
                name: "Zimmerei",
                hook: "Holz, Handwerk, Herzblut — Content, der das transportiert.",
                accent: "#16a34a",
                bg: "rgba(22,163,74,0.08)",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>,
              },
            ].map((trade, i) => (
              <div
                key={i}
                className="reveal group rounded-xl p-4 md:p-5 cursor-default"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  transitionDelay: `${i * 0.05}s`,
                  transition: "background 0.25s ease, border-color 0.25s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = trade.bg;
                  el.style.borderColor = `${trade.accent}44`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "rgba(255,255,255,0.02)";
                  el.style.borderColor = "rgba(255,255,255,0.05)";
                }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 flex-shrink-0"
                  style={{ background: trade.bg, color: trade.accent }}>
                  <div className="w-[18px] h-[18px]">{trade.icon}</div>
                </div>
                <h3 className="text-white font-bold text-sm mb-1.5">{trade.name}</h3>
                <p className="text-[#8888a8] text-xs leading-relaxed">{trade.hook}</p>
              </div>
            ))}
          </div>

          <p className="reveal text-center text-[#8888a8] text-sm mt-8">
            ...und jeden weiteren Handwerksbetrieb in der Region.{" "}
            <a href="#kontakt" className="text-[#4c6ef5] hover:underline transition-colors">Sprecht uns an.</a>
          </p>
        </div>
      </section>

      {/* ─────────────────── FÜR WEN NICHT ─────────────────── */}
      <div className="section-divider" />
      <section className="py-14 md:py-20 relative overflow-hidden" style={{ background: "#181820" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.04) 0%, transparent 70%)" }} />
        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="mb-10 text-center">
            <p className="reveal text-[11px] font-bold uppercase tracking-[0.22em] mb-4" style={{ color: "#f97316" }}>Ehrlichkeit first</p>
            <h2 className="reveal delay-100 text-3xl md:text-5xl font-black text-white leading-tight">
              Für wen wir <span style={{ color: "#f97316" }}>nicht</span> arbeiten.
            </h2>
            <p className="reveal delay-200 text-[#a0a0b8] mt-4 max-w-xl mx-auto text-base leading-relaxed">
              Wir sagen euch lieber vorher ob wir zusammenpassen — als hinterher beide Zeit verschwenden.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: "🏢",
                title: "Große Konzerne",
                desc: "Wer ein Inhouse-Marketing-Team hat, braucht uns nicht. Wir sind für Betriebe gebaut, die das nicht haben — und auch nicht wollen.",
              },
              {
                icon: "⚡",
                title: "Wer schnellen Ruhm will",
                desc: "10.000 Follower in 30 Tagen — das versprechen andere. Wir bauen echte Sichtbarkeit auf. Das dauert länger, hält aber.",
              },
              {
                icon: "💸",
                title: "Wer nur günstig sucht",
                desc: "Für 99 € gibt es automatisch generierte Posts ohne Seele. Wir machen echte Arbeit. Wer das nicht versteht, ist nicht unser Kunde.",
              },
            ].map((item, i) => (
              <div key={i} className="reveal rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02]"
                style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.15)", transitionDelay: `${i * 0.1}s` }}>
                <span className="text-2xl">{item.icon}</span>
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
                <p className="text-[#a0a0b8] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="reveal text-center text-[#6b6b8a] text-sm mt-8">
            Ihr findet euch in keinem davon wieder? Dann seid ihr genau richtig.{" "}
            <a href="#kontakt" className="text-[#4c6ef5] hover:underline transition-colors">Meldet euch.</a>
          </p>
        </div>
      </section>

      {/* ─────────────────── STATS ─────────────────── */}
      <section className="py-12 md:py-24 relative" style={{ background: "#181820" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(59,91,219,0.06) 0%, transparent 70%)" }} />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-3xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            {STATS.map((s, i) => (
              <div key={i} className="reveal bg-[#181820] p-6 md:p-10 text-center group hover:bg-[#151524] transition-all duration-300 relative overflow-hidden"
                style={{ transitionDelay: `${i * 0.1}s` }}>
                {/* ripple on hover */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{ background: "radial-gradient(circle at 50% 50%, rgba(59,91,219,0.08) 0%, transparent 70%)" }} />
                <div className="text-4xl md:text-6xl font-black mb-2 gradient-text-blue group-hover:scale-110 transition-transform duration-500 inline-block">
                  <Counter target={s.value} suffix={s.suffix} duration={s.duration} />
                </div>
                <div className="text-[#a0a0b8] text-sm leading-relaxed max-w-[160px] mx-auto">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── DIFFERENTIATOR BANNER ─────────────────── */}
      <div className="section-divider" />
      <section className="py-10 md:py-20 relative overflow-visible" style={{ background: "#13131a" }}>
        <div className="max-w-6xl mx-auto px-6 relative">

          {/* SC Freiburg logo — centered watermark, draggable in editor mode */}
          <div className="absolute inset-0 flex items-center justify-center select-none z-0" style={{ pointerEvents: editorMode ? "auto" : "none" }}>
            <DraggableLogo did="scf-logo" style={{ position: "relative" }}>
              <img
                src="/scf-logo.png"
                alt=""
                style={{
                  width: "520px",
                  opacity: 0.07,
                  filter: "invert(1) brightness(1.3)",
                  mixBlendMode: "screen",
                  display: "block",
                }}
                draggable={false}
              />
            </DraggableLogo>
          </div>

          <div className="reveal-scale relative rounded-3xl p-8 md:p-14 group cursor-default z-10 scan-line overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(59,91,219,0.12) 0%, rgba(99,102,241,0.06) 100%)",
              border: "1px solid rgba(59,91,219,0.25)",
            }}>
            {/* Animated border glow on hover */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ boxShadow: "inset 0 0 0 1px rgba(76,110,245,0.5), 0 0 80px rgba(59,91,219,0.2)" }} />

            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-10">
              <div className="relative flex-1">
                <p data-eid="diff-label" className="text-xs text-[#4c6ef5] font-bold uppercase tracking-[0.2em] mb-4">Was uns wirklich unterscheidet</p>
                <h2 data-eid="diff-h2" className="text-2xl md:text-4xl font-black text-white leading-tight">
                  Unser Fotograf dreht für den{" "}
                  <span style={{
                    background: "linear-gradient(125deg, #ff7070 0%, #E2001A 45%, #aa0010 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 12px rgba(226,0,26,0.45))",
                  }}>SC Freiburg</span>.
                  <br className="hidden md:block" />
                  Jetzt dreht er für euren Betrieb.
                </h2>
                <p data-eid="diff-p" className="mt-5 text-[#b0b0c8] text-base max-w-xl leading-relaxed">
                  Dieselbe Professionalität, dieselbe Bildsprache – nur dass ihr nicht
                  Bundesliga-Budget braucht. Visuell auf höchstem Niveau, weil ihr das verdient.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── PLAYER VISUAL ─────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "#0d0d16", minHeight: "auto" }}>
        {/* Atmospheric red glow right */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 90% at 85% 50%, rgba(226,0,26,0.13) 0%, transparent 65%)" }} />
        {/* Atmospheric blue glow left */}
        <div className="absolute left-0 top-0 bottom-0 w-[50%] pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 80% at 15% 50%, rgba(59,91,219,0.1) 0%, transparent 65%)" }} />
        {/* Floating micro-orbs */}
        <div className="absolute top-[20%] left-[20%] w-2 h-2 rounded-full pointer-events-none animate-bob opacity-60"
          style={{ background: "#E2001A", boxShadow: "0 0 12px rgba(226,0,26,0.8)", animationDelay: "0.5s" }} />
        <div className="absolute top-[65%] left-[35%] w-1.5 h-1.5 rounded-full pointer-events-none animate-bob opacity-50"
          style={{ background: "#4c6ef5", boxShadow: "0 0 10px rgba(76,110,245,0.8)", animationDelay: "2s" }} />
        <div className="absolute top-[40%] left-[10%] w-1 h-1 rounded-full pointer-events-none animate-bob opacity-40"
          style={{ background: "#a5b4fc", boxShadow: "0 0 8px rgba(165,180,252,0.8)", animationDelay: "3.5s" }} />
        {/* Subtle top/bottom fades to blend with neighbours */}
        <div className="absolute inset-x-0 top-0 h-28 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, #13131a, transparent)" }} />
        <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
          style={{ background: "linear-gradient(to top, #111119, transparent)" }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-0">

          {/* ── Text side ── */}
            <div className="flex-1 py-8 md:py-16 md:pr-8 order-2 md:order-1">
            <p data-eid="player-label" className="reveal text-xs text-[#E2001A] font-bold uppercase tracking-[0.22em] mb-5"
              style={{ textShadow: "0 0 20px rgba(226,0,26,0.5)" }}>
              Unser Handwerk. Euer Gesicht.
            </p>
            <h2 data-eid="player-h2" className="reveal delay-100 font-black text-white leading-[1.06] mb-6"
              style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)" }}>
              Echte Emotionen.<br />
              <span style={{
                background: "linear-gradient(125deg,#ff7070 0%,#E2001A 50%,#aa0010 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                filter: "drop-shadow(0 0 14px rgba(226,0,26,0.4))",
              }}>Echte DNA.</span>
            </h2>
            <p data-eid="player-p" className="reveal delay-200 text-[#a0a0b8] text-base leading-relaxed max-w-md mb-8">
              Dieser Moment — dieser Ausdruck — ist genau das, was eure Kunden
              über euren Betrieb spüren sollen. Wir fangen das ein.
              Nicht gestellt. Nicht generisch. Echt.
            </p>
            <div className="reveal delay-300 flex flex-col gap-3">
              {[
                { icon: "◈", text: "Dieselbe Kamera. Dieselbe Bildsprache. Jetzt für euch." },
                { icon: "◈", text: "Professionelle Produktion – ohne Bundesliga-Budget." },
                { icon: "◈", text: "Content, den eure Kunden nicht vergessen." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#4c6ef5] text-sm flex-shrink-0 mt-0.5">{item.icon}</span>
                  <span className="text-[#b0b0c8] text-sm leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Player image with oval mask ── */}
          <div className="relative flex-shrink-0 flex items-center justify-center order-1 md:order-2 pt-10 md:pt-0"
            style={{ width: "clamp(260px, 90vw, 800px)" }}>
            {/* Red glow behind player */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 70% 50% at 50% 46%, rgba(226,0,26,0.16) 0%, transparent 70%)",
                filter: "blur(30px)",
              }} />
            {/* Wrapper div carries the mask so we can clip top/bottom tightly */}
            <div
              className="reveal-scale relative"
              style={{
                width: "100%",
                /* crop bottom ~20% to eliminate watermark + grass,
                   crop top ~10% to cut stadium seats */
                overflow: "hidden",
                maskImage: `radial-gradient(
                  ellipse 46% 56% at 50% 52%,
                  black 32%,
                  rgba(0,0,0,0.9) 50%,
                  rgba(0,0,0,0.5) 67%,
                  rgba(0,0,0,0.1) 82%,
                  transparent     92%
                )`,
                WebkitMaskImage: `radial-gradient(
                  ellipse 46% 56% at 50% 52%,
                  black 32%,
                  rgba(0,0,0,0.9) 50%,
                  rgba(0,0,0,0.5) 67%,
                  rgba(0,0,0,0.1) 82%,
                  transparent     92%
                )`,
              }}
            >
              <img
                src="/scf-player.png"
                alt="SC Freiburg – echte Emotionen"
                style={{
                  width: "100%",
                  display: "block",
                  filter: "saturate(1.08) contrast(1.03)",
                }}
                draggable={false}
              />
            </div>
            {/* Subtle "SC Freiburg" badge label */}
            <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                background: "rgba(226,0,26,0.12)",
                border: "1px solid rgba(226,0,26,0.35)",
                borderRadius: "20px",
                padding: "4px 14px",
                backdropFilter: "blur(8px)",
              }}>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "rgba(255,120,120,0.9)" }}>
                SC Freiburg · Jasmyn Groeschke
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── CONTENT SHOWCASE ─────────────────── */}
      <div className="section-divider" />
      <section className="py-14 md:py-28 relative" style={{ background: "#111119", overflow: "clip" }}>
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 60% at 35% 50%, rgba(59,91,219,0.13) 0%, transparent 65%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 40% at 80% 70%, rgba(99,102,241,0.07) 0%, transparent 60%)" }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="mb-10 md:mb-16">
            <p data-eid="showcase-label" className="reveal text-[#4c6ef5] text-xs font-bold uppercase tracking-[0.2em] mb-4">Was ihr bekommt</p>
            <h2 data-eid="showcase-h2" className="reveal delay-100 text-4xl md:text-6xl font-black text-white leading-[1.05]">
              Content, der
              <span className="gradient-text"> verkauft.</span>
            </h2>
            <p data-eid="showcase-p" className="reveal delay-200 text-[#a0a0b8] text-base mt-4 max-w-lg leading-relaxed">
              Jeder Post ist ein System. Vom ersten Klick bis zum Kundenanruf.
            </p>
          </div>

          {/* Main: iPhone links + Karten rechts */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16">

            {/* ── iPhone Mockup — PNG-Overlay + Screen-HTML ── */}
            <div ref={phoneSceneRef} className="iphone-scene flex-shrink-0 mx-auto lg:mx-0">
              <div className="animate-phone-bob" style={{ position:"relative", display:"inline-block" }}>

                {/* Ambient glow */}
                <div style={{ position:"absolute", inset:"-50px -35px", zIndex:0, pointerEvents:"none",
                  background:"radial-gradient(ellipse 80% 88% at 50% 52%, rgba(59,91,219,0.26) 0%, rgba(99,102,241,0.09) 50%, transparent 76%)",
                  filter:"blur(36px)" }} />

                {/* Phone composite: screen-HTML hinter dem PNG */}
                <div style={{ position:"relative", zIndex:1, width:"275px" }}>

                  {/* Screen-Inhalt — liegt hinter dem iPhone-PNG im transparenten Bildschirmbereich */}
                  <div style={{
                    position:"absolute",
                    top:"6.84%", bottom:"9.77%",
                    left:"17.36%", right:"17.53%",
                    borderRadius:"12px",
                    overflow:"hidden",
                    zIndex:0,
                  }}>
                    {/* Instagram-Reel — cleaner Handwerk-Look */}
                    <div style={{ position:"absolute", inset:0, background:"#06070d" }}>

                      {/* Ein einzelner zentraler Glow — sauber, nicht überladen */}
                      <div style={{ position:"absolute", top:"8%", left:"-5%", width:"85%", height:"58%",
                        background:"radial-gradient(ellipse, rgba(255,105,10,0.38) 0%, rgba(200,50,0,0.14) 40%, transparent 70%)",
                        filter:"blur(28px)", borderRadius:"50%" }} />
                      {/* Subtiler Tiefenglow unten */}
                      <div style={{ position:"absolute", bottom:"15%", right:"5%", width:"55%", height:"35%",
                        background:"radial-gradient(ellipse, rgba(140,40,0,0.16) 0%, transparent 65%)",
                        filter:"blur(20px)", borderRadius:"50%" }} />

                      {/* 5 Funken — konzentriert um den Glow */}
                      {[
                        { t:"18%", l:"28%", s:2.5 },
                        { t:"24%", l:"16%", s:2   },
                        { t:"31%", l:"42%", s:1.5 },
                        { t:"22%", l:"52%", s:2   },
                        { t:"36%", l:"24%", s:1.5 },
                      ].map((p, i) => (
                        <div key={i} style={{ position:"absolute", top:p.t, left:p.l,
                          width:`${p.s}px`, height:`${p.s}px`, borderRadius:"50%",
                          background: i % 2 === 0 ? "rgba(255,210,70,0.95)" : "rgba(255,120,30,0.85)",
                          boxShadow:`0 0 ${p.s * 3}px rgba(255,155,35,0.7)` }} />
                      ))}

                      {/* Dünne Akzentlinie */}
                      <div style={{ position:"absolute", top:"45%", left:"10px", right:"44px", height:"1px",
                        background:"linear-gradient(90deg, rgba(255,110,20,0.6), rgba(255,185,60,0.25) 55%, transparent)" }} />

                      {/* Views-Badge — unterhalb Dynamic Island */}
                      <div style={{ position:"absolute", top:"16%", right:"8px",
                        background:"rgba(0,0,0,0.58)", backdropFilter:"blur(12px)",
                        borderRadius:"8px", padding:"3px 8px", border:"1px solid rgba(255,255,255,0.10)" }}>
                        <div style={{ color:"white", fontSize:"8px", fontWeight:"700", letterSpacing:"0.02em" }}>
                          👁 48,2K
                        </div>
                      </div>

                      {/* Markenname */}
                      <div style={{ position:"absolute", top:"47%", left:"10px", right:"44px" }}>
                        <div style={{ color:"white", fontSize:"15px", fontWeight:"900", lineHeight:1.2,
                          textShadow:"0 2px 20px rgba(0,0,0,1)", fontFamily:"system-ui,-apple-system,sans-serif" }}>
                          Metallbau<br />Regional
                        </div>
                        <div style={{ color:"rgba(215,160,80,0.80)", fontSize:"6.5px", fontWeight:"600",
                          letterSpacing:"0.15em", textTransform:"uppercase", marginTop:"6px" }}>
                          Freiburg im Breisgau
                        </div>
                      </div>

                      {/* Rechte Aktions-Icons — SVG statt Emoji für konsistentes Rendering */}
                      <div style={{ position:"absolute", right:"7px", bottom:"24%",
                        display:"flex", flexDirection:"column", gap:"14px", alignItems:"center" }}>
                        {/* Heart */}
                        <div style={{ textAlign:"center" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff3b5c"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                          <div style={{ color:"rgba(255,255,255,0.92)", fontSize:"7px", fontWeight:"700", marginTop:"1px" }}>3,1K</div>
                        </div>
                        {/* Comment */}
                        <div style={{ textAlign:"center" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                          <div style={{ color:"rgba(255,255,255,0.92)", fontSize:"7px", fontWeight:"700", marginTop:"1px" }}>248</div>
                        </div>
                        {/* Share */}
                        <div style={{ textAlign:"center" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                          <div style={{ color:"rgba(255,255,255,0.92)", fontSize:"7px", fontWeight:"700", marginTop:"1px" }}>512</div>
                        </div>
                        {/* Bookmark */}
                        <div style={{ textAlign:"center" }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                        </div>
                      </div>

                      {/* Bottom: User + Caption */}
                      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"8px 9px 14px",
                        background:"linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"5px" }}>
                          <div style={{ width:"24px", height:"24px", borderRadius:"50%", flexShrink:0,
                            border:"1.5px solid rgba(255,125,25,0.9)",
                            background:"linear-gradient(135deg,#b45309,#d97706 55%,#f59e0b 100%)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:"7px", fontWeight:"900", color:"white" }}>MR</div>
                          <div style={{ color:"white", fontSize:"8.5px", fontWeight:"700" }}>metallbau_regional</div>
                          <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:"5px", padding:"2px 6px",
                            fontSize:"7px", fontWeight:"700", color:"rgba(255,255,255,0.9)",
                            border:"1px solid rgba(255,255,255,0.22)", flexShrink:0, whiteSpace:"nowrap" }}>+ Folgen</div>
                        </div>
                        <div style={{ color:"rgba(255,255,255,0.80)", fontSize:"7.5px", lineHeight:1.45 }}>
                          Wenn Handwerk auf Leidenschaft trifft 🔧
                        </div>
                        <div style={{ color:"rgba(245,138,40,0.95)", fontSize:"7px", marginTop:"3px" }}>
                          #Metallbau #Handwerk #Freiburg
                        </div>
                        <div style={{ marginTop:"5px", display:"flex", alignItems:"center", gap:"4px" }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="2"><circle cx="12" cy="12" r="2"/><path d="M19.07 4.93a10 10 0 010 14.14M16.24 7.76a6 6 0 010 8.49"/></svg>
                          <span style={{ color:"rgba(255,255,255,0.42)", fontSize:"6.5px" }}>Original Audio · metallbau_regional</span>
                        </div>
                      </div>

                      {/* Home bar */}
                      <div style={{ position:"absolute", bottom:"5px", left:0, right:0, display:"flex", justifyContent:"center" }}>
                        <div style={{ width:"55px", height:"2.5px", borderRadius:"999px", background:"rgba(255,255,255,0.55)" }} />
                      </div>
                    </div>
                  </div>

                  {/* iPhone PNG — kein Hintergrund, transparenter Screen → Inhalt scheint durch */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/iphone-mockup-clean.png" alt="iPhone"
                    style={{ position:"relative", zIndex:1, width:"100%", display:"block",
                      filter:"drop-shadow(-8px 20px 38px rgba(0,0,0,0.68)) drop-shadow(0 5px 12px rgba(59,91,219,0.16))" }} />
                </div>

                {/* Bodenschatten */}
                <div style={{ position:"absolute", bottom:"-16px", left:"12%", right:"8%", height:"18px", zIndex:0, pointerEvents:"none",
                  background:"radial-gradient(ellipse at 50% 50%, rgba(59,91,219,0.36) 0%, rgba(0,0,0,0.28) 45%, transparent 70%)",
                  filter:"blur(14px)", transform:"scaleX(0.9) skewX(-5deg)" }} />
              </div>
            </div>

            {/* ── Kampagnen-Karten rechts — einzelne Spalte, Slide von rechts ── */}
            <div className="flex-1 flex flex-col gap-3 max-w-lg lg:max-w-none">
              {[
                {
                  icon: "📍",
                  iconGrad: "linear-gradient(135deg,#3b5bdb,#6366f1)",
                  title: "Bekannt in der Region",
                  badge: "Lokale Präsenz",
                  badgeColor: "#3b5bdb",
                  desc: "Wer euch sieht, denkt beim nächsten Bedarf an euch — nicht an die Konkurrenz.",
                  accent: "rgba(59,91,219,0.35)",
                },
                {
                  icon: "🧲",
                  iconGrad: "linear-gradient(135deg,#0d9488,#10b981)",
                  title: "Potenzielle Kunden",
                  badge: "Anfragen statt Likes",
                  badgeColor: "#0d9488",
                  desc: "Content, der nicht nur gefällt, sondern Anfragen bringt. Vom Scrollen zum Anrufen.",
                  accent: "rgba(13,148,136,0.35)",
                },
                {
                  icon: "👥",
                  iconGrad: "linear-gradient(135deg,#7c3aed,#a855f7)",
                  title: "Potenzielle Mitarbeiter",
                  badge: "Fachkräfte anziehen",
                  badgeColor: "#7c3aed",
                  desc: "Zeigt, warum man bei euch arbeiten will. Echte Einblicke, die Bewerber überzeugen.",
                  accent: "rgba(124,58,237,0.35)",
                },
                {
                  icon: "🏅",
                  iconGrad: "linear-gradient(135deg,#b45309,#f59e0b)",
                  title: "Markenimage",
                  badge: "Professioneller Auftritt",
                  badgeColor: "#b45309",
                  desc: "Ein konsistenter, hochwertiger Auftritt schafft Vertrauen — bei Kunden und Bewerbern.",
                  accent: "rgba(180,83,9,0.35)",
                },
                {
                  icon: "🔁",
                  iconGrad: "linear-gradient(135deg,#0369a1,#38bdf8)",
                  title: "In den Köpfen bleiben",
                  badge: "Top of Mind",
                  badgeColor: "#0369a1",
                  desc: "Regelmäßige Präsenz sorgt dafür, dass man an euch denkt — wenn es darauf ankommt.",
                  accent: "rgba(3,105,161,0.35)",
                },
                {
                  icon: "📈",
                  iconGrad: "linear-gradient(135deg,#be185d,#ec4899)",
                  title: "Organische Reichweite",
                  badge: "Ohne Werbebudget",
                  badgeColor: "#be185d",
                  desc: "Strategischer Content, der den Algorithmus für euch arbeiten lässt — ohne bezahlte Werbung.",
                  accent: "rgba(190,24,93,0.35)",
                },
              ].map((card, i) => (
                <div key={i} className="reveal-right" style={{ "--reveal-delay": `${i * 0.12}s` } as React.CSSProperties}>
                  <div className="group flex items-start gap-3 rounded-xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderLeft: `3px solid ${card.accent}`,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                      transition: "background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.055)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                      style={{ background: card.iconGrad, boxShadow: `0 4px 14px ${card.accent}` }}>
                      {card.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-white font-bold text-sm">{card.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${card.badgeColor}22`, color: card.badgeColor, border: `1px solid ${card.badgeColor}38` }}>
                          {card.badge}
                        </span>
                      </div>
                      <p className="text-[#a0a0b8] text-xs leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── BEFORE / AFTER ─────────────────── */}
      <div className="section-divider" />
      <section className="py-14 md:py-24 relative overflow-hidden" style={{ background: "#181820" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(59,91,219,0.05) 0%, transparent 65%)" }} />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <p className="reveal text-[#4c6ef5] text-xs font-bold uppercase tracking-[0.2em] mb-4">Der Unterschied</p>
            <h2 className="reveal delay-100 text-3xl md:text-5xl font-black text-white leading-tight">
              Vorher. <span className="gradient-text">Nachher.</span>
            </h2>
            <p className="reveal delay-200 text-[#a0a0b8] mt-4 max-w-lg mx-auto text-base">
              Kein Photoshop, keine Tricks — nur der Unterschied den eine klare Strategie macht.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">
            {/* BEFORE */}
            <div className="reveal-left">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>Vorher</span>
                <span className="text-[#6b6b8a] text-xs">Typisches Handwerksprofil</span>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#111118" }}>
                {/* Fake profile header */}
                <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 font-bold">MB</div>
                  <div>
                    <div className="text-white text-sm font-semibold">musterbetrieb_freiburg</div>
                    <div className="text-[#6b6b8a] text-xs">83 Beiträge · 241 Follower</div>
                  </div>
                </div>
                {/* Chaotic feed grid */}
                <div className="grid grid-cols-3 gap-px p-px">
                  {[
                    { bg: "#4a3f30", label: "📱 Handyfoto", sub: "Werkzeug auf Tisch" },
                    { bg: "#2d3a2d", label: "🌿 Urlaub?", sub: "Grünes Foto" },
                    { bg: "#3d3030", label: "😊 Flyer", sub: "Weiterempfehlen!" },
                    { bg: "#2a3545", label: "🔧 Reparatur", sub: "Job fertig 💪" },
                    { bg: "#4a4030", label: "📋 Text-Post", sub: "Öffnungszeiten" },
                    { bg: "#303040", label: "🐕 Hund", sub: "Büro-Hund heute" },
                  ].map((p, i) => (
                    <div key={i} className="aspect-square flex flex-col items-center justify-center gap-1 text-center p-1"
                      style={{ background: p.bg }}>
                      <span className="text-lg leading-none">{p.label.split(" ")[0]}</span>
                      <span className="text-[9px] text-gray-400 leading-tight">{p.sub}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <p className="text-[#6b6b8a] text-xs leading-relaxed">Ø 4 Likes · 0 Kommentare · Letzter Post vor 3 Wochen</p>
                </div>
              </div>
            </div>
            {/* AFTER */}
            <div className="reveal-right">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(59,91,219,0.15)", color: "#a5b4fc", border: "1px solid rgba(59,91,219,0.3)" }}>Nachher</span>
                <span className="text-[#6b6b8a] text-xs">Mit Funkenflug</span>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(99,102,241,0.3)", background: "#111118", boxShadow: "0 0 40px rgba(59,91,219,0.1)" }}>
                {/* Sleek profile header */}
                <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: "rgba(99,102,241,0.15)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white"
                    style={{ background: "linear-gradient(135deg,#3b5bdb,#7c3aed)" }}>MB</div>
                  <div>
                    <div className="text-white text-sm font-semibold">musterbetrieb_freiburg</div>
                    <div style={{ color: "#a5b4fc" }} className="text-xs">312 Beiträge · 2.840 Follower</div>
                  </div>
                </div>
                {/* Cohesive feed grid */}
                <div className="grid grid-cols-3 gap-px p-px">
                  {[
                    { bg: "linear-gradient(135deg,#1a2240,#2d1f3d)", label: "Reel", accent: "#7c3aed" },
                    { bg: "linear-gradient(135deg,#111827,#1e2a45)", label: "Carousel", accent: "#3b5bdb" },
                    { bg: "linear-gradient(135deg,#1a2240,#0f1729)", label: "Bild", accent: "#6366f1" },
                    { bg: "linear-gradient(135deg,#0f1729,#1e2a45)", label: "Story", accent: "#4c6ef5" },
                    { bg: "linear-gradient(135deg,#1a2240,#2d1f3d)", label: "Reel", accent: "#7c3aed" },
                    { bg: "linear-gradient(135deg,#111827,#1e2a45)", label: "Bild", accent: "#3b5bdb" },
                  ].map((p, i) => (
                    <div key={i} className="aspect-square flex flex-col items-end justify-end p-1.5"
                      style={{ background: p.bg }}>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${p.accent}30`, color: p.accent, border: `1px solid ${p.accent}50` }}>{p.label}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <p style={{ color: "#a5b4fc" }} className="text-xs leading-relaxed">Ø 184 Likes · 11 Kommentare · 3× pro Woche</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── SERVICES ─────────────────── */}
      <div className="section-divider" />
      <section id="leistungen" className="py-14 md:py-24 relative" style={{ background: "#13131a" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10 md:mb-16">
            <p data-eid="services-label" className="reveal text-[#4c6ef5] text-xs font-bold uppercase tracking-[0.2em] mb-4">Was wir tun</p>
            <h2 data-eid="services-h2" className="reveal delay-100 text-4xl md:text-6xl font-black text-white max-w-xl leading-[1.05]">
              Alles aus einer Hand.
              <span className="gradient-text"> Ohne Ausreden.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <TiltCard key={i}
                className="reveal glass rounded-2xl p-5 md:p-7 group grad-border cursor-default"
                style={{
                  transitionDelay: `${i * 0.08}s`,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ background: "rgba(59,91,219,0.12)", border: "1px solid rgba(59,91,219,0.2)" }}>
                  <span className="text-[#4c6ef5] text-lg">{s.icon}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-3 group-hover:text-[#a5b4fc] transition-colors duration-300">{s.title}</h3>
                <p className="text-[#a0a0b8] text-sm leading-relaxed">{s.desc}</p>
                <div className="mt-5 w-0 h-px bg-gradient-to-r from-[#3b5bdb] to-transparent group-hover:w-full transition-all duration-700" />
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── WHY US ─────────────────── */}
      <div className="section-divider" />
      <section id="warum-wir" className="py-14 md:py-24 relative overflow-hidden" style={{ background: "#181820" }}>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(circle at 80% 20%, rgba(59,91,219,0.1) 0%, transparent 60%)" }} />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="mb-10 md:mb-16">
            <p data-eid="why-label" className="reveal text-[#4c6ef5] text-xs font-bold uppercase tracking-[0.2em] mb-4">Warum wir</p>
            <h2 data-eid="why-h2" className="reveal delay-100 text-4xl md:text-6xl font-black text-white max-w-xl leading-[1.05]">
              Kein Pitch-Deck.
              <span className="gradient-text"> Echte Aussagen.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-8 mb-10 md:mb-20">
            {REASONS.map((r, i) => (
              <div key={i}
                className={`reveal flex gap-4 md:gap-6 group p-4 md:p-6 rounded-2xl transition-all duration-300 hover:bg-white/[0.025] ${i % 2 === 0 ? "reveal-left" : "reveal-right"}`}
                style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="flex-shrink-0 pt-0.5">
                  <span className="text-5xl md:text-6xl font-black text-[#3b5bdb]/20 group-hover:text-[#3b5bdb]/50 transition-all duration-500 group-hover:scale-110 inline-block">
                    {r.num}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-3 leading-snug group-hover:text-[#a5b4fc] transition-colors">{r.title}</h3>
                  <p className="text-[#a0a0b8] text-sm leading-relaxed">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Process steps */}
          <div>
            <p className="reveal text-[#4c6ef5] text-xs font-bold uppercase tracking-[0.2em] mb-10 text-center">So arbeiten wir</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
              {/* Connecting line desktop */}
              <div className="hidden md:block absolute top-[2.6rem] left-[12.5%] right-[12.5%] h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(59,91,219,0.5) 15%, rgba(59,91,219,0.5) 85%, transparent)" }} />

              {[
                {
                  step: "01",
                  title: "Kennenlernen",
                  time: "30 Minuten",
                  accent: "#3b5bdb",
                  desc: "Kein Sales-Pitch, kein PowerPoint. Robin hört zu — was treibt euren Betrieb an, wen wollt ihr erreichen, was hat bisher nicht funktioniert.",
                },
                {
                  step: "02",
                  title: "Vor Ort bei euch",
                  time: "1–2 Stunden",
                  accent: "#6366f1",
                  desc: "Wir kommen in die Werkstatt, auf die Baustelle, ins Büro. Ohne echten Einblick kein echter Content — so einfach ist das.",
                },
                {
                  step: "03",
                  title: "Produktionstag",
                  time: "1 Tag",
                  accent: "#7c3aed",
                  desc: "Unser Fotograf kommt mit Profi-Equipment. Ihr macht einfach euren Job — wir halten die Momente fest, die andere nicht sehen.",
                },
                {
                  step: "04",
                  title: "Los geht's",
                  time: "Ab Woche 2",
                  accent: "#4c6ef5",
                  desc: "Erster Post live. Posting nach Plan, monatliches Reporting, laufende Optimierung. Ihr seht Zahlen — keine Buzzwords.",
                },
              ].map((p, i) => (
                <div key={i} className="reveal flex md:flex-col items-start md:items-center gap-5 md:gap-0 md:text-center p-4 md:p-6 group relative"
                  style={{ transitionDelay: `${i * 0.1}s` }}>
                  {/* Mobile connector line */}
                  {i < 3 && (
                    <div className="md:hidden absolute left-[2.15rem] top-[4.5rem] bottom-0 w-px pointer-events-none"
                      style={{ background: "linear-gradient(to bottom, rgba(59,91,219,0.5), rgba(59,91,219,0.1))" }} />
                  )}
                  {/* Step circle */}
                  <div className="flex-shrink-0 w-[42px] h-[42px] rounded-full flex items-center justify-center font-black text-sm relative z-10 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `rgba(${p.accent === "#3b5bdb" ? "59,91,219" : p.accent === "#6366f1" ? "99,102,241" : p.accent === "#7c3aed" ? "124,58,237" : "76,110,245"},0.18)`, border: `1px solid ${p.accent}55`, color: p.accent }}>
                    {p.step}
                  </div>
                  <div className="flex-1 md:mt-5">
                    <div className="flex md:flex-col md:items-center gap-2 mb-1.5 md:mb-2">
                      <h4 className="text-white font-bold text-base group-hover:text-[#a5b4fc] transition-colors">{p.title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: `${p.accent}18`, color: p.accent, border: `1px solid ${p.accent}30` }}>
                        {p.time}
                      </span>
                    </div>
                    <p className="text-[#a0a0b8] text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Report CTA */}
            <div className="reveal text-center mt-14 flex flex-col items-center gap-4">
              <p style={{ color: "#6b6b8a", fontSize: "0.75rem", letterSpacing: "0.04em" }}>
                So sieht euer monatlicher Bericht aus — jeden Monat, automatisch.
              </p>
              <button
                onClick={() => setReportOpen(true)}
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(59,91,219,0.15), rgba(99,102,241,0.15))",
                  border: "1px solid rgba(99,102,241,0.35)",
                  color: "#a5b4fc",
                  boxShadow: "0 0 0 0 rgba(99,102,241,0)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 28px rgba(99,102,241,0.25)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.65)";
                  (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, rgba(59,91,219,0.25), rgba(99,102,241,0.25))";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 0 rgba(99,102,241,0)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.35)";
                  (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, rgba(59,91,219,0.15), rgba(99,102,241,0.15))";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
                Beispiel-Report ansehen
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-1">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── FOUNDER / ABOUT ─────────────────── */}
      <div className="section-divider" />
      <section className="py-14 md:py-24 relative overflow-hidden" style={{ background: "#13131a" }}>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(circle at 85% 10%, rgba(59,91,219,0.07) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(circle at 10% 90%, rgba(99,102,241,0.05) 0%, transparent 65%)" }} />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="mb-10 md:mb-16">
            <p className="reveal text-[#4c6ef5] text-xs font-bold uppercase tracking-[0.2em] mb-4">Wer steckt dahinter</p>
            <h2 className="reveal delay-100 text-4xl md:text-6xl font-black text-white leading-[1.05]">
              Ein Gesicht.
              <span className="gradient-text"> Kein Konzern.</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20">

            {/* Avatar / Foto — via ImageSlot hochladbar im Editor */}
            <div className="reveal flex-shrink-0 flex flex-col items-center gap-5">
              <div className="relative" style={{ width: "168px", height: "168px" }}>
                {/* Gradient ring */}
                <div className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(135deg, rgba(59,91,219,0.7) 0%, rgba(99,102,241,0.25) 100%)", padding: "2.5px" }}>
                  <div className="w-full h-full rounded-full" style={{ background: "#13131a" }} />
                </div>
                {/* ImageSlot — covers the inner area; shows placeholder until photo is uploaded */}
                <ImageSlot
                  eid="founder-photo"
                  alt="Robin Obrechtle"
                  style={{ position: "absolute", inset: "3px", borderRadius: "50%" }}
                  placeholder={
                    <div style={{
                      width: "100%", height: "100%", borderRadius: "50%",
                      background: "linear-gradient(145deg, #1a2240 0%, #1e1e2e 100%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: "4.5rem", fontWeight: 900, color: "rgba(59,91,219,0.45)", lineHeight: 1, userSelect: "none" }}>R</span>
                    </div>
                  }
                />
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-lg leading-tight">Robin Obrechtle</div>
                <div className="text-[#4c6ef5] text-[11px] font-bold uppercase tracking-[0.18em] mt-1">Gründer · Funkenflug</div>
                <div className="text-[#8888a8] text-xs mt-1.5">Freiburg im Breisgau</div>
              </div>
            </div>

            {/* Text */}
            <div className="reveal-right flex-1 max-w-2xl">
              <blockquote className="text-[#e0e0f0] text-xl md:text-2xl font-bold leading-snug mb-8"
                style={{ borderLeft: "3px solid rgba(59,91,219,0.55)", paddingLeft: "1.5rem" }}>
                „Jahre in der Branche, mehrere Agenturen, unzählige Budgetgespräche — und immer dieselbe Lücke: Wer macht das eigentlich für den Mittelstand?"
              </blockquote>
              <div className="space-y-4 text-[#a0a0b8] text-base leading-relaxed mb-10">
                <p>
                  Ich bin seit Jahren im Marketing tätig, habe in verschiedenen Agenturen gearbeitet und dabei vieles gesehen —
                  gute Kampagnen, schlechte Kampagnen, und vor allem eines: Preise, die kein mittelständischer Betrieb realistisch stemmen kann.
                  Dabei sind es genau diese Betriebe, die unser Land am Laufen halten.
                </p>
                <p>
                  Funkenflug ist meine Antwort darauf. Eine Agentur, die den Mittelstand wirklich ernst nimmt — vom Konzept bis zum Preis.
                  Kein Outsourcing, kein Bullshit, kein Vertrag im Kleingedruckten. Nur echte Arbeit für echte Betriebe.
                </p>
              </div>

              {/* Trust-Chips */}
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Freiburg im Breisgau" },
                  { label: "Inhouse Produktion" },
                  { label: "SC Freiburg Fotograf" },
                  { label: "Kein Outsourcing" },
                ].map((chip, i) => (
                  <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(59,91,219,0.10)",
                      border: "1px solid rgba(59,91,219,0.25)",
                      color: "#a5b4fc",
                    }}>
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── PRICING ─────────────────── */}
      <div className="section-divider" />
      <section ref={pricingRef as React.RefObject<HTMLElement>} id="preise" className="py-14 md:py-24 relative overflow-hidden" style={{ background: "#13131a" }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(59,91,219,0.12) 0%, transparent 70%)" }} />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div id="pricing-view" style={{ scrollMarginTop: "1.5rem" }} />
          <div className="mb-6">
            <p data-eid="pricing-label" className="reveal text-[#4c6ef5] text-xs font-bold uppercase tracking-[0.2em] mb-4">Preise</p>
            <h2 data-eid="pricing-h2" className="reveal delay-100 text-4xl md:text-6xl font-black text-white max-w-xl leading-[1.05]">
              Transparent. Fair.
              <span className="gradient-text"> Ohne Überraschungen.</span>
            </h2>
          </div>
          <p data-eid="pricing-p" className="reveal delay-200 text-[#b0b0c8] mb-16 max-w-xl text-base leading-relaxed">
            Content, Strategie, Community Management und Reporting — alles inklusive, aus einer Hand.
            Monatlich kündbar. Kein Mindestvertrag. Und Media Days auf Anfrage separat buchbar.
          </p>

          <div className="grid md:grid-cols-3 gap-5 md:gap-8">
            {PRICING.map((p, i) => (
              <TiltCard key={i}
                className={`reveal relative rounded-3xl p-6 md:p-8 flex flex-col cursor-default group ${
                  p.highlight ? "animate-glow-pulse" : ""
                }`}
                style={{
                  transitionDelay: `${i * 0.12}s`,
                  background: p.highlight
                    ? "linear-gradient(135deg, rgba(59,91,219,0.18) 0%, rgba(99,102,241,0.08) 100%)"
                    : "rgba(255,255,255,0.03)",
                  border: p.highlight
                    ? "1px solid rgba(59,91,219,0.5)"
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: p.highlight ? "0 0 80px rgba(59,91,219,0.2), inset 0 1px 0 rgba(255,255,255,0.06)" : "none",
                }}>
                {p.highlight && (
                  <>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="text-white text-xs font-bold px-5 py-2 rounded-full"
                        style={{ background: "linear-gradient(135deg, #3b5bdb, #6366f1)", boxShadow: "0 4px 20px rgba(59,91,219,0.5)" }}>
                        {p.tag}
                      </span>
                    </div>
                    {/* Shimmer line */}
                    <div className="absolute top-0 left-8 right-8 h-px"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)" }} />
                  </>
                )}

                <div className="mt-4 mb-2">
                  {!p.highlight && <span className="text-[#a0a0b8] text-xs font-semibold uppercase tracking-wider">{p.tag}</span>}
                </div>

                <h3 className="text-white font-black text-2xl mb-2">{p.name}</h3>
                <div className="flex items-end gap-1.5 mb-8">
                  <span className="text-4xl md:text-5xl font-black text-white group-hover:scale-105 transition-transform inline-block">{p.price}</span>
                  <span className="text-[#a0a0b8] text-lg mb-2">€/Monat</span>
                </div>

                <ul className="flex-1 space-y-3.5 mb-8">
                  {p.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: p.highlight ? "rgba(59,91,219,0.25)" : "rgba(255,255,255,0.06)" }}>
                        <svg className="w-3 h-3 text-[#4c6ef5]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-[#b0b0c8] text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>

                <a href="#kontakt"
                  className={`relative w-full text-center py-4 rounded-xl font-bold text-sm transition-all duration-300 overflow-hidden group/btn ${
                    p.highlight
                      ? "text-white"
                      : "text-[#a5b4fc] hover:text-white"
                  }`}
                  style={p.highlight
                    ? { background: "linear-gradient(135deg, #3b5bdb 0%, #6366f1 100%)", boxShadow: "0 4px 20px rgba(59,91,219,0.4)" }
                    : { border: "1px solid rgba(165,180,252,0.2)" }}>
                  <span className="relative z-10">{p.cta}</span>
                  {p.highlight && (
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                  )}
                </a>
              </TiltCard>
            ))}
          </div>

          <div className="reveal text-center mt-12 space-y-4">
            <p className="text-[#555568] text-xs">Alle Preise zzgl. MwSt. · Monatlich kündbar · Kein Mindestvertrag</p>
            <p className="text-white font-bold text-lg md:text-2xl leading-snug">
              890 € / Monat = 30 € pro Tag —<br className="hidden md:block" />{" "}
              weniger als ein Azubi-Arbeitstag kostet.{" "}
              <span className="gradient-text">Und einer der nicht schläft.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────── VERGLEICH ─────────────────── */}
      <div className="section-divider" />
      <section className="py-14 md:py-20 relative overflow-hidden" style={{ background: "#1e1e28" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="reveal text-[#4c6ef5] text-xs font-bold uppercase tracking-[0.2em] mb-4">Der direkte Vergleich</p>
            <h2 className="reveal delay-100 text-3xl md:text-5xl font-black text-white leading-tight">
              Funkenflug vs. alle anderen.
            </h2>
          </div>
          <div className="reveal rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            {/* Header row */}
            <div className="grid grid-cols-4 text-xs font-bold uppercase tracking-wider" style={{ background: "#13131a" }}>
              <div className="p-4 text-[#6b6b8a]">Kriterium</div>
              <div className="p-4 text-center" style={{ background: "rgba(59,91,219,0.15)", color: "#a5b4fc", borderLeft: "1px solid rgba(59,91,219,0.3)" }}>Funkenflug</div>
              <div className="p-4 text-center text-[#6b6b8a]" style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}>Klassische Agentur</div>
              <div className="p-4 text-center text-[#6b6b8a]" style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}>Selbst machen</div>
            </div>
            {[
              { label: "Individuelle Content-Strategie", us: "✓", agency: "Teilweise", self: "✗" },
              { label: "Vor-Ort beim Betrieb", us: "✓", agency: "Selten", self: "✓" },
              { label: "Community Management", us: "✓", agency: "✓", self: "Zu zeitaufwändig" },
              { label: "Transparente Preise", us: "✓", agency: "✗", self: "—" },
              { label: "Monatlich kündbar", us: "✓", agency: "✗", self: "—" },
              { label: "Freiburg-Expertise", us: "✓", agency: "✗", self: "✓" },
              { label: "Professionelle Qualität", us: "✓", agency: "✓", self: "✗" },
              { label: "Kosten pro Monat", us: "ab 890 €", agency: "2.000–8.000 €", self: "\"kostenlos\"" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-4 text-sm transition-colors hover:bg-white/[0.02]"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="p-4 text-[#a0a0b8]">{row.label}</div>
                <div className="p-4 text-center font-semibold" style={{ background: "rgba(59,91,219,0.07)", borderLeft: "1px solid rgba(59,91,219,0.2)", color: row.us === "✓" ? "#34d399" : "#a5b4fc" }}>{row.us}</div>
                <div className="p-4 text-center text-[#6b6b8a]" style={{ borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{row.agency}</div>
                <div className="p-4 text-center text-[#6b6b8a]" style={{ borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{row.self}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── FAQ ─────────────────── */}
      <div className="section-divider" />
      <section id="faq" className="py-14 md:py-24 relative overflow-hidden" style={{ background: "#1e1e28" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,91,219,0.07) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none animate-orb-reverse opacity-40"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="mb-8 md:mb-14 text-center">
            <p data-eid="faq-label" className="reveal text-[#4c6ef5] text-xs font-bold uppercase tracking-[0.2em] mb-4">Häufige Einwände</p>
            <h2 data-eid="faq-h2" className="reveal delay-100 text-4xl md:text-5xl font-black text-white leading-tight">
              Wir haben die Antworten.<br />
              <span className="gradient-text">Schon bevor ihr fragt.</span>
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "Wir haben Social Media schon mal probiert – hat nichts gebracht.",
                a: "Das Problem war nicht Social Media. Das Problem war generischer Content von einer Agentur, die euren Betrieb nie gesehen hat. Wir verbringen Zeit bei euch, lernen was euch antreibt – und genau das zeigen wir. Der Unterschied ist ab dem ersten Monat sichtbar.",
              },
              {
                q: "Unsere Kunden kommen über Empfehlungen. Wir brauchen das nicht.",
                a: "Noch. Aber eure nächsten Mitarbeiter nicht. Wer heute keine Fachkräfte findet, braucht morgen kein Neukundenmarketing mehr. Social Media ist 2026 das wichtigste Werkzeug für Employer Branding – und die meisten Mitbewerber schlafen da noch.",
              },
              {
                q: "Das können wir selbst machen.",
                a: "Können Sie. Die Frage ist: wann – und auf welchem Niveau? Unser Fotograf dreht für den SC Freiburg. Was in der Mittagspause mit dem Handy entsteht, sieht anders aus. Und Zeit ist auch Geld.",
              },
              {
                q: "Das ist uns zu teuer.",
                a: "Eine Stellenanzeige auf StepStone kostet ~1.200 € – einmal, ohne Garantie. Ein einziger Neukunde durch Social Media bedeutet in vielen Handwerksbranchen 5.000–50.000 € Auftragsvolumen. Dazu: ihr zahlt nicht nur für Posts, sondern für Community Management, Strategie und laufende Optimierung – alles aus einer Hand.",
              },
              {
                q: "Wir haben keine Zeit, uns darum zu kümmern.",
                a: "Genau deshalb gibt es uns. Ihr müsst gar nichts tun – außer uns einmal in euren Betrieb reinlassen und gute Arbeit machen. Den Rest übernehmen wir vollständig.",
              },
              {
                q: "Was bringt das konkret – gibt es Zahlen?",
                a: "Im Schnitt sehen unsere Kunden nach 90 Tagen 3× mehr organische Reichweite. Wichtiger: Sie bekommen Anfragen und Bewerbungen, die direkt auf Social Media zurückzuführen sind. Konkrete Ergebnisse besprechen wir im ersten Gespräch – kostenlos.",
              },
            ].map((item, i) => (
              <div key={i}
                className="reveal rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  transitionDelay: `${i * 0.06}s`,
                  background: faqOpen === i ? "rgba(59,91,219,0.08)" : "rgba(255,255,255,0.03)",
                  border: faqOpen === i ? "1px solid rgba(59,91,219,0.3)" : "1px solid rgba(255,255,255,0.06)",
                }}>
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group">
                  <span className="text-white font-semibold text-base leading-snug group-hover:text-[#a5b4fc] transition-colors">
                    {item.q}
                  </span>
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{
                      background: faqOpen === i ? "rgba(59,91,219,0.3)" : "rgba(255,255,255,0.05)",
                      transform: faqOpen === i ? "rotate(45deg)" : "rotate(0deg)",
                    }}>
                    <svg className="w-4 h-4 text-[#4c6ef5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div style={{
                  maxHeight: faqOpen === i ? "300px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
                }}>
                  <p className="px-6 pb-5 text-[#a0a0b8] text-sm leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── NICHTS TUN ─────────────────── */}
      <div className="section-divider" />
      <section className="py-14 md:py-20 relative overflow-hidden" style={{ background: "#13131a" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(239,68,68,0.04) 0%, transparent 70%)" }} />
        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "#f87171" }}>Die unbequeme Wahrheit</p>
            <h2 className="reveal delay-100 text-3xl md:text-5xl font-black text-white leading-tight">
              Was passiert,<br />wenn ihr <span style={{ color: "#f87171" }}>nichts tut.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                num: "01",
                title: "Eure Azubis findet jemand anderes",
                desc: "Jugendliche entscheiden sich für Arbeitgeber, die sie kennen. Wer auf Social Media nicht existiert, kommt bei der Jobsuche gar nicht erst in die engere Wahl. Der Fachkräftemangel ist kein Zufall.",
                accent: "#f87171",
              },
              {
                num: "02",
                title: "Euer Mitbewerber wird sichtbarer",
                desc: "Irgendwo in der Region macht gerade ein anderer Betrieb genau das, was ihr noch überlegt. Jede Woche ohne Präsenz ist eine Woche, in der er einen Vorsprung aufbaut.",
                accent: "#fb923c",
              },
              {
                num: "03",
                title: "Neukunden finden euch nicht",
                desc: "Über 70 % der Menschen recherchieren online, bevor sie einen Handwerker anrufen. Wer dort nicht auftaucht, existiert für diese Menschen schlicht nicht.",
                accent: "#fbbf24",
              },
              {
                num: "04",
                title: "Vertrauen entsteht woanders",
                desc: "Ein aktives, professionelles Profil signalisiert: Wir sind modern, wir sind da, wir können etwas. Ohne das übernehmen Mitbewerber dieses Vertrauen — still und leise.",
                accent: "#a78bfa",
              },
            ].map((item, i) => (
              <div key={i} className="reveal flex gap-5 p-6 rounded-2xl transition-all duration-300 hover:bg-white/[0.025]"
                style={{ border: "1px solid rgba(255,255,255,0.06)", transitionDelay: `${i * 0.1}s` }}>
                <div className="flex-shrink-0 text-4xl font-black leading-none mt-0.5" style={{ color: `${item.accent}20` }}>{item.num}</div>
                <div>
                  <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                  <p className="text-[#a0a0b8] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal text-center mt-10">
            <a href="#kontakt" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #3b5bdb, #6366f1)", boxShadow: "0 4px 24px rgba(59,91,219,0.4)" }}>
              Jetzt Gespräch buchen →
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────── EARLY ADOPTER CTA ─────────────────── */}
      <div className="section-divider" />
      <section className="py-12 md:py-20 relative overflow-hidden" style={{ background: "#181820" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(59,91,219,0.07) 0%, transparent 65%)" }} />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="reveal-scale rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(59,91,219,0.12) 0%, rgba(99,102,241,0.06) 100%)",
              border: "1px solid rgba(59,91,219,0.3)",
            }}>
            <div className="flex flex-col md:flex-row">

              {/* Left: Statement */}
              <div className="flex-1 p-8 md:p-14">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-7"
                  style={{ background: "rgba(59,91,219,0.15)", border: "1px solid rgba(59,91,219,0.3)" }}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4c6ef5] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4c6ef5]" />
                  </span>
                  <span className="text-[#a5b4fc] text-xs font-semibold">Jetzt live in der Region Freiburg</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.08] mb-5">
                  Noch keine
                  <span className="gradient-text"> Case Studies.</span>
                  <br />Das könntet ihr sein.
                </h2>
                <p className="text-[#b0b0c8] text-base leading-relaxed mb-8 max-w-lg">
                  Funkenflug startet jetzt in der Region. Wir suchen die ersten Betriebe, die Teil
                  unserer Erfolgsgeschichten werden — und die dafür die besten Konditionen bekommen.
                  Keine Hochglanz-Versprechen, nur echte Arbeit und echte Ergebnisse.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#kontakt"
                    className="relative inline-flex items-center justify-center gap-2.5 text-white px-7 py-4 rounded-xl font-bold text-sm transition-all duration-300 overflow-hidden group"
                    style={{ background: "linear-gradient(135deg, #3b5bdb 0%, #6366f1 100%)", boxShadow: "0 4px 24px rgba(59,91,219,0.4)" }}>
                    <span className="relative z-10 flex items-center gap-2">
                      Als Erster dabei sein
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                  </a>
                  <div className="flex items-center gap-2 text-[#8888a8] text-sm px-2">
                    <svg className="w-4 h-4 text-[#4c6ef5] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Kostenloses Erstgespräch, keine Verpflichtung
                  </div>
                </div>
              </div>

              {/* Right: 3 Slots */}
              <div className="md:w-72 p-8 md:p-10 flex flex-col justify-center gap-4"
                style={{ borderTop: "1px solid rgba(59,91,219,0.15)", borderLeft: "none" }}
                data-md-border="border-left: 1px solid rgba(59,91,219,0.15); border-top: none">
                <p className="text-[#4c6ef5] text-xs font-bold uppercase tracking-[0.18em] mb-1">Früh-Adopter-Plätze</p>
                {[
                  { label: "Platz 1", status: "vergeben", available: false },
                  { label: "Platz 2", status: "offen", available: true },
                  { label: "Platz 3", status: "offen", available: true },
                ].map((slot, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 px-4 rounded-xl"
                    style={{
                      background: slot.available ? "rgba(59,91,219,0.08)" : "rgba(255,255,255,0.02)",
                      border: slot.available ? "1px solid rgba(59,91,219,0.25)" : "1px solid rgba(255,255,255,0.05)",
                    }}>
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: slot.available ? "#4ade80" : "#ef4444", boxShadow: slot.available ? "0 0 8px rgba(74,222,128,0.6)" : "none" }} />
                    <span className="text-white font-semibold text-sm flex-1">{slot.label}</span>
                    <span className="text-xs font-bold" style={{ color: slot.available ? "#4ade80" : "#ef4444" }}>
                      {slot.status}
                    </span>
                  </div>
                ))}
                <p className="text-[#8888a8] text-xs leading-relaxed mt-1">
                  Die ersten 3 Betriebe erhalten Sonderkonditionen und werden zur Referenz auf dieser Seite.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── REGION KARTE ─────────────────── */}
      <div className="section-divider" />
      <section className="py-14 md:py-20 relative overflow-hidden" style={{ background: "#181820" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Text */}
            <div className="flex-1">
              <p className="reveal text-[#4c6ef5] text-xs font-bold uppercase tracking-[0.2em] mb-4">Unser Revier</p>
              <h2 className="reveal delay-100 text-3xl md:text-5xl font-black text-white leading-tight mb-5">
                Von Freiburg<br />
                <span className="gradient-text">bis in die Region.</span>
              </h2>
              <p className="reveal delay-200 text-[#a0a0b8] text-base leading-relaxed mb-6">
                Wir kommen zu euch — egal ob Kaiserstuhl, Dreisamtal, Markgräflerland oder Offenburg.
                Keine Anfahrtspauschalen, kein Aufwand für euch.
              </p>
              <div className="reveal delay-300 flex flex-wrap gap-2">
                {["Freiburg i.Br.", "Emmendingen", "Breisach", "Kirchzarten", "Titisee", "Staufen", "Müllheim", "Lahr", "Offenburg"].map((town) => (
                  <span key={town} className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ background: "rgba(59,91,219,0.1)", border: "1px solid rgba(59,91,219,0.2)", color: "#a5b4fc" }}>
                    {town}
                  </span>
                ))}
              </div>
            </div>
            {/* SVG Map */}
            <div className="reveal-right flex-shrink-0 w-full md:w-[300px]">
              <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[300px] mx-auto">
                <defs>
                  <radialGradient id="mapGlow" cx="50%" cy="55%" r="50%">
                    <stop offset="0%" stopColor="rgba(59,91,219,0.12)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <rect width="300" height="400" fill="url(#mapGlow)" rx="16"/>
                {/* Connection lines from Freiburg */}
                {[
                  [185,220, 195,160],[185,220, 90,210],[185,220, 265,255],
                  [185,220, 150,310],[185,220, 195,100],[185,220, 225,55],
                  [185,220, 280,310],[185,220, 130,370],
                ].map(([x1,y1,x2,y2],i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="rgba(99,102,241,0.18)" strokeWidth="1" strokeDasharray="3,4"/>
                ))}
                {/* Towns */}
                {[
                  { x: 185, y: 220, name: "Freiburg", main: true },
                  { x: 195, y: 160, name: "Emmendingen", main: false },
                  { x: 90,  y: 210, name: "Breisach", main: false },
                  { x: 265, y: 255, name: "Kirchzarten", main: false },
                  { x: 150, y: 310, name: "Staufen", main: false },
                  { x: 195, y: 100, name: "Lahr", main: false },
                  { x: 225, y: 55,  name: "Offenburg", main: false },
                  { x: 280, y: 310, name: "Titisee", main: false },
                  { x: 130, y: 370, name: "Müllheim", main: false },
                ].map((t) => (
                  <g key={t.name} filter={t.main ? "url(#glow)" : undefined}>
                    {t.main && <circle cx={t.x} cy={t.y} r="18" fill="rgba(59,91,219,0.12)" stroke="rgba(99,102,241,0.3)" strokeWidth="1"/>}
                    <circle cx={t.x} cy={t.y} r={t.main ? 6 : 4}
                      fill={t.main ? "#6366f1" : "rgba(99,102,241,0.7)"}
                      stroke={t.main ? "rgba(165,180,252,0.5)" : "rgba(99,102,241,0.3)"}
                      strokeWidth={t.main ? 2 : 1}/>
                    <text x={t.x + (t.x > 185 ? 10 : -10)} y={t.y + 4}
                      textAnchor={t.x > 185 ? "start" : "end"}
                      fill={t.main ? "#e0e0f0" : "#8888a8"}
                      fontSize={t.main ? "10" : "8.5"}
                      fontWeight={t.main ? "700" : "400"}
                      fontFamily="Inter, sans-serif">
                      {t.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── CONTACT ─────────────────── */}
      <div className="section-divider" />
      <section id="kontakt" className="py-14 md:py-24 relative overflow-hidden" style={{ background: "#13131a" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(59,91,219,0.1) 0%, transparent 70%)" }} />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
            <div>
              <p data-eid="contact-label" className="reveal text-[#4c6ef5] text-xs font-bold uppercase tracking-[0.2em] mb-4">Gespräch buchen</p>
              <h2 data-eid="contact-h2" className="reveal delay-100 text-4xl md:text-6xl font-black text-white leading-[1.05] mb-6">
                Redet mit uns.
                <span className="gradient-text block">Kostenlos.</span>
              </h2>
              <p data-eid="contact-p" className="reveal delay-200 text-[#b0b0c8] text-base leading-relaxed mb-6 md:mb-10">
                30 Minuten. Kein Pitch. Robin hört euch zu – und schaut gemeinsam
                mit euch, ob und wie wir eurem Betrieb wirklich helfen können.
                Wenn nicht, sagen wir das auch.
              </p>
              <div className="space-y-5">
                {[
                  { icon: "📍", label: "Region Freiburg & Umgebung" },
                  { icon: "✉️", label: "Robin antwortet euch persönlich — meist noch am selben Tag" },
                  { icon: "🎯", label: "Erster Call immer kostenlos" },
                ].map((item, i) => (
                  <div key={i} className={`reveal flex items-center gap-4`} style={{ transitionDelay: `${(i + 3) * 0.1}s` }}>
                    <div className="w-10 h-10 rounded-xl bg-[#3b5bdb]/10 flex items-center justify-center text-lg"
                      style={{ border: "1px solid rgba(59,91,219,0.2)" }}>
                      {item.icon}
                    </div>
                    <span className="text-[#b0b0c8] text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal-right glass rounded-3xl p-8 md:p-10" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Danke! Wir melden uns innerhalb von 24 Stunden.");
                }}
                className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Name", key: "name", placeholder: "Max Mustermann", type: "text" },
                    { label: "Betrieb", key: "company", placeholder: "Müller GmbH", type: "text" },
                  ].map(({ label, key, placeholder, type }) => (
                    <div key={key}>
                      <label className="text-[#a0a0b8] text-xs font-semibold mb-2 block uppercase tracking-wider">{label}</label>
                      <input type={type} placeholder={placeholder}
                        value={formData[key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-[#5a5a7a] focus:outline-none transition-all duration-200 focus:border-[#3b5bdb]/60"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-[#a0a0b8] text-xs font-semibold mb-2 block uppercase tracking-wider">E-Mail</label>
                  <input type="email" placeholder="max@muster.de"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-[#5a5a7a] focus:outline-none transition-all duration-200"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
                </div>
                <div>
                  <label className="text-[#a0a0b8] text-xs font-semibold mb-2 block uppercase tracking-wider">Was bewegt euch?</label>
                  <textarea rows={4} placeholder="Wir suchen jemanden der unseren Betrieb online sichtbar macht..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-[#5a5a7a] focus:outline-none transition-all duration-200 resize-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
                </div>
                <button type="submit"
                  className="relative w-full text-white py-4 rounded-xl font-bold text-sm transition-all duration-300 overflow-hidden group"
                  style={{ background: "linear-gradient(135deg, #3b5bdb 0%, #6366f1 100%)", boxShadow: "0 4px 30px rgba(59,91,219,0.4)" }}>
                  <span className="relative z-10">Nachricht senden – kostenlos</span>
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                </button>
                <p className="text-center text-[#8888a8] text-xs">
                  Keine Weitergabe eurer Daten. Keine Newsletter. Versprochen.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer className="py-8 md:py-12 relative" style={{ background: "#101017", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="text-center md:text-left">
            <div className="text-white font-black text-xl tracking-tight mb-1">
              Funken<span className="text-[#4c6ef5]">flug</span>
            </div>
            <div className="text-[#8888a8] text-xs">Social Media für Handwerksbetriebe im Mittelstand</div>
          </div>
          <div className="flex flex-wrap justify-center gap-5 md:gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}
                className="text-[#8888a8] hover:text-white text-sm transition-colors duration-200">
                {l.label}
              </a>
            ))}
          </div>
          <div className="text-[#555568] text-xs flex items-center gap-3">
            <span
              onClick={handleFooterSecretClick}
              className="select-none cursor-pointer px-1 py-0.5 rounded transition-colors hover:text-[#555568]"
              title="">
              © 2026 {footerClicks > 0 && footerClicks < 5 ? "·".repeat(footerClicks) : ""}
            </span>
            <span className="opacity-40">·</span>
            <a href="/impressum" className="hover:text-white transition-colors">Impressum</a>
            <span className="opacity-40">·</span>
            <a href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</a>
          </div>
        </div>
      </footer>

      {/* ── Password modal ── */}
      {showPwModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)" }}>
          <div className="relative rounded-3xl p-8 w-full max-w-sm" style={{ background: "#1e1e28", border: "1px solid rgba(59,91,219,0.3)", boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }}>
            <button onClick={() => { setShowPwModal(false); setPwInput(""); setPwError(false); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-[#8888a0] hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.05)" }}>✕</button>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl" style={{ background: "rgba(59,91,219,0.2)" }}>🔐</div>
              <h3 className="text-white font-black text-xl mb-1">Editor-Zugang</h3>
              <p className="text-[#8888a0] text-sm">4-stelligen Code eingeben</p>
            </div>
            <input
              type="password"
              maxLength={4}
              placeholder="• • • •"
              value={pwInput}
              onChange={e => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={e => e.key === "Enter" && checkPassword()}
              autoFocus
              className="w-full text-center text-white text-2xl font-black py-4 rounded-2xl tracking-[0.5em] focus:outline-none transition-all mb-4"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: pwError ? "2px solid rgba(239,68,68,0.6)" : "1px solid rgba(255,255,255,0.1)",
                boxShadow: pwError ? "0 0 20px rgba(239,68,68,0.2)" : "none",
              }} />
            {pwError && <p className="text-red-400 text-xs text-center mb-3 animate-fade-up">Falscher Code. Nochmal versuchen.</p>}
            <button onClick={checkPassword}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all"
              style={{ background: "linear-gradient(135deg,#3b5bdb,#6366f1)", boxShadow: "0 4px 20px rgba(59,91,219,0.4)" }}>
              Entsperren
            </button>
          </div>
        </div>
      )}

      {reportOpen && <MonthlyReportModal onClose={() => setReportOpen(false)} />}

      {/* ── Sticky pricing badge ── */}
      <a href="#pricing-view" style={{
        position: "fixed", bottom: "6.5rem", left: "1.75rem", zIndex: 998,
        display: "flex", flexDirection: "column", gap: 2,
        padding: "0.65rem 1.1rem", borderRadius: "14px",
        background: "rgba(17,17,24,0.94)", backdropFilter: "blur(14px)",
        border: "1px solid rgba(99,102,241,0.35)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        textDecoration: "none",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.04)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 28px rgba(99,102,241,0.3)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.5)";
      }}>
        <span style={{ color: "#a5b4fc", fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>Ab 890 € / Monat</span>
        <span style={{ color: "#6b6b8a", fontSize: 10 }}>Monatlich kündbar · Kein Vertrag</span>
      </a>

      {/* ── WhatsApp floating button ── */}
      <a
        href="https://wa.me/4917662612328"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        style={{
          position: "fixed",
          bottom: "1.75rem",
          right: "1.75rem",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.875rem 1.25rem 0.875rem 1rem",
          borderRadius: "9999px",
          background: "linear-gradient(135deg, #25d366, #128c4e)",
          boxShadow: "0 4px 28px rgba(37,211,102,0.45)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          textDecoration: "none",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.05)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 36px rgba(37,211,102,0.65)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 28px rgba(37,211,102,0.45)";
        }}
      >
        {/* Pulse ring */}
        <span style={{
          position: "absolute", inset: 0, borderRadius: "9999px",
          background: "rgba(37,211,102,0.3)",
          animation: "wa-pulse 2.2s ease-out infinite",
        }} />
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white" style={{ position: "relative", flexShrink: 0 }}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.533 5.845L.057 23.571a.5.5 0 0 0 .612.612l5.726-1.476A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.015-1.374l-.36-.214-3.733.962.991-3.625-.235-.372A9.818 9.818 0 1 1 12 21.818z"/>
        </svg>
        <span style={{ position: "relative", color: "white", fontWeight: 700, fontSize: "0.875rem", whiteSpace: "nowrap", lineHeight: 1.2 }}>
          Schreib mir auf WhatsApp
        </span>
      </a>

    </main>
  );
}

export default function PageWrapper() {
  const [editorMode, setEditorMode] = useState(false);
  const handleSave = () => { setEditorMode(false); alert("✓ Alle Änderungen gespeichert!"); };
  const handleCancel = () => setEditorMode(false);

  return (
    <EditorProvider active={editorMode} onSave={handleSave} onCancel={handleCancel}>
      <EditorTopBar />
      <FloatingToolbar />
      <Home editorMode={editorMode} setEditorMode={setEditorMode} />
    </EditorProvider>
  );
}
