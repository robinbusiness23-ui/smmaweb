"use client";

import React, {
  createContext, useContext, useState, useRef, useEffect, useCallback,
} from "react";

// ─── Stable element ID ────────────────────────────────────────────────────────

function stableId(el: HTMLElement): string {
  const tag  = el.tagName.toLowerCase();
  const text = (el.textContent || "").trim().slice(0, 22)
    .replace(/\s+/g, "_").replace(/[^\w_äöüÄÖÜß]/g, "");
  const parent = el.parentElement;
  const idx    = parent ? Array.from(parent.children).indexOf(el) : 0;
  return `ae_${tag}_${text}_${idx}`.slice(0, 72);
}

// Tags whose direct text content we should make editable
const AUTO_TAGS = new Set(["H1","H2","H3","H4","H5","H6","P","LI","BLOCKQUOTE","DT","DD"]);
// Tags to never touch
const SKIP_TAGS = new Set(["SCRIPT","STYLE","NOSCRIPT","INPUT","TEXTAREA","SELECT","BUTTON","SVG","IMG","CANVAS","VIDEO","AUDIO"]);

function shouldAutoEdit(el: HTMLElement): boolean {
  if (SKIP_TAGS.has(el.tagName)) return false;
  if (el.closest("nav, [data-editor-skip]")) return false;
  if (el.dataset.eid) return false; // explicit — handled separately
  if (!el.textContent?.trim()) return false;
  if (AUTO_TAGS.has(el.tagName)) return true;
  // Leaf SPAN or A with no block children
  if (el.tagName === "SPAN" || el.tagName === "A") {
    const hasBlockChild = Array.from(el.children).some(c =>
      ["DIV","P","H1","H2","H3","SECTION","ARTICLE","HEADER","FOOTER","UL","OL"].includes(c.tagName)
    );
    return !hasBlockChild;
  }
  return false;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ToolbarPos { x: number; y: number }
interface DragPos    { x: number; y: number }

interface EditorCtx {
  editorMode:  boolean;
  focusedEid:  string | null;
  focusedEl:   HTMLElement | null;
  toolbarPos:  ToolbarPos;
  applyStyle:  (prop: string, value: string) => void;
  dragPositions: Record<string, DragPos>;
  setDragPos:  (did: string, pos: DragPos) => void;
  imageSrcs:   Record<string, string>;
  setImageSrc: (eid: string, src: string) => void;
  save:        () => void;
  cancel:      () => void;
  resetAll:    () => void;
}

const Ctx = createContext<EditorCtx | null>(null);
export const useEditor = () => useContext(Ctx)!;

const STORAGE_KEY = "cs-editor-v3";

function loadSaved(): Record<string, unknown> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}

