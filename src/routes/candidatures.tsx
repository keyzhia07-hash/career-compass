import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, LayoutGrid, List, MapPin, Phone, Plus, RefreshCw, Search, Send, Star, Trash2, X } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { STATUSES, type AppStatus } from "@/lib/data";
import { removeApp, setStatus, useApplications } from "@/lib/store";

export const Route = createFileRoute("/candidatures")({
  head: () => ({ meta: [
    { title: "Mes candidatures — Colombine CV Studio" },
    { name: "description", content: "Suivez chaque offre, de « à postuler » jusqu'à la réponse." },
    { property: "og:title", content: "Mes candidatures — Colombine CV Studio" },
    { property: "og:description", content: "Suivez chaque offre, de « à postuler » jusqu'à la réponse." },
  ] }),
  component: Candidatures,
});

const ICONS = { todo: Star, applied: Send, interview: Phone, refused: X };
const TONE: Record<AppStatus, { bar: string; chip: string; icon: string }> = {
  todo: { bar: "border-t-primary", chip: "bg-primary-soft text-primary", icon: "bg-primary" },
  applied: { bar: "border-t-info", chip: "bg-info-soft text-info", icon: "bg-info" },
  interview: { bar: "border-t-warning", chip: "bg-warning-soft text-warning", icon: "bg-warning" },
  refused: { bar: "border-t-danger", chip: "bg-danger-soft text-danger", icon: "bg-danger" },
};

function Candidatures() {
  const apps = useApplications();
  const [view, setView] = useState<"board" | "list">("board");
  const [q, setQ] = useState("");
  const list = apps.filter((a) => (a.title + a.company).toLowerCase().includes(q.toLowerCase()));
  return (
    <AppShell wide title="Mes candidatures" subtitle="Suivez chaque offre, de « à postuler » jusqu'à la réponse.">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border bg-card p-1">
          <button onClick={() => setView("board")} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${view === "board" ? "bg-navy text-navy-foreground" : ""}`}><LayoutGrid className="h-4 w-4" />Tableau</button>
          <button onClick={() => setView("list")} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${view === "list" ? "bg-navy text-navy-foreground" : ""}`}><List className="h-4 w-4" />Liste</button>
        </div>
        <div className="relative ml-auto"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrer par poste, entreprise…" className="rounded-xl border bg-card py-2 pl-9 pr-3 text-sm" /></div>
        <button className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm"><RefreshCw className="h-4 w-4" />Vérifier la disponibilité</button>
        <Link to="/emploi" className="flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" />Ajouter une offre</Link>
      </div>
      {!apps.length && <div className="card-soft mb-5 p-6 text-center text-muted-foreground">Aucune offre enregistrée. Depuis <Link to="/emploi" className="text-primary underline">Offres d'emploi</Link>, cliquez « Enregistrer » : l'offre apparaît ici.</div>}
      {view === "board" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STATUSES.map((s) => {
            const Icon = ICONS[s.id]; const items = list.filter((a) => a.status === s.id);
            return (
              <div key={s.id} className={`card-soft border-t-4 p-3 ${TONE[s.id].bar}`}>
                <div className="mb-3 flex items-center gap-2 px-1"><span className={`grid h-7 w-7 place-items-center rounded-lg text-primary-foreground ${TONE[s.id].icon}`}><Icon className="h-4 w-4" /></span><b>{s.label}</b><span className={`ml-auto rounded-full px-2 text-xs font-semibold ${TONE[s.id].chip}`}>{items.length}</span></div>
                <div className="space-y-3">
                  {items.map((a) => (
                    <div key={a.id} className="rounded-xl border bg-card p-3">
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">{a.source}</span>
                      <div className="mt-2 font-semibold leading-snug">{a.title}</div>
                      <div className="text-sm text-muted-foreground">{a.company}</div>
                      <div className="text-sm text-muted-foreground"><MapPin className="inline h-3.5 w-3.5" /> {a.city}</div>
                      <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-success-soft px-2 py-1.5 text-xs font-semibold text-success"><CheckCircle2 className="h-3.5 w-3.5" />Toujours en ligne</div>
                      <div className="mt-3 flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">Enregistrée le {a.savedAt}
                        <select value={a.status} onChange={(e) => setStatus(a.id, e.target.value as AppStatus)} className="ml-auto rounded-lg border bg-card px-2 py-1 text-xs text-foreground">{STATUSES.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select>
                        <button onClick={() => removeApp(a.id)} className="rounded-lg border p-1" aria-label="Supprimer"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                  ))}
                  {!items.length && <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">Rien ici pour le moment</div>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card-soft divide-y">
          {list.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center gap-3 p-4"><div className="flex-1"><b>{a.title}</b><div className="text-sm text-muted-foreground">{a.company} · {a.city}</div></div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${TONE[a.status].chip}`}>{STATUSES.find((s) => s.id === a.status)?.label}</span></div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
