import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, FilePlus2, FileText, Kanban, Mail, ScanSearch, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { DOCUMENTS, QUOTAS } from "@/lib/data";
import { useApplications } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Tableau de bord — Colombine CV Studio" },
    { name: "description", content: "Vos CV, lettres, candidatures et analyses ATS en un coup d'œil." },
    { property: "og:title", content: "Tableau de bord — Colombine CV Studio" },
    { property: "og:description", content: "Vos CV, lettres, candidatures et analyses ATS en un coup d'œil." },
  ] }),
  component: Dashboard,
});

function Dashboard() {
  const apps = useApplications();
  const quick = [
    { to: "/editeur", label: "Nouveau CV", desc: "Modèle au choix, aperçu en direct", icon: FilePlus2, cls: "bg-t-content" },
    { to: "/lettre", label: "Nouvelle lettre", desc: "Libre ou générée depuis une offre", icon: Mail, cls: "bg-t-sections" },
    { to: "/ats", label: "Analyser mon CV", desc: "Score ATS détaillé", icon: ScanSearch, cls: "bg-t-style" },
    { to: "/emploi", label: "Trouver une offre", desc: "Recherche + carte", icon: Briefcase, cls: "bg-t-photo" },
  ] as const;
  return (
    <AppShell title="Bonjour Curtis 👋" subtitle="Voici où en est votre recherche d'emploi.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quick.map((q) => (
          <Link key={q.to} to={q.to} className="card-soft group p-5 transition-transform hover:-translate-y-0.5">
            <span className={`grid h-11 w-11 place-items-center rounded-xl text-primary-foreground ${q.cls}`}><q.icon className="h-5 w-5" /></span>
            <div className="mt-4 font-display text-lg font-semibold">{q.label}</div>
            <p className="text-sm text-muted-foreground">{q.desc}</p>
            <ArrowRight className="mt-3 h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card-soft p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Documents récents</h2><Link to="/documents" className="text-sm text-primary">Tout voir</Link></div>
          <ul className="divide-y">
            {DOCUMENTS.slice(0, 4).map((d) => (
              <li key={d.id} className="flex items-center gap-3 py-3">
                <span className={`grid h-9 w-9 place-items-center rounded-lg ${d.kind === "CV" ? "bg-primary-soft text-primary" : "bg-info-soft text-info"}`}><FileText className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1"><div className="truncate font-medium">{d.name}</div><div className="text-xs text-muted-foreground">{d.template} · {d.updated}</div></div>
                {d.score && <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">ATS {d.score}</span>}
                <Link to={d.kind === "CV" ? "/editeur" : "/lettre"} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-muted">Ouvrir</Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="card-soft p-5">
          <h2 className="mb-4 text-lg font-semibold">Vos quotas</h2>
          {QUOTAS.map((q) => (
            <div key={q.label} className="mb-4">
              <div className="mb-1 flex justify-between text-sm"><span>{q.label}</span><span className="text-muted-foreground">{q.used} / {q.max}</span></div>
              <div className="h-2 rounded-full bg-muted"><div className={`h-2 rounded-full ${q.used / q.max > 0.75 ? "bg-warning" : "bg-primary"}`} style={{ width: `${(q.used / q.max) * 100}%` }} /></div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Plafond atteint : vous pouvez toujours modifier vos documents, mais plus en créer.</p>
        </section>
        <section className="card-soft p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Candidatures</h2><Link to="/candidatures" className="text-sm text-primary">Ouvrir le suivi</Link></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[["À postuler", "todo", "bg-primary-soft text-primary"], ["Postulé", "applied", "bg-info-soft text-info"], ["Entretien", "interview", "bg-warning-soft text-warning"], ["Refusé", "refused", "bg-danger-soft text-danger"]].map(([l, s, c]) => (
              <div key={s} className={`rounded-xl p-4 ${c}`}><div className="font-display text-3xl font-bold">{apps.filter((a) => a.status === s).length}</div><div className="text-sm">{l}</div></div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl bg-gradient-hero p-5 text-primary-foreground shadow-glow">
          <Sparkles className="h-6 w-6" />
          <h2 className="mt-3 text-lg font-semibold">CV ciblé en 1 clic</h2>
          <p className="mt-1 text-sm opacity-90">Collez le lien d'une offre : l'IA adapte votre CV et rédige la lettre.</p>
          <Link to="/editeur" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-card px-4 py-2 text-sm font-semibold text-primary"><Kanban className="h-4 w-4" />Essayer</Link>
        </section>
      </div>
    </AppShell>
  );
}