function restoreFromSaved(data: Record<string, unknown>) {
  const texts = (data.texts || {}) as Record<string, string>;
  const styles = (data.elemStyles || {}) as Record<string, Record<string, string>>;
  const imgs   = (data.imageSrcs || {}) as Record<string, string>;

  Object.entries(texts).forEach(([eid, html]) => {
    const el = document.querySelector<HTMLElement>(`[data-eid="${eid}"], [data-auto-eid="${eid}"]`);
    if (el) el.innerHTML = html;
  });
  Object.entries(styles).forEach(([eid, s]) => {
    const el = document.querySelector<HTMLElement>(`[data-eid="${eid}"], [data-auto-eid="${eid}"]`);
    if (el) Object.assign(el.style, s);
  });
  Object.entries(imgs).forEach(([eid, src]) => {
    const el = document.querySelector<HTMLImageElement>(`[data-imgeid="${eid}"]`);
    if (el) el.src = src;
  });
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function EditorProvider({
  children, active, onSave, onCancel,
}: {
  children: React.ReactNode;
  active: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [focusedEid,  setFocusedEid]  = useState<string | null>(null);
  const [focusedEl,   setFocusedEl]   = useState<HTMLElement | null>(null);
  const [toolbarPos,  setToolbarPos]  = useState<ToolbarPos>({ x: 0, y: 0 });
  const [dragPositions, setDragPositions] = useState<Record<string, DragPos>>({});
  const [imageSrcs,   setImageSrcsState]  = useState<Record<string, string>>({});

  // ── DOM scan: make all text elements editable ──
  useEffect(() => {
    if (active) {
      document.body.classList.add("cs-editor");

      // Auto-scan entire DOM
      document.querySelectorAll<HTMLElement>("*").forEach(el => {
        if (!shouldAutoEdit(el)) return;
        if (!el.dataset.autoEid) el.dataset.autoEid = stableId(el);
        el.contentEditable = "true";
      });
      // Also activate explicit data-eid elements
      document.querySelectorAll<HTMLElement>("[data-eid]").forEach(el => {
        el.contentEditable = "true";
      });

      // Restore saved state after DOM is ready
      const data = loadSaved();
      restoreFromSaved(data);
      if (data.dragPositions) setDragPositions(data.dragPositions as Record<string, DragPos>);
      if (data.imageSrcs) setImageSrcsState(data.imageSrcs as Record<string, string>);
    } else {
      document.body.classList.remove("cs-editor");
      document.querySelectorAll<HTMLElement>("[data-eid], [data-auto-eid]").forEach(el => {
        el.contentEditable = "false";
      });
    }
  }, [active]);

  // Also restore image srcs on normal page load (non-editor)
  useEffect(() => {
    const data = loadSaved();
    if (data.imageSrcs) {
      setImageSrcsState(data.imageSrcs as Record<string, string>);
      Object.entries(data.imageSrcs as Record<string, string>).forEach(([eid, src]) => {
        const el = document.querySelector<HTMLImageElement>(`[data-imgeid="${eid}"]`);
        if (el) el.src = src;
      });
    }
    // Restore all saved content on normal load too
    restoreFromSaved(data);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Global focus tracking ──
  useEffect(() => {
    if (!active) return;
    const onFocusin = (e: FocusEvent) => {
      const t = e.target as HTMLElement;
      const eid = t.dataset.eid || t.dataset.autoEid;
      if (!eid) return;
      setFocusedEid(eid);
      setFocusedEl(t);
      const rect = t.getBoundingClientRect();
      setToolbarPos({
        x: Math.max(8, Math.min(rect.left, window.innerWidth - 550)),
        y: Math.max(56, rect.top - 62),
      });
    };
    const onMousedown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.dataset.eid && !t.dataset.autoEid && !t.closest("[data-editor-toolbar]")) {
        setFocusedEid(null);
        setFocusedEl(null);
      }
    };
    document.addEventListener("focusin", onFocusin);
    document.addEventListener("mousedown", onMousedown);
    return () => {
      document.removeEventListener("focusin", onFocusin);
      document.removeEventListener("mousedown", onMousedown);
    };
  }, [active]);

  const applyStyle = useCallback((prop: string, value: string) => {
    if (!focusedEl) return;
    (focusedEl.style as unknown as Record<string,string>)[prop] = value;
    focusedEl.focus();
  }, [focusedEl]);

  const setDragPos = useCallback((did: string, pos: DragPos) => {
    setDragPositions(prev => ({ ...prev, [did]: pos }));
  }, []);

  const setImageSrc = useCallback((eid: string, src: string) => {
    setImageSrcsState(prev => ({ ...prev, [eid]: src }));
    const el = document.querySelector<HTMLImageElement>(`[data-imgeid="${eid}"]`);
    if (el) el.src = src;
  }, []);

  const save = useCallback(() => {
    const texts: Record<string, string> = {};
    const elemStyles: Record<string, Record<string, string>> = {};
    document.querySelectorAll<HTMLElement>("[data-eid], [data-auto-eid]").forEach(el => {
      const eid = el.dataset.eid || el.dataset.autoEid!;
      texts[eid] = el.innerHTML;
      const s = el.style;
      const saved: Record<string, string> = {};
      (["color","fontSize","fontWeight","letterSpacing","fontStyle","textDecoration",
        "lineHeight","fontFamily","textAlign","textTransform"] as const).forEach(p => {
        if (s[p]) saved[p] = s[p];
      });
      if (Object.keys(saved).length) elemStyles[eid] = saved;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ texts, elemStyles, dragPositions, imageSrcs }));
    onSave();
  }, [dragPositions, imageSrcs, onSave]);

  const cancel = useCallback(() => {
    onCancel();
    window.location.reload();
  }, [onCancel]);

  const resetAll = useCallback(() => {
    if (!confirm("Alle Änderungen zurücksetzen? Das kann nicht rückgängig gemacht werden.")) return;
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }, []);

  return (
    <Ctx.Provider value={{
      editorMode: active,
      focusedEid, focusedEl, toolbarPos,
      applyStyle,
      dragPositions, setDragPos,
      imageSrcs, setImageSrc,
      save, cancel, resetAll,
    }}>
      {children}
    </Ctx.Provider>
  );
}

// ─── EditableText (kept for backwards-compat) ────────────────────────────────

export function EditableText({
  eid, as: Tag = "div", className, style, children,
}: {
  eid: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const { editorMode } = useEditor();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    try {
      const data = loadSaved();
      if ((data.texts as Record<string,string>)?.[eid]) ref.current.innerHTML = (data.texts as Record<string,string>)[eid];
      if ((data.elemStyles as Record<string,Record<string,string>>)?.[eid]) Object.assign(ref.current.style, (data.elemStyles as Record<string,Record<string,string>>)[eid]);
    } catch { /* noop */ }
  }, [eid]);

  return React.createElement(Tag, {
    ref,
    "data-eid": eid,
    className, style,
    contentEditable: editorMode ? true : undefined,
    suppressContentEditableWarning: true,
  }, children);
}

