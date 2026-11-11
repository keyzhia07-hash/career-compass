// Colombine CV Studio — auteure et propriétaire : Curtis CAFAFA.
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft, Briefcase, Building2, FileText, Gauge, Kanban, Languages, LayoutGrid, MessagesSquare, ScanSearch, UserRound } from "lucide-react";

const NAV = [
  { to: "/", label: "Tableau de bord", icon: LayoutGrid },
  { to: "/documents", label: "Mes documents", icon: FileText },
  { to: "/ats", label: "Analyse ATS", icon: ScanSearch },
  { to: "/emploi", label: "Offres d'emploi", icon: Briefcase },
  { to: "/candidatures", label: "Mes candidatures", icon: Kanban },
  { to: "/entreprises", label: "Entreprises qui recrutent", icon: Building2 },
  { to: "/profil-salaire", label: "Profil et salaire", icon: UserRound },
] as const;

export function AppShell({ title, subtitle, children, actions, wide }: { title: string; subtitle?: string; children: ReactNode; actions?: ReactNode; wide?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur">
        <div className={`mx-auto flex items-center gap-4 px-4 pt-4 sm:px-6 ${wide ? "max-w-[1500px]" : "max-w-7xl"}`}>
          <Link to="/" className="rounded-full p-2 text-muted-foreground hover:bg-muted" aria-label="Retour"><ArrowLeft className="h-5 w-5" /></Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold sm:text-2xl">{title}</h1>
            {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="hidden items-center gap-2 md:flex">
            {actions}
            <button className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm hover:bg-muted"><Languages className="h-4 w-4" />FR</button>
            <div className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-navy text-xs font-semibold text-navy-foreground">C</span>Curtis
            </div>
          </div>
        </div>
        <nav className={`mx-auto mt-3 flex items-center gap-1 overflow-x-auto px-4 sm:px-6 ${wide ? "max-w-[1500px]" : "max-w-7xl"}`}>
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
              className="flex shrink-0 items-center gap-2 border-b-2 border-transparent px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "!border-primary !text-primary font-medium" }}>
              <n.icon className="h-4 w-4" />{n.label}
            </Link>
          ))}
          <div className="ml-auto hidden shrink-0 gap-2 pb-1.5 lg:flex">
            <Link to="/editeur" className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:bg-muted"><Gauge className="h-4 w-4" />Éditeur</Link>
            <button className="flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"><MessagesSquare className="h-4 w-4" />Préparer un entretien</button>
          </div>
        </nav>
      </header>
      <main className={`mx-auto w-full flex-1 px-4 py-6 sm:px-6 ${wide ? "max-w-[1500px]" : "max-w-7xl"}`}>{children}</main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground">
          <div>© 2026 Colombine CV Studio — créé par <b className="text-foreground">Curtis CAFAFA</b><div className="text-xs">Modèles protégés : usage personnel uniquement.</div></div>
          <div className="flex gap-5"><a href="#">Mentions légales</a><a href="#">Confidentialité</a><a href="#">CGU</a></div>
        </div>
      </footer>
    </div>
  );
}

export function SectionCard({ title, icon, tone = "primary", children, right, subtitle }: { title: string; subtitle?: string; icon?: ReactNode; tone?: "primary" | "success" | "info" | "warning" | "danger"; children: ReactNode; right?: ReactNode }) {
  const tones = { primary: "bg-gradient-primary", success: "bg-success", info: "bg-info", warning: "bg-warning", danger: "bg-danger" };
  return (
    <section className="card-soft overflow-hidden">
      <div className={`flex items-center gap-3 px-5 py-4 text-primary-foreground ${tones[tone]}`}>
        {icon}<div className="flex-1"><h2 className="font-semibold">{title}</h2>{subtitle && <p className="text-xs opacity-90">{subtitle}</p>}</div>{right}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
