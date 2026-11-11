import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, FileText, Mail, MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { DOCUMENTS } from "@/lib/data";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [
    { title: "Mes documents — Colombine CV Studio" },
    { name: "description", content: "Tous vos CV et lettres de motivation." },
    { property: "og:title", content: "Mes documents — Colombine CV Studio" },
    { property: "og:description", content: "Tous vos CV et lettres de motivation." },
  ] }),
  component: Docs,
});

function Docs() {
  const [f, setF] = useState<"Tous" | "CV" | "Lettre">("Tous");
  const list = DOCUMENTS.filter((d) => f === "Tous" || d.kind === f);
  return (
    <AppShell title="Mes documents" subtitle="Vos CV et lettres, prêts à être adaptés à chaque offre.">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {(["Tous", "CV", "Lettre"] as const).map((k) => (
          <button key={k} onClick={() => setF(k)} className={`rounded-full px-4 py-1.5 text-sm ${f === k ? "bg-navy text-navy-foreground" : "border bg-card hover:bg-muted"}`}>{k === "Lettre" ? "Lettres" : k}</button>
        ))}
        <div className="ml-auto flex gap-2">
          <Link to="/editeur" className="flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" />Nouveau CV</Link>
          <Link to="/lettre" className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-sm font-semibold"><Mail className="h-4 w-4" />Nouvelle lettre</Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((d) => (
          <div key={d.id} className="card-soft overflow-hidden">
            <Link to={d.kind === "CV" ? "/editeur" : "/lettre"} className="block bg-muted p-5">
              <div className="mx-auto aspect-[1/1.414] w-2/3 rounded-md bg-paper p-3 shadow-paper">
                <div className="h-2 w-1/2 rounded bg-primary/70" /><div className="mt-2 space-y-1">{Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-1 rounded bg-muted-foreground/20" style={{ width: `${60 + ((i * 17) % 40)}%` }} />)}</div>
              </div>
            </Link>
            <div className="flex items-center gap-2 p-4">
              <FileText className={`h-4 w-4 ${d.kind === "CV" ? "text-primary" : "text-info"}`} />
              <div className="min-w-0 flex-1"><div className="truncate font-medium">{d.name}</div><div className="text-xs text-muted-foreground">{d.template} · {d.updated}</div></div>
              <button className="rounded-lg p-1.5 hover:bg-muted" aria-label="Dupliquer"><Copy className="h-4 w-4" /></button>
              <button className="rounded-lg p-1.5 hover:bg-muted" aria-label="Plus"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
