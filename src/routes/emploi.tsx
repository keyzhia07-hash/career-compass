import { createFileRoute } from "@tanstack/react-router";
import { BookmarkPlus, Briefcase, Building, ExternalLink, GraduationCap, Landmark, List, Map as MapIcon, MapPin, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ClientOnly } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { JobMap } from "@/components/app/JobMap";
import { JOBS } from "@/lib/data";
import { saveJob } from "@/lib/store";

export const Route = createFileRoute("/emploi")({
  head: () => ({ meta: [
    { title: "Offres d'emploi — Colombine CV Studio" },
    { name: "description", content: "Trouvez une offre, voyez où elle se situe sur la carte et adaptez votre CV." },
    { property: "og:title", content: "Offres d'emploi — Colombine CV Studio" },
    { property: "og:description", content: "Trouvez une offre, voyez où elle se situe sur la carte et adaptez votre CV." },
  ] }),
  component: Emploi,
});

const SOURCES = [
  { id: "France Travail", icon: Briefcase },
  { id: "Emploi public", icon: Landmark },
  { id: "La Bonne Alternance", icon: GraduationCap },
] as const;
const CONTRACTS = ["CDI", "CDD", "Intérim", "Alternance", "Saisonnier", "Indépendant"];

function Emploi() {
  const [source, setSource] = useState<string>("Tous");
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [contracts, setContracts] = useState<string[]>([]);
  const [sel, setSel] = useState<string | undefined>();
  const [view, setView] = useState<"split" | "list">("split");

  const jobs = useMemo(() => JOBS.filter((j) =>
    (source === "Tous" || j.source === source) &&
    (!contracts.length || contracts.includes(j.contract)) &&
    (!q || (j.title + j.company + j.summary).toLowerCase().includes(q.toLowerCase())) &&
    (!city || j.city.toLowerCase().includes(city.toLowerCase()))), [source, q, city, contracts]);
  const current = jobs.find((j) => j.id === sel);

  return (
    <AppShell wide title="Offres d'emploi" subtitle="Vos offres, cherchées pour vous — et situées sur la carte.">
      <section className="card-soft p-5">
        <div className="flex flex-wrap gap-2 rounded-2xl border bg-muted/50 p-1.5">
          {[{ id: "Tous", icon: Search }, ...SOURCES].map((s) => (
            <button key={s.id} onClick={() => setSource(s.id)} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${source === s.id ? "bg-info text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-card"}`}>
              <s.icon className="h-4 w-4" />{s.id}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_280px_140px_auto]">
          <label className="text-sm"><span className="mb-1 flex items-center gap-1.5 text-muted-foreground"><Briefcase className="h-3.5 w-3.5" />Métier, fonction ou mots-clés</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex. : assistant RH, développeur…" className="w-full rounded-xl border bg-card px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring" /></label>
          <label className="text-sm"><span className="mb-1 flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-3.5 w-3.5 text-danger" />Lieu</span>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex. : Lyon, 75, Bretagne" className="w-full rounded-xl border bg-card px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring" /></label>
          <label className="text-sm"><span className="mb-1 block text-muted-foreground">Distance</span>
            <select className="w-full rounded-xl border bg-card px-3 py-2.5"><option>10 km</option><option>20 km</option><option>50 km</option><option>100 km</option></select></label>
          <button className="flex items-center justify-center gap-2 self-end rounded-xl bg-gradient-primary px-6 py-2.5 font-semibold text-primary-foreground shadow-glow"><Search className="h-4 w-4" />Rechercher</button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium"><SlidersHorizontal className="h-4 w-4" />Filtres</button>
          {CONTRACTS.map((c) => {
            const on = contracts.includes(c);
            return <button key={c} onClick={() => setContracts(on ? contracts.filter((x) => x !== c) : [...contracts, c])} className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${on ? "border-info bg-info text-primary-foreground" : "border-info/30 bg-info-soft text-info"}`}>{c}</button>;
          })}
          <div className="ml-auto flex rounded-xl border p-1">
            <button onClick={() => setView("split")} className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm ${view === "split" ? "bg-navy text-navy-foreground" : ""}`}><MapIcon className="h-4 w-4" />Carte</button>
            <button onClick={() => setView("list")} className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm ${view === "list" ? "bg-navy text-navy-foreground" : ""}`}><List className="h-4 w-4" />Liste</button>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{jobs.length} offre(s) · données d'exemple. Chaque offre renvoie vers l'annonce d'origine.</p>
      </section>

      <div className={`mt-5 grid gap-5 ${view === "split" ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" : ""}`}>
        <div className="space-y-3">
          {jobs.map((j) => (
            <article key={j.id} onClick={() => setSel(j.id)} className={`card-soft cursor-pointer p-4 transition ${sel === j.id ? "ring-2 ring-primary" : "hover:-translate-y-0.5"}`}>
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><Building className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs"><span className="rounded-full bg-primary px-2 py-0.5 font-semibold text-primary-foreground">{j.source}</span><span className="text-muted-foreground">{j.posted}</span>{j.remote && <span className="rounded-full bg-success-soft px-2 py-0.5 text-success">Télétravail partiel</span>}</div>
                  <h3 className="mt-1 font-semibold">{j.title}</h3>
                  <div className="text-sm text-muted-foreground">{j.company} · <MapPin className="inline h-3.5 w-3.5" /> {j.city}</div>
                  <p className="mt-1 line-clamp-2 text-sm">{j.summary}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-muted px-2 py-1 text-xs font-medium">{j.contract}</span>
                    {j.salary && <span className="rounded-lg bg-muted px-2 py-1 text-xs font-medium">{j.salary}</span>}
                    <div className="ml-auto flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); toast(saveJob(j) ? "Offre ajoutée à vos candidatures" : "Déjà dans vos candidatures"); }} className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted"><BookmarkPlus className="h-3.5 w-3.5" />Enregistrer</button>
                      <button onClick={(e) => { e.stopPropagation(); toast("Adaptation du CV — bientôt disponible"); }} className="flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground"><Sparkles className="h-3.5 w-3.5" />Adapter mon CV</button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
          {!jobs.length && <div className="card-soft p-8 text-center text-muted-foreground">Aucune offre ne correspond. Essayez d'élargir vos critères.</div>}
        </div>
        {view === "split" && (
          <div className="lg:sticky lg:top-40 lg:h-[calc(100vh-12rem)]">
            <div className="card-soft h-full overflow-hidden">
              <ClientOnly fallback={<div className="grid h-full min-h-[420px] place-items-center text-muted-foreground">Chargement de la carte…</div>}>
                <JobMap jobs={jobs} selectedId={sel} onSelect={setSel} />
              </ClientOnly>
            </div>
            {current && <div className="mt-2 text-sm text-muted-foreground"><MapPin className="inline h-4 w-4 text-danger" /> {current.title} — {current.city}</div>}
          </div>
        )}
      </div>

      <section className="card-soft mt-6 p-5">
        <h2 className="flex items-center gap-2 font-semibold"><Briefcase className="h-4 w-4" />Chercher aussi sur d'autres sites</h2>
        <p className="text-sm text-muted-foreground">Chaque bouton ouvre la recherche du site avec votre intitulé de poste déjà rempli.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["HelloWork", "Apec", "Indeed", "Google Jobs", "LinkedIn"].map((s) => <button key={s} disabled={!q} className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm disabled:opacity-40"><ExternalLink className="h-4 w-4" />{s}</button>)}
        </div>
      </section>
    </AppShell>
  );
}
