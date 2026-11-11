import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/profil-salaire")({
  head: () => ({ meta: [
    { title: "Profil et salaire — Colombine CV Studio" },
    { name: "description", content: "Votre profil métier et une estimation de salaire." },
    { property: "og:title", content: "Profil et salaire — Colombine CV Studio" },
    { property: "og:description", content: "Votre profil métier et une estimation de salaire." },
  ] }),
  component: Profil,
});

function Profil() {
  const [xp, setXp] = useState(5);
  const low = 28 + xp * 2.2, high = low + 9;
  return (
    <AppShell title="Profil et salaire" subtitle="Estimez votre fourchette de salaire selon votre métier et votre expérience.">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-soft space-y-4 p-5">
          <h2 className="font-semibold">Votre profil</h2>
          <label className="block text-sm">Métier<select className="mt-1 w-full rounded-xl border bg-card px-3 py-2.5"><option>Cheffe de produit digital</option><option>Développeur</option><option>Assistant RH</option><option>Technicien support</option></select></label>
          <label className="block text-sm">Région<select className="mt-1 w-full rounded-xl border bg-card px-3 py-2.5"><option>Île-de-France</option><option>Pays de la Loire</option><option>Auvergne-Rhône-Alpes</option></select></label>
          <label className="block text-sm">Années d'expérience : <b>{xp}</b><input type="range" min={0} max={20} value={xp} onChange={(e) => setXp(+e.target.value)} className="mt-2 w-full accent-primary" /></label>
        </section>
        <section className="rounded-2xl bg-gradient-hero p-6 text-primary-foreground shadow-glow">
          <div className="text-sm opacity-90">Fourchette estimée (brut annuel)</div>
          <div className="mt-2 font-display text-5xl font-bold">{low.toFixed(0)}–{high.toFixed(0)} k€</div>
          <p className="mt-4 text-sm opacity-90">Estimation indicative calculée localement, sans IA. À comparer avec les offres réelles du secteur.</p>
        </section>
      </div>
    </AppShell>
  );
}