// ─── ImageSlot ────────────────────────────────────────────────────────────────

export function ImageSlot({
  eid,
  defaultSrc,
  alt = "",
  className,
  style,
  placeholder,
}: {
  eid: string;
  defaultSrc?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: React.ReactNode;
}) {
  const { editorMode, imageSrcs, setImageSrc } = useEditor();
  const fileRef = useRef<HTMLInputElement>(null);
  const resolved = imageSrcs[eid] || defaultSrc;
  const [hover, setHover] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImageSrc(eid, ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div
      data-imgeid={eid}
      className={className}
      style={{ position: "relative", ...style }}
      data-editor-skip
    >
      {resolved
        ? <img src={resolved} alt={alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit", display: "block" }}
            draggable={false} />
        : placeholder}

      {editorMode && (
        <div
          data-editor-skip
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => fileRef.current?.click()}
          style={{
            position: "absolute", inset: 0, borderRadius: "inherit",
            background: hover ? "rgba(59,91,219,0.72)" : "rgba(59,91,219,0.45)",
            border: "2px dashed rgba(99,102,241,0.9)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            cursor: "pointer", backdropFilter: "blur(3px)",
            transition: "background 0.2s",
          }}
        >
          <svg style={{ width: 28, height: 28, color: "#fff", marginBottom: 6 }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, textAlign: "center", lineHeight: 1.3 }}>
            {resolved ? "Foto ersetzen" : "Foto hochladen"}
          </span>
          {resolved && (
            <button
              data-editor-skip
              onClick={e => { e.stopPropagation(); setImageSrc(eid, ""); }}
              style={{
                marginTop: 6, fontSize: 10, color: "rgba(255,255,255,0.7)",
                background: "rgba(0,0,0,0.3)", border: "none", borderRadius: 4,
                padding: "2px 8px", cursor: "pointer",
              }}
            >
              Entfernen
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*"
            style={{ display: "none" }} onChange={handleFile} />
        </div>
      )}
    </div>
  );
}

// ─── DraggableLogo ───────────────────────────────────────────────────────────

export function DraggableLogo({
  did, children, className, style,
}: {
  did: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { editorMode, dragPositions, setDragPos } = useEditor();
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);
  const pos = dragPositions[did] ?? { x: 0, y: 0 };

  useEffect(() => {
    try {
      const data = loadSaved();
      const dp = (data.dragPositions as Record<string,DragPos>)?.[did];
      if (dp) setDragPos(did, dp);
    } catch { /* noop */ }
  }, [did, setDragPos]);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => {
      if (!startRef.current) return;
      setDragPos(did, {
        x: startRef.current.ox + e.clientX - startRef.current.mx,
        y: startRef.current.oy + e.clientY - startRef.current.my,
      });
    };
    const up = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [dragging, did, setDragPos]);

  return (
    <div
      data-editor-skip
      className={className}
      style={{
        ...style,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        cursor: editorMode ? (dragging ? "grabbing" : "grab") : undefined,
        userSelect: "none",
        transition: dragging ? "none" : undefined,
        ...(editorMode ? {
          outline: "2px dashed rgba(76,110,245,0.5)",
          outlineOffset: "10px",
          borderRadius: "50%",
        } : {}),
      }}
      onMouseDown={e => {
        if (!editorMode) return;
        e.preventDefault();
        setDragging(true);
        startRef.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y };
      }}
    >
      {editorMode && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#4c6ef5] whitespace-nowrap pointer-events-none"
          style={{ background: "#1e1e28", border: "1px solid rgba(76,110,245,0.4)", padding: "2px 8px", borderRadius: "20px" }}>
          ✥ Ziehen
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Floating Toolbar ─────────────────────────────────────────────────────────

const COLORS = [
  { v: "#ffffff",   l: "Weiß" },
  { v: "#f0f0f5",   l: "Hell" },
  { v: "#a5b4fc",   l: "Lavender" },
  { v: "#4c6ef5",   l: "Blau" },
  { v: "#a0a0b8",   l: "Grau" },
  { v: "#8888a8",   l: "Dunkelgrau" },
  { v: "#E2001A",   l: "SCF Rot" },
  { v: "#f59e0b",   l: "Amber" },
  { v: "#10b981",   l: "Grün" },
  { v: "#ec4899",   l: "Pink" },
];

const FONTS = [
  { label: "Standard",   value: "" },
  { label: "Sans",       value: "ui-sans-serif, system-ui, sans-serif" },
  { label: "Serif",      value: "Georgia, 'Times New Roman', serif" },
  { label: "Mono",       value: "'Courier New', Consolas, monospace" },
  { label: "Impact",     value: "Impact, 'Arial Narrow', sans-serif" },
  { label: "Playfair",   value: "'Playfair Display', Georgia, serif" },
  { label: "Bebas",      value: "'Bebas Neue', Impact, sans-serif" },
];

const SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72, 96];

function Btn({ onClick, title, children, active }: {
  onClick: () => void; title: string; children: React.ReactNode; active?: boolean;
}) {
  return (
    <button
      data-editor-skip
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      style={{
        padding: "4px 8px", borderRadius: 8, fontSize: 12, fontWeight: 700,
        color: active ? "#fff" : "rgba(255,255,255,0.65)",
        background: active ? "rgba(76,110,245,0.45)" : "transparent",
        border: "none", cursor: "pointer", whiteSpace: "nowrap",
        transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", margin: "0 2px", flexShrink: 0 }} />;
}

export function FloatingToolbar() {
  const { editorMode, focusedEid, focusedEl, toolbarPos, applyStyle } = useEditor();
  const [fontOpen, setFontOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);

  const get = () => focusedEl ? window.getComputedStyle(focusedEl) : null;

  const adjustSize = (delta: number) => {
    const cs = get(); if (!cs) return;
    const cur = parseFloat(cs.fontSize) || 16;
    applyStyle("fontSize", `${Math.max(8, Math.min(120, cur + delta))}px`);
  };

  const setExactSize = (px: number) => {
    applyStyle("fontSize", `${px}px`);
    setSizeOpen(false);
  };

  const toggleWeight = () => {
    const cs = get(); if (!cs) return;
    applyStyle("fontWeight", parseInt(cs.fontWeight) >= 700 ? "400" : "900");
  };

  const toggleItalic = () => {
    const cs = get(); if (!cs) return;
    applyStyle("fontStyle", cs.fontStyle === "italic" ? "normal" : "italic");
  };

  const toggleUnderline = () => {
    const cs = get(); if (!cs) return;
    applyStyle("textDecoration", cs.textDecoration.includes("underline") ? "none" : "underline");
  };

  const toggleUppercase = () => {
    const cs = get(); if (!cs) return;
    applyStyle("textTransform", cs.textTransform === "uppercase" ? "none" : "uppercase");
  };

  const setAlign = (align: string) => applyStyle("textAlign", align);

  const adjustTracking = (delta: number) => {
    const cs = get(); if (!cs) return;
    const cur = parseFloat(cs.letterSpacing) || 0;
    applyStyle("letterSpacing", `${(cur + delta).toFixed(2)}px`);
  };

  const adjustLineH = (delta: number) => {
    const cs = get(); if (!cs) return;
    const lh = parseFloat(cs.lineHeight) || 24;
    const fs = parseFloat(cs.fontSize) || 16;
    applyStyle("lineHeight", `${Math.max(0.8, Math.min(3, lh/fs + delta)).toFixed(2)}`);
  };

  const setFont = (value: string) => {
    applyStyle("fontFamily", value);
    setFontOpen(false);
  };

  if (!editorMode || !focusedEid) return null;

  const cs = get();
  const isBold      = cs ? parseInt(cs.fontWeight) >= 700 : false;
  const isItalic    = cs ? cs.fontStyle === "italic" : false;
  const isUnderline = cs ? cs.textDecoration.includes("underline") : false;
  const isUpper     = cs ? cs.textTransform === "uppercase" : false;
  const curAlign    = cs ? cs.textAlign : "left";
  const curFont     = focusedEl?.style.fontFamily || "";
  const curSizePx   = cs ? Math.round(parseFloat(cs.fontSize)) : 16;

  return (
    <div
      data-editor-toolbar
      data-editor-skip
      style={{
        position: "fixed",
        top: toolbarPos.y,
        left: toolbarPos.x,
        zIndex: 9999,
        background: "#0f0f1a",
        border: "1px solid rgba(76,110,245,0.5)",
        borderRadius: 16,
        padding: "5px 8px",
        display: "flex",
        alignItems: "center",
        gap: 2,
        boxShadow: "0 16px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04)",
        flexWrap: "wrap",
        maxWidth: 560,
        pointerEvents: "all",
        userSelect: "none",
      }}
      onMouseDown={e => e.preventDefault()}
    >
      {/* ── Font family ── */}
      <div style={{ position: "relative" }} data-editor-skip>
        <button
          data-editor-skip
          onMouseDown={e => { e.preventDefault(); setFontOpen(o => !o); setSizeOpen(false); }}
          style={{
            padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
            color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
            whiteSpace: "nowrap", minWidth: 76,
          }}
        >
          {FONTS.find(f => f.value === curFont)?.label || "Schrift"} ▾
        </button>
        {fontOpen && (
          <div data-editor-skip style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0,
            background: "#141422", border: "1px solid rgba(76,110,245,0.4)",
            borderRadius: 12, overflow: "hidden", zIndex: 10000, minWidth: 140,
            boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
          }}>
            {FONTS.map(f => (
              <button
                key={f.value}
                data-editor-skip
                onMouseDown={e => { e.preventDefault(); setFont(f.value); }}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "8px 14px", fontSize: 12, fontFamily: f.value || "inherit",
                  color: curFont === f.value ? "#a5b4fc" : "rgba(255,255,255,0.75)",
                  background: curFont === f.value ? "rgba(76,110,245,0.15)" : "transparent",
                  border: "none", cursor: "pointer", fontWeight: 600,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Font size ── */}
      <div style={{ position: "relative" }} data-editor-skip>
        <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Btn onClick={() => adjustSize(-2)} title="Kleiner">A−</Btn>
          <button
            data-editor-skip
            onMouseDown={e => { e.preventDefault(); setSizeOpen(o => !o); setFontOpen(false); }}
            style={{
              padding: "4px 7px", borderRadius: 6, fontSize: 11, fontWeight: 700,
              color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", minWidth: 36,
            }}
          >
            {curSizePx}
          </button>
          <Btn onClick={() => adjustSize(2)} title="Größer">A+</Btn>
        </div>
        {sizeOpen && (
          <div data-editor-skip style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0,
            background: "#141422", border: "1px solid rgba(76,110,245,0.4)",
            borderRadius: 12, padding: 6, zIndex: 10000, display: "flex", flexWrap: "wrap",
            gap: 4, width: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
          }}>
            {SIZES.map(s => (
              <button
                key={s}
                data-editor-skip
                onMouseDown={e => { e.preventDefault(); setExactSize(s); }}
                style={{
                  padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                  color: curSizePx === s ? "#a5b4fc" : "rgba(255,255,255,0.65)",
                  background: curSizePx === s ? "rgba(76,110,245,0.2)" : "rgba(255,255,255,0.04)",
                  border: "none", cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <Divider />

      {/* ── Style ── */}
      <Btn onClick={toggleWeight}    title="Fett"      active={isBold}>      <strong>B</strong></Btn>
      <Btn onClick={toggleItalic}    title="Kursiv"    active={isItalic}>    <em>I</em></Btn>
      <Btn onClick={toggleUnderline} title="Unterstrichen" active={isUnderline}><u>U</u></Btn>
      <Btn onClick={toggleUppercase} title="Großbuchstaben" active={isUpper}>AA</Btn>

      <Divider />

      {/* ── Alignment ── */}
      <Btn onClick={() => setAlign("left")}    title="Links"   active={curAlign === "left"}>   ≡L</Btn>
      <Btn onClick={() => setAlign("center")}  title="Mitte"   active={curAlign === "center"}> ≡C</Btn>
      <Btn onClick={() => setAlign("right")}   title="Rechts"  active={curAlign === "right"}>  ≡R</Btn>

      <Divider />

      {/* ── Spacing ── */}
      <Btn onClick={() => adjustTracking( 0.5)} title="Buchstabenabstand +">LS+</Btn>
      <Btn onClick={() => adjustTracking(-0.5)} title="Buchstabenabstand −">LS−</Btn>
      <Btn onClick={() => adjustLineH( 0.1)}    title="Zeilenabstand +">↕+</Btn>
      <Btn onClick={() => adjustLineH(-0.1)}    title="Zeilenabstand −">↕−</Btn>

      <Divider />

      {/* ── Colors ── */}
      {COLORS.map(c => (
        <button
          key={c.v}
          data-editor-skip
          title={c.l}
          onMouseDown={e => { e.preventDefault(); applyStyle("color", c.v); }}
          style={{
            width: 17, height: 17, borderRadius: "50%",
            background: c.v, border: "2px solid rgba(255,255,255,0.18)",
            cursor: "pointer", flexShrink: 0, padding: 0,
          }}
        />
      ))}
      {/* Custom color picker */}
      <div title="Eigene Farbe" style={{ position: "relative", width: 20, height: 20 }} data-editor-skip>
        <div style={{
          width: 17, height: 17, borderRadius: "50%",
          background: "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)",
          border: "2px solid rgba(255,255,255,0.18)",
        }} />
        <input type="color" data-editor-skip
          style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
          onInput={e => applyStyle("color", (e.target as HTMLInputElement).value)} />
      </div>
    </div>
  );
}

// ─── EditorTopBar ─────────────────────────────────────────────────────────────

export function EditorTopBar() {
  const { editorMode, save, cancel, resetAll } = useEditor();
  if (!editorMode) return null;

  return (
    <div
      data-editor-skip
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9998,
        background: "linear-gradient(135deg,#1e2a58,#2d1f5e)",
        borderBottom: "1px solid rgba(99,102,241,0.4)",
        boxShadow: "0 4px 30px rgba(59,91,219,0.5)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "9px 20px", gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.7)" }} />
          <span style={{ color: "white", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em" }}>
            Editor Modus
          </span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>|</span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
          Klick auf jeden Text zum Bearbeiten · Bilder per Klick hochladen · Logo verschieben
        </span>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          data-editor-skip
          onClick={resetAll}
          style={{
            padding: "5px 14px", borderRadius: 9, border: "1px solid rgba(239,68,68,0.3)",
            cursor: "pointer", background: "rgba(239,68,68,0.08)",
            color: "rgba(239,68,68,0.7)", fontSize: 12, fontWeight: 600,
          }}
        >
          Zurücksetzen
        </button>
        <button
          data-editor-skip
          onClick={cancel}
          style={{
            padding: "5px 16px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.12)",
            cursor: "pointer", background: "rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600,
          }}
        >
          Abbrechen
        </button>
        <button
          data-editor-skip
          onClick={save}
          style={{
            padding: "5px 20px", borderRadius: 9,
            border: "1px solid rgba(99,102,241,0.6)",
            cursor: "pointer",
            background: "linear-gradient(135deg,rgba(59,91,219,0.7),rgba(99,102,241,0.6))",
            color: "white", fontSize: 12, fontWeight: 700,
            boxShadow: "0 2px 12px rgba(59,91,219,0.4)",
          }}
        >
          ✓ Speichern
        </button>
      </div>
    </div>
  );
}
