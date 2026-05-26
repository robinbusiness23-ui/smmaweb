"use client";
import { useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

export const REPORT_POSTS = [
  { date: "01.04.", title: "Morgens in der Halle — bevor der erste Funken fliegt", type: "Reel",     reach: 2840, likes: 187, comments: 9,  shares: 34, saves: 56 },
  { date: "03.04.", title: "Vorher / Nachher: Balkongeländer Freiburg-Wiehre",     type: "Carousel", reach: 1240, likes: 89,  comments: 8,  shares: 21, saves: 38 },
  { date: "05.04.", title: "Unser Team — die Leute hinter dem Stahl",              type: "Bild",     reach: 890,  likes: 124, comments: 11, shares: 18, saves: 42 },
  { date: "08.04.", title: "Neues Projekt: Freitragende Treppe in Breisach",       type: "Reel",     reach: 3120, likes: 241, comments: 9,  shares: 48, saves: 87 },
  { date: "10.04.", title: "Schweißen wie es sein soll — Details, die man sieht", type: "Bild",     reach: 720,  likes: 68,  comments: 7,  shares: 15, saves: 29 },
  { date: "12.04.", title: "Edelstahl-Geländer komplett in Eigenproduktion",       type: "Carousel", reach: 1580, likes: 112, comments: 10, shares: 27, saves: 51 },
  { date: "15.04.", title: "Marcel — 12 Jahre im Betrieb",                         type: "Reel",     reach: 1890, likes: 152, comments: 11, shares: 29, saves: 44 },
  { date: "17.04.", title: "Kundenreferenz: Familie Weber, Kirchzarten",           type: "Bild",     reach: 640,  likes: 58,  comments: 7,  shares: 12, saves: 22 },
  { date: "19.04.", title: "Hinter den Kulissen: Planung eines Großprojekts",      type: "Carousel", reach: 1020, likes: 84,  comments: 9,  shares: 19, saves: 35 },
  { date: "22.04.", title: "Funken, Stahl und Stolz — was Metallbau bedeutet",     type: "Reel",     reach: 2240, likes: 198, comments: 10, shares: 41, saves: 72 },
  { date: "24.04.", title: "Detailaufnahmen: Qualität zeigt sich im Kleinen",      type: "Carousel", reach: 890,  likes: 74,  comments: 8,  shares: 16, saves: 31 },
  { date: "26.04.", title: "April in Zahlen — euer Betrieb wächst",               type: "Carousel", reach: 1120, likes: 91,  comments: 9,  shares: 24, saves: 45 },
];

const WEEKLY_FOLLOWERS = [
  { week: "KW 14", new: 28, total: 1073 },
  { week: "KW 15", new: 34, total: 1107 },
  { week: "KW 16", new: 31, total: 1138 },
  { week: "KW 17", new: 34, total: 1172 },
];

// rows = days, cols = time slots
const HEATMAP = {
  days:  ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  times: ["8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
  values: [
    [6,  11, 17, 21, 29, 54, 68, 36],   // Mo
    [5,  10, 15, 19, 25, 49, 64, 33],   // Di
    [8,  12, 19, 23, 31, 57, 72, 40],   // Mi
    [6,  11, 16, 20, 27, 51, 67, 38],   // Do
    [11, 15, 23, 30, 41, 75, 91, 57],   // Fr
    [21, 39, 56, 63, 71, 85, 97, 77],   // Sa
    [25, 41, 59, 61, 67, 81, 93, 71],   // So
  ],
};

const COMMENTS_HIGHLIGHTS = [
  {
    post: "Neues Projekt: Freitragende Treppe in Breisach",
    items: [
      { user: "Markus_B",       text: "Wahnsinn! Wie lange dauert sowas ungefähr?" },
      { user: "handwerk_süd",   text: "Endlich mal ein Betrieb aus der Region, der so arbeitet 🔥" },
      { user: "Sandra.W_FR",    text: "Macht ihr das auch für Privatkunden?" },
      { user: "Bauleiter_KA",   text: "Das Geländer ist Edelstahl, oder? Fragen für ein Angebot." },
      { user: "heimwerker_86",  text: "Absolut top Arbeit, Respekt!" },
      { user: "Region_Freiburg",text: "Habt ihr noch Kapazitäten für Q3 dieses Jahr?" },
      { user: "Thomas_Arch",    text: "Schickt mir mal eure Kontaktdaten, ich bräuchte sowas fürs Büro." },
      { user: "petra_im_dr",    text: "Freiburg ist stolz auf solche Betriebe 💪" },
      { user: "julius.k",       text: "Preis-Leistung stimmt bei euch einfach" },
    ],
  },
  {
    post: "Marcel — 12 Jahre im Betrieb",
    items: [
      { user: "Ingo_M",         text: "Marcel macht das richtig Hammer 👏" },
      { user: "azubi_sucht",    text: "Sowas suche ich — habt ihr offene Ausbildungsplätze?" },
      { user: "fachkraft2026",  text: "Kann ich mich direkt bei euch bewerben?" },
      { user: "ElternVzwei",    text: "Mein Sohn sucht gerade eine Ausbildung im Metallbereich!" },
      { user: "meister_bw",     text: "Top-Mitarbeiter verdienen genau so eine Bühne. Weiter so!" },
      { user: "HRprofi",        text: "Employer Branding auf dem richtigen Level 👌" },
      { user: "breisgau_local", text: "12 Jahre — da steckt richtig viel Herzblut drin" },
      { user: "Nico_Schreiner", text: "Klasse Content, immer wieder gerne auf dem Feed 🙌" },
      { user: "regional_stark", text: "Diese Authentizität ist einfach unbezahlbar" },
      { user: "simone.h_79",    text: "Macht weiter so, die Region braucht solche Betriebe!" },
      { user: "handwerk_ehrt",  text: "Genau das ist modernes Employer Branding — super gemacht" },
    ],
  },
  {
    post: "Funken, Stahl und Stolz",
    items: [
      { user: "Ralf_Bau",       text: "Genau das ist Handwerk. Respekt! 🙏" },
      { user: "content_lover",  text: "Wer filmt das eigentlich? Wirklich tolle Qualität." },
      { user: "regional_FR",    text: "Dieser Content zeigt genau warum ich regional kaufe." },
      { user: "metallbau_fan",  text: "Einfach Klasse was ihr da macht" },
      { user: "anfrage_gesendet", text: "Anfrage gesendet — hoffe wir können zusammenarbeiten 🤝" },
      { user: "KMU_Freiburg",   text: "Teile ich gerne weiter — genau sowas braucht der Feed!" },
      { user: "stolz_local",    text: "Genau solche Betriebe braucht Freiburg und der Breisgau!" },
      { user: "Daniela_F",      text: "Habt ihr das Reel selbst produziert? Sieht professionell aus." },
      { user: "bau_süd",        text: "Solche Momente sollte man immer festhalten 🔥" },
      { user: "werk.regional",  text: "Stolz auf unsere Handwerker 💪" },
    ],
  },
];

const BUDGET = [
  { label: "Reichweiten-Kampagne",  budget: 120, reach: 7450, cpm: "€16.10", icon: "📡" },
  { label: "Story-Anzeigen",        budget: 100, reach: 12800, cpm: "€7.80", icon: "📱" },
  { label: "Follower-Kampagne",     budget: 80,  reach: 68,   cpm: "€1.18/Follower", icon: "👥" },
];

const NEXT_STEPS = [
  { prio: "Hoch",   text: "Kurzform-Reel unter 30 Sek. testen — Algorithmus bevorzugt das Format aktuell stark." },
  { prio: "Hoch",   text: "Marcel-Reihe fortführen: Top-Performer des Monats. Weitere Mitarbeiter vorstellen." },
  { prio: "Mittel", text: "Story-Sequenz ‚Hinter den Kulissen' ausbauen — hohes Engagement, geringes Produktionsaufwand." },
  { prio: "Mittel", text: "Werbebudget Mai auf €350 erhöhen — ROI der Reichweiten-Kampagne rechtfertigt das." },
  { prio: "Niedrig","text": "Erstes Post zum Thema Fachkräftemangel / Ausbildung planen — 3 Kommentare mit Bewerbungsinteresse." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function heatBg(v: number): string {
  if (v < 10) return "rgba(255,255,255,0.04)";
  if (v < 25) return "rgba(59,91,219,0.20)";
  if (v < 45) return "rgba(59,91,219,0.44)";
  if (v < 65) return "rgba(76,110,245,0.68)";
  if (v < 82) return "rgba(99,102,241,0.86)";
  return "rgba(168,85,247,0.96)";
}
function heatFg(v: number): string { return v > 38 ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.35)"; }

const MAX_REACH = Math.max(...REPORT_POSTS.map(p => p.reach));
const TOTAL = {
  reach:    REPORT_POSTS.reduce((s, p) => s + p.reach, 0),
  likes:    REPORT_POSTS.reduce((s, p) => s + p.likes, 0),
  comments: REPORT_POSTS.reduce((s, p) => s + p.comments, 0),
  shares:   REPORT_POSTS.reduce((s, p) => s + p.shares, 0),
  saves:    REPORT_POSTS.reduce((s, p) => s + p.saves, 0),
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <p style={{ color: "#4c6ef5", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>{label}</p>
      <h3 style={{ color: "#f0f0f5", fontSize: 20, fontWeight: 900, marginBottom: 20, lineHeight: 1.2 }}>{title}</h3>
      {children}
    </div>
  );
}

function KPI({ value, label, sub, accent = "#4c6ef5" }: { value: string; label: string; sub?: string; accent?: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px", flex: 1, minWidth: 130 }}>
      <div style={{ color: accent, fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{value}</div>
      <div style={{ color: "#f0f0f5", fontSize: 12, fontWeight: 700, marginTop: 6 }}>{label}</div>
      {sub && <div style={{ color: "#8888a8", fontSize: 10, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MonthlyReportModal({ onClose }: { onClose: () => void }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const w = window.open("", "_blank", "width=960,height=800");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html lang="de"><head>
<meta charset="UTF-8"/>
<title>Monatsbericht April 2026 – Metallbau Regional</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:system-ui,sans-serif;background:#fff;color:#1a1a2e;padding:32px;font-size:13px;}
  h1{font-size:26px;font-weight:900;margin-bottom:4px;}
  h2{font-size:16px;font-weight:800;margin:28px 0 12px;color:#3b5bdb;border-bottom:2px solid #e8eaf6;padding-bottom:6px;}
  h3{font-size:13px;font-weight:700;margin:16px 0 8px;}
  .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;}
  .kpi{border:1px solid #dde;border-radius:10px;padding:14px;text-align:center;}
  .kpi-val{font-size:26px;font-weight:900;color:#3b5bdb;}
  .kpi-lbl{font-size:11px;color:#555;margin-top:4px;}
  table{width:100%;border-collapse:collapse;margin-bottom:20px;font-size:11.5px;}
  th{background:#f0f2ff;color:#3b5bdb;font-weight:700;padding:8px 10px;text-align:left;border-bottom:2px solid #dde;}
  td{padding:7px 10px;border-bottom:1px solid #f0f0f0;vertical-align:middle;}
  tr:last-child td{border-bottom:none;}
  tr:nth-child(even) td{background:#fafafa;}
  .badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;}
  .heatmap-grid{display:grid;gap:3px;}
  .cell{border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;}
  .comment-block{background:#f8f9ff;border-left:3px solid #3b5bdb;border-radius:0 8px 8px 0;padding:10px 14px;margin-bottom:8px;}
  .comment-user{font-weight:700;color:#3b5bdb;font-size:11px;}
  .comment-text{font-size:12px;color:#333;margin-top:3px;}
  .budget-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f0f0f0;}
  .bar{height:8px;border-radius:4px;background:linear-gradient(90deg,#3b5bdb,#6366f1);}
  .next-item{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #f0f0f0;}
  .prio-high{color:#ef4444;font-weight:700;font-size:10px;white-space:nowrap;}
  .prio-mid{color:#f59e0b;font-weight:700;font-size:10px;white-space:nowrap;}
  .prio-low{color:#10b981;font-weight:700;font-size:10px;white-space:nowrap;}
  .footer{margin-top:32px;padding-top:12px;border-top:1px solid #dde;color:#999;font-size:10px;display:flex;justify-content:space-between;}
  @media print{body{padding:16px;font-size:11px;}}
</style>
</head><body>
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;">
  <div>
    <div style="color:#3b5bdb;font-size:11px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:4px;">contentstudio · Freiburg im Breisgau</div>
    <h1>Monatsbericht April 2026</h1>
    <div style="color:#555;font-size:13px;margin-top:4px;">Metallbau Regional · Freiburg im Breisgau · Zeitraum: 01.04. – 30.04.2026</div>
  </div>
  <div style="text-align:right;font-size:11px;color:#999;">Erstellt: 30.04.2026<br/>Vertraulich</div>
</div>

<h2>Kernzahlen April</h2>
<div class="grid4">
  <div class="kpi"><div class="kpi-val">18.200</div><div class="kpi-lbl">Personen erreicht</div></div>
  <div class="kpi"><div class="kpi-val">+127</div><div class="kpi-lbl">Neue Follower</div></div>
  <div class="kpi"><div class="kpi-val">1.478</div><div class="kpi-lbl">Likes gesamt</div></div>
  <div class="kpi"><div class="kpi-val">14</div><div class="kpi-lbl">Direktanfragen</div></div>
</div>
<div class="grid4">
  <div class="kpi"><div class="kpi-val">12</div><div class="kpi-lbl">Posts veröffentlicht</div></div>
  <div class="kpi"><div class="kpi-val">552</div><div class="kpi-lbl">Saves</div></div>
  <div class="kpi"><div class="kpi-val">304</div><div class="kpi-lbl">Shares</div></div>
  <div class="kpi"><div class="kpi-val">108</div><div class="kpi-lbl">Kommentare (Ø 9/Post)</div></div>
</div>

<h2>Post-Performance April 2026</h2>
<table>
<thead><tr><th>Datum</th><th>Post</th><th>Format</th><th>Reichweite</th><th>Likes</th><th>Komm.</th><th>Shares</th><th>Saves</th></tr></thead>
<tbody>
${REPORT_POSTS.map(p => `<tr><td>${p.date}</td><td>${p.title}</td><td><span class="badge" style="background:#e8eaf6;color:#3b5bdb;">${p.type}</span></td><td><strong>${p.reach.toLocaleString("de")}</strong></td><td>${p.likes}</td><td>${p.comments}</td><td>${p.shares}</td><td>${p.saves}</td></tr>`).join("")}
<tr style="font-weight:700;background:#f0f2ff;"><td colspan="3">Gesamt</td><td>${TOTAL.reach.toLocaleString("de")}</td><td>${TOTAL.likes}</td><td>${TOTAL.comments}</td><td>${TOTAL.shares}</td><td>${TOTAL.saves}</td></tr>
</tbody>
</table>

<h2>Tageszeit-Analyse (Interaktionen nach Uhrzeit)</h2>
<p style="color:#555;font-size:11px;margin-bottom:12px;">Heatmap zeigt relative Engagement-Intensität (0 = gering, 100 = sehr hoch). Abendszeiten und Wochenenden deutlich stärker.</p>
<div style="overflow-x:auto;">
<table style="width:auto;min-width:500px;font-size:10px;">
<thead><tr><th style="width:40px;">Tag</th>${HEATMAP.times.map(t => `<th style="text-align:center;min-width:60px;">${t}</th>`).join("")}</tr></thead>
<tbody>
${HEATMAP.days.map((day, di) => `<tr><td style="font-weight:700;">${day}</td>${HEATMAP.values[di].map(v => `<td style="text-align:center;background:${v < 10 ? "#f5f5f5" : v < 25 ? "#c7d2fe" : v < 45 ? "#818cf8" : v < 65 ? "#4f46e5" : v < 82 ? "#3730a3" : "#7c3aed"};color:${v > 38 ? "white" : "#333"};padding:6px;border-radius:4px;">${v}</td>`).join("")}</tr>`).join("")}
</tbody>
</table>
</div>
<p style="color:#555;font-size:10px;margin-top:8px;">📌 Beste Zeiten: Fr–So 18:00–22:00 | Schwache Zeiten: Mo–Do vor 12:00</p>

<h2>Werbebudget April — €300 gesamt</h2>
${BUDGET.map(b => `<div class="budget-row">
  <div style="width:180px;font-weight:700;font-size:12px;">${b.label}</div>
  <div style="flex:1;"><div class="bar" style="width:${Math.round(b.budget/300*100)}%;"></div></div>
  <div style="width:50px;text-align:right;font-weight:700;">€${b.budget}</div>
  <div style="width:160px;text-align:right;color:#555;font-size:11px;">${b.label === "Follower-Kampagne" ? `+${b.reach} Follower · ${b.cpm}` : `${b.reach.toLocaleString("de")} Impressionen · ${b.cpm}`}</div>
</div>`).join("")}
<div style="margin-top:12px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
  <div class="kpi"><div class="kpi-val" style="font-size:20px;">€0.34</div><div class="kpi-lbl">Ø Kosten pro Klick</div></div>
  <div class="kpi"><div class="kpi-val" style="font-size:20px;">€15.40</div><div class="kpi-lbl">Ø CPM</div></div>
  <div class="kpi"><div class="kpi-val" style="font-size:20px;">€1.18</div><div class="kpi-lbl">Kosten / neuer Follower (Ads)</div></div>
</div>

<h2>Kommentare-Highlights (Auswahl)</h2>
${COMMENTS_HIGHLIGHTS.map(ch => `<h3>„${ch.post}"</h3>${ch.items.slice(0,5).map(c => `<div class="comment-block"><div class="comment-user">@${c.user}</div><div class="comment-text">${c.text}</div></div>`).join("")}`).join("")}

<h2>Empfehlungen für Mai</h2>
${NEXT_STEPS.map(n => `<div class="next-item"><span class="${n.prio === "Hoch" ? "prio-high" : n.prio === "Mittel" ? "prio-mid" : "prio-low"}">${n.prio}</span><span style="font-size:12px;">${n.text}</span></div>`).join("")}

<div class="footer">
  <span>contentstudio · Robin Obrechtle · robin@obrechtle.de · Freiburg im Breisgau</span>
  <span>Monatsbericht April 2026 · Metallbau Regional</span>
</div>
</body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 600);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(5,5,15,0.92)", backdropFilter: "blur(10px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        overflowY: "auto", padding: "24px 16px",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: "100%", maxWidth: 860,
        background: "#0d0d16",
        border: "1px solid rgba(59,91,219,0.35)",
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: "0 40px 100px rgba(0,0,0,0.9)",
        marginBottom: 24,
      }}>

        {/* ── Modal Header ── */}
        <div style={{
          background: "linear-gradient(135deg, rgba(59,91,219,0.2), rgba(99,102,241,0.08))",
          borderBottom: "1px solid rgba(59,91,219,0.25)",
          padding: "22px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ color: "#4c6ef5", fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>
              contentstudio · Monatsbericht
            </div>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 900, lineHeight: 1.1 }}>April 2026</h2>
            <p style={{ color: "#8888a8", fontSize: 12, marginTop: 4 }}>
              Metallbau Regional · Freiburg im Breisgau · 01.04. – 30.04.2026
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: "50%", border: "none",
              background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)",
              fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        {/* ── Report Content ── */}
        <div ref={printRef} style={{ padding: "28px 28px 0" }}>

          {/* KPIs */}
          <Section label="Kernzahlen" title="April auf einen Blick">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
              <KPI value="18.200" label="Personen erreicht" sub="+38% ggü. März" accent="#4c6ef5" />
              <KPI value="+127"   label="Neue Follower"     sub="Jetzt: 1.172 gesamt" accent="#10b981" />
              <KPI value="1.478"  label="Likes gesamt"      sub="Ø 123/Post" accent="#f59e0b" />
              <KPI value="14"     label="Direktanfragen"    sub="via Instagram DM" accent="#a855f7" />
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <KPI value="12"    label="Posts veröff."      sub="3× pro Woche" accent="#4c6ef5" />
              <KPI value="108"   label="Kommentare"         sub="Ø 9 pro Post" accent="#4c6ef5" />
              <KPI value="552"   label="Saves"              sub="↑ Hohes Interesse" accent="#4c6ef5" />
              <KPI value="304"   label="Shares"             sub="organische Weiterleitung" accent="#4c6ef5" />
            </div>
          </Section>

          {/* Follower growth bars */}
          <Section label="Wachstum" title="Follower-Entwicklung im April">
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 90, marginBottom: 8 }}>
              {WEEKLY_FOLLOWERS.map((w, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#f0f0f5", fontSize: 11, fontWeight: 800 }}>+{w.new}</span>
                  <div style={{
                    width: "100%", borderRadius: "6px 6px 0 0",
                    height: `${(w.new / 34) * 70}px`,
                    background: i === 1 || i === 3
                      ? "linear-gradient(to top, #3b5bdb, #6366f1)"
                      : "linear-gradient(to top, rgba(59,91,219,0.5), rgba(99,102,241,0.5))",
                  }} />
                  <span style={{ color: "#8888a8", fontSize: 10 }}>{w.week}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 6 }}>
              <span style={{ color: "#8888a8", fontSize: 11 }}>Startfollower 01.04.: <strong style={{ color: "#f0f0f5" }}>1.045</strong></span>
              <span style={{ color: "#8888a8", fontSize: 11 }}>Ende 30.04.: <strong style={{ color: "#10b981" }}>1.172</strong></span>
              <span style={{ color: "#8888a8", fontSize: 11 }}>Wachstum: <strong style={{ color: "#10b981" }}>+12,2 %</strong></span>
            </div>
          </Section>

          {/* Post table */}
          <Section label="Performance" title="Alle 12 Posts im Überblick">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {["Datum","Post","Format","Reichweite","Likes","Komm.","Shares","Saves"].map(h => (
                      <th key={h} style={{ color: "#4c6ef5", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 10px", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {REPORT_POSTS.map((p, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ color: "#8888a8", fontSize: 11, padding: "9px 10px", whiteSpace: "nowrap" }}>{p.date}</td>
                      <td style={{ padding: "9px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {/* Reach bar */}
                          <div style={{ width: 48, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", flexShrink: 0, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(p.reach / MAX_REACH) * 100}%`, background: "linear-gradient(90deg,#3b5bdb,#6366f1)", borderRadius: 2 }} />
                          </div>
                          <span style={{ color: "#e0e0f0", fontSize: 12, lineHeight: 1.3 }}>{p.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: "9px 10px" }}>
                        <span style={{
                          padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                          background: p.type === "Reel" ? "rgba(168,85,247,0.15)" : p.type === "Carousel" ? "rgba(59,91,219,0.15)" : "rgba(255,255,255,0.06)",
                          color: p.type === "Reel" ? "#a855f7" : p.type === "Carousel" ? "#6366f1" : "#a0a0b8",
                        }}>{p.type}</span>
                      </td>
                      <td style={{ color: "#f0f0f5", fontWeight: 700, fontSize: 13, padding: "9px 10px", whiteSpace: "nowrap" }}>{p.reach.toLocaleString("de")}</td>
                      <td style={{ color: "#a0a0b8", padding: "9px 10px" }}>{p.likes}</td>
                      <td style={{ color: "#a0a0b8", padding: "9px 10px" }}>{p.comments}</td>
                      <td style={{ color: "#a0a0b8", padding: "9px 10px" }}>{p.shares}</td>
                      <td style={{ color: "#a0a0b8", padding: "9px 10px" }}>{p.saves}</td>
                    </tr>
                  ))}
                  <tr style={{ background: "rgba(59,91,219,0.06)", borderTop: "1px solid rgba(59,91,219,0.2)" }}>
                    <td colSpan={3} style={{ color: "#4c6ef5", fontWeight: 800, fontSize: 11, padding: "10px 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Gesamt</td>
                    <td style={{ color: "#f0f0f5", fontWeight: 900, padding: "10px 10px" }}>{TOTAL.reach.toLocaleString("de")}</td>
                    <td style={{ color: "#f0f0f5", fontWeight: 700, padding: "10px 10px" }}>{TOTAL.likes}</td>
                    <td style={{ color: "#f0f0f5", fontWeight: 700, padding: "10px 10px" }}>{TOTAL.comments}</td>
                    <td style={{ color: "#f0f0f5", fontWeight: 700, padding: "10px 10px" }}>{TOTAL.shares}</td>
                    <td style={{ color: "#f0f0f5", fontWeight: 700, padding: "10px 10px" }}>{TOTAL.saves}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Heatmap */}
          <Section label="Tageszeit-Analyse" title="Wann ist euer Publikum aktiv?">
            <p style={{ color: "#8888a8", fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>
              Die Heatmap zeigt die relative Engagement-Intensität nach Wochentag und Uhrzeit.
              <strong style={{ color: "#f0f0f5" }}> Abendszeiten ab 18:00 Uhr</strong> und insbesondere
              <strong style={{ color: "#a855f7" }}> Samstag und Sonntag</strong> generieren deutlich mehr
              Interaktionen — genau dann schalten wir eure Beiträge und Ads aus.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "separate", borderSpacing: 3, fontSize: 11 }}>
                <thead>
                  <tr>
                    <th style={{ width: 36, color: "#8888a8", fontSize: 10, padding: "4px 8px", textAlign: "right" }} />
                    {HEATMAP.times.map(t => (
                      <th key={t} style={{ color: "#8888a8", fontSize: 10, fontWeight: 600, padding: "4px 6px", textAlign: "center", whiteSpace: "nowrap", minWidth: 58 }}>{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HEATMAP.days.map((day, di) => (
                    <tr key={day}>
                      <td style={{ color: "#a0a0b8", fontSize: 11, fontWeight: 700, padding: "4px 10px 4px 0", textAlign: "right", whiteSpace: "nowrap" }}>{day}</td>
                      {HEATMAP.values[di].map((v, ti) => (
                        <td key={ti} style={{
                          background: heatBg(v),
                          color: heatFg(v),
                          borderRadius: 6,
                          padding: "7px 4px",
                          textAlign: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          minWidth: 56,
                          transition: "transform 0.15s",
                          cursor: "default",
                        }}
                          title={`${day} ${HEATMAP.times[ti]}: ${v}/100`}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Legend */}
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 14, flexWrap: "wrap" }}>
              <span style={{ color: "#8888a8", fontSize: 10, marginRight: 4 }}>Intensität:</span>
              {[{v:8,l:"Gering"},{v:32,l:"Mittel"},{v:56,l:"Hoch"},{v:75,l:"Sehr hoch"},{v:93,l:"Peak"}].map(c => (
                <div key={c.l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 18, height: 14, borderRadius: 4, background: heatBg(c.v) }} />
                  <span style={{ color: "#8888a8", fontSize: 10 }}>{c.l}</span>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 14, padding: "10px 14px", borderRadius: 10,
              background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)",
            }}>
              <span style={{ color: "#c084fc", fontSize: 11, fontWeight: 700 }}>📌 Erkenntnis: </span>
              <span style={{ color: "#a0a0b8", fontSize: 11 }}>
                Sa/So 18:00–22:00 Uhr generieren bis zu <strong style={{ color: "#f0f0f5" }}>16× mehr Engagement</strong> als Mo–Do vor 12:00 Uhr.
                Wir timen alle Beiträge entsprechend — kostenlos, ohne Algorithmus-Tricks, nur durch richtiges Timing.
              </span>
            </div>
          </Section>

          {/* Budget */}
          <Section label="Werbebudget" title="€ 300 Einsatz — so wurde investiert">
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {BUDGET.map((b, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12, padding: "12px 16px",
                }}>
                  <div style={{ fontSize: 20, flexShrink: 0 }}>{b.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#f0f0f5", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{b.label}</div>
                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 3, height: 5, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(b.budget / 300) * 100}%`, background: "linear-gradient(90deg,#3b5bdb,#6366f1)", borderRadius: 3 }} />
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ color: "#f0f0f5", fontWeight: 900, fontSize: 16 }}>€{b.budget}</div>
                    <div style={{ color: "#8888a8", fontSize: 10, marginTop: 2 }}>
                      {b.label === "Follower-Kampagne"
                        ? `+${b.reach} Follower · ${b.cpm}`
                        : `${b.reach.toLocaleString("de")} Impressionen · Ø ${b.cpm}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { v: "€0.34", l: "Ø Kosten/Klick" },
                { v: "€15.40", l: "Ø CPM" },
                { v: "€1.18", l: "Kosten/neuer Follower (Ads)" },
                { v: "€21.43", l: "Kosten/Direktanfrage (geschätzt)" },
              ].map((m, i) => (
                <KPI key={i} value={m.v} label={m.l} accent="#6366f1" />
              ))}
            </div>
          </Section>

          {/* Comments highlights */}
          <Section label="Kommentare" title="Was euer Publikum sagt">
            {COMMENTS_HIGHLIGHTS.map((ch, ci) => (
              <div key={ci} style={{ marginBottom: 22 }}>
                <div style={{
                  color: "#f0f0f5", fontSize: 12, fontWeight: 700,
                  borderLeft: "3px solid #4c6ef5", paddingLeft: 10,
                  marginBottom: 10, lineHeight: 1.4,
                }}>
                  „{ch.post}"
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {ch.items.map((c, i) => (
                    <div key={i} style={{
                      background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 10, padding: "9px 12px",
                    }}>
                      <div style={{ color: "#4c6ef5", fontSize: 10, fontWeight: 800, marginBottom: 3 }}>@{c.user}</div>
                      <div style={{ color: "#c0c0d0", fontSize: 11, lineHeight: 1.45 }}>{c.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Section>

          {/* Next steps */}
          <Section label="Ausblick" title="Empfehlungen für Mai 2026">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {NEXT_STEPS.map((n, i) => {
                const prioColor = n.prio === "Hoch" ? "#ef4444" : n.prio === "Mittel" ? "#f59e0b" : "#10b981";
                const prioBg    = n.prio === "Hoch" ? "rgba(239,68,68,0.08)" : n.prio === "Mittel" ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)";
                return (
                  <div key={i} style={{
                    display: "flex", gap: 12, alignItems: "flex-start",
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10, padding: "11px 14px",
                  }}>
                    <span style={{
                      background: prioBg, color: prioColor,
                      fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
                      padding: "3px 8px", borderRadius: 20, flexShrink: 0, marginTop: 1,
                    }}>{n.prio}</span>
                    <span style={{ color: "#b0b0c8", fontSize: 12, lineHeight: 1.5 }}>{n.text}</span>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Footer line */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "16px 0",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: 4,
          }}>
            <span style={{ color: "#555568", fontSize: 11 }}>contentstudio · Robin Obrechtle · robin@obrechtle.de</span>
            <span style={{ color: "#555568", fontSize: 11 }}>Monatsbericht April 2026 · Vertraulich</span>
          </div>
        </div>

        {/* ── Download Bar ── */}
        <div style={{
          padding: "16px 28px",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ color: "#8888a8", fontSize: 12 }}>
            📄 Dieser Report wird euch monatlich nach dem gleichen Schema geliefert.
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: "9px 20px", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent", color: "rgba(255,255,255,0.6)",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              Schließen
            </button>
            <button
              onClick={handleDownload}
              style={{
                padding: "9px 22px", borderRadius: 10,
                background: "linear-gradient(135deg,#3b5bdb,#6366f1)",
                border: "none", color: "#fff",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 4px 20px rgba(59,91,219,0.45)",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Als PDF speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
