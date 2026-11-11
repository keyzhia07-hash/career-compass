import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, MapPin, Users } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { COMPANIES } from "@/lib/data";

export const Route = createFileRoute("/entreprises")({
  head: () => ({ meta: [
    { title: "Entreprises qui recrutent — Colombine CV Studio" },
    { name: "description", content: "Les entreprises qui recrutent près de chez vous." },
    { property: "og:title", content: "Entreprises qui recrutent — Colombine CV Studio" },
    { property: "og:description", content: "Les entreprises qui recrutent près de chez vous." },
  ] }),
  component: () => (
    <AppShell title="Entreprises qui recrutent" subtitle="Repérez les employeurs actifs et leurs offres ouvertes.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMPANIES.map((c) => (
          <div key={c.name} className="card-soft p-5">
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-info-soft text-info"><Building2 className="h-5 w-5" /></span><div><b>{c.name}</b><div className="text-sm text-muted-foreground">{c.sector}</div></div></div>
            <div className="mt-4 flex gap-4 text-sm text-muted-foreground"><span><MapPin className="inline h-4 w-4" /> {c.city}</span><span><Users className="inline h-4 w-4" /> {c.size}</span></div>
            <div className="mt-4 flex items-center justify-between"><span className="rounded-full bg-success-soft px-3 py-1 text-sm font-semibold text-success">{c.offers} offres</span><Link to="/emploi" className="text-sm font-semibold text-primary">Voir les offres →</Link></div>
          </div>
        ))}
      </div>
    </AppShell>
  ),
});
