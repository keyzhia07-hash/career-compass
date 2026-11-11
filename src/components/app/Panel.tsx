// Petits composants de panneau partagés par l'éditeur de CV et de lettre.
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

export function Fold({ title, children, open: o = false }: { title: string; children: ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(o);
  return (
    <div className="rounded-xl border bg-card">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold">{title}<ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} /></button>
      {open && <div className="space-y-3 border-t px-4 py-3">{children}</div>}
    </div>
  );
}
export function Range({ label, value, min, max, step = 1, unit = "", onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void }) {
  return (
    <label className="block text-sm"><div className="mb-1 flex justify-between"><span>{label}</span><span className="text-muted-foreground">{value}{unit}</span></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-primary" /></label>
  );
}
export function Seg<T extends string>({ value, options, onChange }: { value: T; options: { v: T; l: ReactNode }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl bg-muted p-1">
      {options.map((o) => <button key={o.v} onClick={() => onChange(o.v)} className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium ${value === o.v ? "bg-card shadow-soft" : "text-muted-foreground"}`}>{o.l}</button>)}
    </div>
  );
}
export function AiPanel({ kind }: { kind: "CV" | "lettre" }) {
  const [loading, setLoading] = useState(false);
  const run = () => { setLoading(true); setTimeout(() => setLoading(false), 1600); };
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-primary-soft p-3 text-sm text-accent-foreground">Collez le lien ou le texte d'une offre : l'IA adapte votre {kind}.</div>
      <textarea placeholder="Lien de l'annonce ou texte complet de l'offre…" className="h-28 w-full rounded-xl border bg-card p-3 text-sm" />
      <div className="grid grid-cols-3 gap-2">
        {["Offre ciblée", "Pré-remplir", "Score ATS"].map((b) => <button key={b} onClick={run} className="rounded-xl bg-gradient-primary px-2 py-2 text-xs font-semibold text-primary-foreground">{b}</button>)}
      </div>
      {loading && <div className="flex items-center gap-2 rounded-xl border p-3 text-sm"><span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />Génération en cours…</div>}
      <Fold title="Reformulation locale (gratuite)">
        <p className="text-xs text-muted-foreground">Fonctionne dans votre navigateur, sans IA et sans consommer de requêtes.</p>
        <button className="w-full rounded-lg border px-3 py-2 text-sm">Reformuler la sélection</button>
      </Fold>
      <Fold title="Améliorations proposées">
        {["Ajouter un chiffre à « Pilote un portefeuille… »", "Ajouter le mot-clé « Roadmap »", "Raccourcir le profil (3 lignes max.)"].map((p) => (
          <div key={p} className="rounded-lg border p-2 text-sm">{p}<div className="mt-2 flex gap-2"><button className="rounded-md bg-success px-2 py-1 text-xs text-primary-foreground">Ajouter</button><button className="rounded-md border px-2 py-1 text-xs">Ignorer</button></div></div>
        ))}
      </Fold>
    </div>
  );
}
