import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowLeftRight, ArrowUp, Copy, Download, Eye, EyeOff, FileText, GripVertical, Image as ImageIcon, LayoutList, Palette, Plus, Redo2, Sparkles, Trash2, Undo2, Type, ZoomIn, ZoomOut } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { CvPreview } from "@/components/app/CvPreview";
import { FONTS, INITIAL, PALETTES, SECTION_LIBRARY, useHistory, type Align, type Bullet, type CvState, type Section } from "@/components/app/editor-state";
import { AiPanel, Fold, Range, Seg } from "@/components/app/Panel";
import { SelectionToolbar } from "@/components/app/SelectionToolbar";

export const Route = createFileRoute("/editeur")({
  head: () => ({ meta: [
    { title: "Éditeur de CV — Colombine CV Studio" },
    { name: "description", content: "Modifiez votre CV avec un aperçu en direct, rubrique par rubrique." },
    { property: "og:title", content: "Éditeur de CV — Colombine CV Studio" },
    { property: "og:description", content: "Modifiez votre CV avec un aperçu en direct, rubrique par rubrique." },
  ] }),
  component: Editor,
});

const TABS = [
  { id: "content", label: "Contenu", icon: FileText, cls: "bg-t-content", text: "text-t-content" },
  { id: "sections", label: "Rubriques", icon: LayoutList, cls: "bg-t-sections", text: "text-t-sections" },
  { id: "style", label: "Style", icon: Palette, cls: "bg-t-style", text: "text-t-style" },
  { id: "photo", label: "Photo", icon: ImageIcon, cls: "bg-t-photo", text: "text-t-photo" },
  { id: "ai", label: "IA", icon: Sparkles, cls: "bg-t-ai", text: "text-t-ai" },
] as const;
type Tab = (typeof TABS)[number]["id"];
const BULLETS: { v: Bullet; l: string }[] = [{ v: "disc", l: "•" }, { v: "square", l: "▪" }, { v: "dash", l: "–" }, { v: "arrow", l: "→" }, { v: "number", l: "1." }, { v: "none", l: "Aucune" }];
const ALIGNS: { v: Align; l: string }[] = [{ v: "left", l: "Gauche" }, { v: "center", l: "Centre" }, { v: "right", l: "Droite" }];

function Editor() {
  const h = useHistory<CvState>("cs-cv-draft", INITIAL);
  const cv = h.state;
  const [tab, setTab] = useState<Tab>("content");
  const [focus, setFocus] = useState<string>();
  const [zoom, setZoom] = useState(0.8);
  const [dragId, setDragId] = useState<string>();
  const previewRef = useRef<HTMLDivElement>(null);
  const set = <K extends keyof CvState>(k: K, v: CvState[K]) => h.update((s) => ({ ...s, [k]: v }));
  const setSec = (id: string, patch: Partial<Section>) => h.update((s) => ({ ...s, sections: s.sections.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  const move = (id: string, dir: -1 | 1) => h.update((s) => { const a = [...s.sections]; const i = a.findIndex((x) => x.id === id); const j = i + dir; if (j < 0 || j >= a.length) return s; [a[i], a[j]] = [a[j], a[i]]; return { ...s, sections: a }; });
  const dropOn = (target: string) => { if (!dragId || dragId === target) return; h.update((s) => { const a = [...s.sections]; const i = a.findIndex((x) => x.id === dragId), j = a.findIndex((x) => x.id === target); const [m] = a.splice(i, 1); a.splice(j, 0, { ...m, column: a[j > i ? j - 1 : j]?.column ?? m.column }); return { ...s, sections: a }; }); setDragId(undefined); };
  const dup = (id: string) => h.update((s) => { const i = s.sections.findIndex((x) => x.id === id); const a = [...s.sections]; a.splice(i + 1, 0, { ...a[i], id: Math.random().toString(36).slice(2), title: a[i].title + " (copie)" }); return { ...s, sections: a }; });
  const del = (id: string) => h.update((s) => ({ ...s, sections: s.sections.filter((x) => x.id !== id) }));
  const add = (title: string) => h.update((s) => ({ ...s, sections: [...s.sections, { id: Math.random().toString(36).slice(2), type: title, title, column: "main", hidden: false, items: ["Nouvel élément"], bullet: "dash", spacing: 14, align: "left" }] }));
  const focused = cv.sections.find((s) => s.id === focus);
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <div className="flex h-screen flex-col bg-muted">
      <header className="flex flex-wrap items-center gap-2 border-b bg-card px-4 py-2.5">
        <Link to="/documents" className="rounded-full p-2 hover:bg-muted" aria-label="Retour"><ArrowLeft className="h-5 w-5" /></Link>
        <input defaultValue="CV H. Nicolas" className="w-48 rounded-lg border bg-card px-3 py-1.5 font-medium" />
        <span className="text-xs text-muted-foreground">{h.saved === "ok" ? "✓ Enregistré" : "Enregistrement…"}</span>
        <button onClick={h.undo} disabled={!h.canUndo} className="rounded-lg p-2 hover:bg-muted disabled:opacity-30" aria-label="Annuler"><Undo2 className="h-4 w-4" /></button>
        <button onClick={h.redo} disabled={!h.canRedo} className="rounded-lg p-2 hover:bg-muted disabled:opacity-30" aria-label="Rétablir"><Redo2 className="h-4 w-4" /></button>
        <div className="mx-2 hidden items-center gap-1 rounded-lg border p-1 md:flex">
          <button onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))} className="rounded p-1 hover:bg-muted" aria-label="Zoom moins"><ZoomOut className="h-4 w-4" /></button>
          <span className="w-12 text-center text-xs">{Math.round(zoom * 100)} %</span>
          <button onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))} className="rounded p-1 hover:bg-muted" aria-label="Zoom plus"><ZoomIn className="h-4 w-4" /></button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <select defaultValue="fr" className="rounded-lg border bg-card px-2 py-1.5 text-sm"><option value="fr">🇫🇷 FR</option><option value="en">🇬🇧 EN</option><option value="es">🇪🇸 ES</option></select>
          <Link to="/ats" className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted">Analyser mon CV</Link>
          <button onClick={() => toast("Export Word ATS — à brancher")} className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted">Word</button>
          <button onClick={() => toast("Export PDF sans filigrane — à brancher")} className="flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground"><Download className="h-4 w-4" />PDF</button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col-reverse lg:flex-row">
        <aside className="flex min-h-0 w-full flex-col border-r bg-card lg:w-[380px]">
          <div className="grid grid-cols-5 gap-1 border-b p-2">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold transition ${tab === t.id ? `${t.cls} text-primary-foreground shadow-soft` : `${t.text} hover:bg-muted`}`}>
                <t.icon className="h-4 w-4" />{t.label}
              </button>
            ))}
          </div>
          <div className={`px-4 py-3 text-primary-foreground ${active.cls}`}><b>{active.label}</b></div>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {tab === "content" && <>
              <Fold title="En-tête" open>
                <label className="block text-sm">Nom<input value={cv.name} onChange={(e) => set("name", e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
                <label className="block text-sm">Titre<input value={cv.role} onChange={(e) => set("role", e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2" /></label>
                {cv.contact.map((c, i) => <input key={i} value={c} onChange={(e) => set("contact", cv.contact.map((x, j) => (j === i ? e.target.value : x)))} className="w-full rounded-lg border px-3 py-2 text-sm" />)}
                <div className="text-xs text-muted-foreground">Position des infos personnelles</div>
                <Seg value={cv.contactAlign} options={ALIGNS} onChange={(v) => set("contactAlign", v)} />
              </Fold>
              {cv.sections.map((s) => (
                <Fold key={s.id} title={s.title} open={focus === s.id}>
                  <input value={s.title} onChange={(e) => setSec(s.id, { title: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm font-semibold" />
                  <textarea value={s.items.join("\n")} onChange={(e) => setSec(s.id, { items: e.target.value.split("\n") })} rows={Math.min(8, s.items.length + 1)} className="w-full rounded-lg border p-3 text-sm" />
                  <p className="text-xs text-muted-foreground">Une ligne = un élément de liste.</p>
                </Fold>
              ))}
            </>}

            {tab === "sections" && <>
              <p className="text-xs text-muted-foreground">Glissez-déposez pour réorganiser, ou utilisez les flèches.</p>
              {(["main", "side"] as const).map((col) => (
                <div key={col}>
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-t-sections">{col === "main" ? "Colonne principale" : "Colonne latérale"}</div>
                  <div className="space-y-2">
                    {cv.sections.filter((s) => s.column === col).map((s) => (
                      <div key={s.id} draggable onDragStart={() => setDragId(s.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => dropOn(s.id)}
                        className={`rounded-xl border-l-4 border bg-card p-2 ${focus === s.id ? "border-l-t-sections ring-1 ring-t-sections" : "border-l-t-sections/40"}`} onClick={() => setFocus(s.id)}>
                        <div className="flex items-center gap-1">
                          <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
                          <span className={`flex-1 truncate text-sm ${s.hidden ? "text-muted-foreground line-through" : ""}`}>{s.title}</span>
                          <button onClick={() => move(s.id, -1)} className="rounded p-1 hover:bg-muted" aria-label="Monter"><ArrowUp className="h-3.5 w-3.5" /></button>
                          <button onClick={() => move(s.id, 1)} className="rounded p-1 hover:bg-muted" aria-label="Descendre"><ArrowDown className="h-3.5 w-3.5" /></button>
                          <button onClick={() => setSec(s.id, { column: s.column === "main" ? "side" : "main" })} className="rounded p-1 hover:bg-muted" aria-label="Gauche/droite"><ArrowLeftRight className="h-3.5 w-3.5" /></button>
                          <button onClick={() => setSec(s.id, { hidden: !s.hidden })} className="rounded p-1 hover:bg-muted" aria-label="Masquer">{s.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>
                          <button onClick={() => dup(s.id)} className="rounded p-1 hover:bg-muted" aria-label="Dupliquer"><Copy className="h-3.5 w-3.5" /></button>
                          <button onClick={() => del(s.id)} className="rounded p-1 text-danger hover:bg-danger-soft" aria-label="Supprimer"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {focused && (
                <Fold title={`Réglages : ${focused.title}`} open>
                  <div className="text-xs text-muted-foreground">Style de liste</div>
                  <Seg value={focused.bullet} options={BULLETS} onChange={(v) => setSec(focused.id, { bullet: v })} />
                  <div className="text-xs text-muted-foreground">Alignement</div>
                  <Seg value={focused.align} options={ALIGNS} onChange={(v) => setSec(focused.id, { align: v })} />
                  <Range label="Espacement après" value={focused.spacing} min={0} max={40} unit=" px" onChange={(v) => setSec(focused.id, { spacing: v })} />
                  <Range label="Taille du texte" value={focused.size ?? cv.size} min={7} max={14} step={0.5} unit=" pt" onChange={(v) => setSec(focused.id, { size: v })} />
                  <select value={focused.font ?? ""} onChange={(e) => setSec(focused.id, { font: e.target.value || undefined })} className="w-full rounded-lg border px-2 py-2 text-sm"><option value="">Police du CV</option>{FONTS.map((f) => <option key={f}>{f}</option>)}</select>
                  <label className="flex items-center justify-between text-sm">Couleur du texte<input type="color" value={focused.color ?? "#1f2330"} onChange={(e) => setSec(focused.id, { color: e.target.value })} /></label>
                  <button onClick={() => h.update((s) => ({ ...s, sections: s.sections.map((x) => ({ ...x, bullet: focused.bullet })) }))} className="w-full rounded-lg border px-3 py-2 text-xs">Appliquer cette puce à toutes les rubriques</button>
                </Fold>
              )}
              <Fold title="Ajouter une rubrique">
                <div className="grid grid-cols-2 gap-2">{SECTION_LIBRARY.map((t) => <button key={t} onClick={() => add(t)} className="flex items-center gap-1.5 rounded-lg border px-2 py-2 text-left text-xs hover:bg-muted"><Plus className="h-3.5 w-3.5 text-t-sections" />{t}</button>)}</div>
              </Fold>
            </>}

            {tab === "style" && <>
              <Fold title="Modèle" open>
                <div className="grid grid-cols-3 gap-2">
                  {([["colombine", "Colombine"], ["emeraude", "Botanique Émeraude"], ["classique", "Classique Raffiné"]] as const).map(([v, l]) => (
                    <button key={v} onClick={() => set("template", v)} className={`rounded-xl border p-2 text-xs ${cv.template === v ? "ring-2 ring-t-style" : ""}`}><div className="mb-1 aspect-[1/1.3] rounded bg-muted" />{l}</button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Le contenu est conservé quand vous changez de modèle.</p>
              </Fold>
              <Fold title="Couleurs" open>
                <div className="grid grid-cols-3 gap-2">
                  {PALETTES.map((p) => <button key={p.name} onClick={() => h.update((s) => ({ ...s, primary: p.primary, sideBg: p.side }))} className="rounded-xl border p-2 text-[11px]"><div className="mb-1 flex h-6 overflow-hidden rounded"><span className="flex-1" style={{ background: p.primary }} /><span className="flex-1" style={{ background: p.side }} /></div>{p.name}</button>)}
                </div>
                <label className="flex items-center justify-between text-sm">Couleur principale<input type="color" value={cv.primary} onChange={(e) => set("primary", e.target.value)} /></label>
                <label className="flex items-center justify-between text-sm">Fond de colonne<input type="color" value={cv.sideBg} onChange={(e) => set("sideBg", e.target.value)} /></label>
                <label className="flex items-center justify-between text-sm">Fond du CV<input type="color" value={cv.paper} onChange={(e) => set("paper", e.target.value)} /></label>
              </Fold>
              <Fold title="Texte" open>
                <select value={cv.font} onChange={(e) => set("font", e.target.value)} className="w-full rounded-lg border px-2 py-2 text-sm">{FONTS.map((f) => <option key={f}>{f}</option>)}</select>
                <Range label="Taille" value={cv.size} min={8} max={13} step={0.5} unit=" pt" onChange={(v) => set("size", v)} />
                <Range label="Interligne" value={cv.lineHeight} min={1} max={2} step={0.05} onChange={(v) => set("lineHeight", v)} />
                <Range label="Espace entre rubriques" value={cv.sectionGap} min={0} max={40} unit=" px" onChange={(v) => set("sectionGap", v)} />
              </Fold>
              <Fold title="Mise en page (avancé)">
                <Range label="Marge haute" value={cv.marginTop} min={0} max={90} unit=" px" onChange={(v) => set("marginTop", v)} />
                <Range label="Marge basse" value={cv.marginBottom} min={0} max={90} unit=" px" onChange={(v) => set("marginBottom", v)} />
                <label className="flex items-center justify-between text-sm">Adresse sur deux lignes<input type="checkbox" checked={cv.addressTwoLines} onChange={(e) => set("addressTwoLines", e.target.checked)} /></label>
                <Range label="Filigrane (site uniquement)" value={cv.watermark} min={0} max={0.2} step={0.01} onChange={(v) => set("watermark", v)} />
              </Fold>
            </>}

            {tab === "photo" && <>
              <label className="flex items-center justify-between rounded-xl border p-3 text-sm font-medium">Afficher la photo<input type="checkbox" checked={cv.photo.show} onChange={(e) => set("photo", { ...cv.photo, show: e.target.checked })} /></label>
              <div className="text-xs text-muted-foreground">Forme</div>
              <Seg value={cv.photo.shape} options={[{ v: "circle", l: "Rond" }, { v: "square", l: "Carré" }, { v: "rounded", l: "Arrondi" }, { v: "oval", l: "Ovale" }]} onChange={(v) => set("photo", { ...cv.photo, shape: v })} />
              <div className="text-xs text-muted-foreground">Position</div>
              <Seg value={cv.photo.position} options={ALIGNS.filter((a) => a.v !== "center")} onChange={(v) => set("photo", { ...cv.photo, position: v })} />
              <Range label="Taille" value={cv.photo.size} min={50} max={150} unit=" px" onChange={(v) => set("photo", { ...cv.photo, size: v })} />
              <Range label="Zoom / recadrage" value={cv.photo.zoom} min={1} max={2} step={0.05} onChange={(v) => set("photo", { ...cv.photo, zoom: v })} />
              <Range label="Bordure" value={cv.photo.border} min={0} max={8} unit=" px" onChange={(v) => set("photo", { ...cv.photo, border: v })} />
              <button className="w-full rounded-xl border border-dashed p-3 text-sm text-t-photo">Importer une photo</button>
            </>}

            {tab === "ai" && <AiPanel kind="CV" />}
          </div>
        </aside>

        <div ref={previewRef} className="min-h-0 flex-1 overflow-auto p-6" onClick={(e) => { if (e.target === e.currentTarget) setFocus(undefined); }}>
          <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full bg-card px-3 py-1 text-xs text-muted-foreground shadow-soft"><Type className="h-3.5 w-3.5" />Sélectionnez du texte pour le mettre en forme · cliquez une rubrique pour la régler</div>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
            <CvPreview cv={cv} focusId={focus} onFocus={(id) => { setFocus(id); if (tab !== "content") setTab("sections"); }} />
          </div>
        </div>
      </div>
      <SelectionToolbar container={previewRef} />
    </div>
  );
}
