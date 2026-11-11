// Colombine CV Studio — auteure et propriétaire : Curtis CAFAFA.
// État de l'éditeur CV avec annuler / rétablir et sauvegarde automatique locale.
import { useCallback, useEffect, useRef, useState } from "react";

export type Bullet = "disc" | "square" | "dash" | "arrow" | "number" | "none";
export type Align = "left" | "center" | "right";
export type Section = {
  id: string; type: string; title: string; column: "main" | "side"; hidden: boolean;
  items: string[]; bullet: Bullet; spacing: number; align: Align; font?: string; size?: number; color?: string;
};
export type CvState = {
  name: string; role: string; contact: string[]; addressTwoLines: boolean; contactAlign: Align;
  template: "colombine" | "emeraude" | "classique";
  font: string; size: number; lineHeight: number; marginTop: number; marginBottom: number; sectionGap: number;
  primary: string; sideBg: string; paper: string;
  photo: { show: boolean; shape: "circle" | "square" | "rounded" | "oval"; size: number; border: number; zoom: number; position: Align };
  sections: Section[]; watermark: number;
};

export const PALETTES = [
  { name: "Violet signal", primary: "#6d3cf0", side: "#f1ecff" },
  { name: "Émeraude", primary: "#0f5b4a", side: "#0f3d33" },
  { name: "Corail", primary: "#e4572e", side: "#fff1ec" },
  { name: "Glacier", primary: "#1f6fb2", side: "#eaf3fb" },
  { name: "Ocre", primary: "#b07a1a", side: "#fbf4e6" },
  { name: "Encre", primary: "#1d2433", side: "#eef0f4" },
];
export const FONTS = ["Geist", "Lora", "Playfair Display", "Fraunces", "Bricolage Grotesque", "Georgia"];

export const SECTION_LIBRARY = ["Profil", "Expérience", "Formation", "Compétences", "Langues", "Certifications", "Loisirs", "Projets", "Bénévolat", "Missions ponctuelles", "Publications", "Références", "Outils", "Qualités", "Permis"];

const uid = () => Math.random().toString(36).slice(2, 9);
const sec = (title: string, column: "main" | "side", items: string[], bullet: Bullet = "dash"): Section => ({ id: uid(), type: title, title, column, hidden: false, items, bullet, spacing: 14, align: "left" });

export const INITIAL: CvState = {
  name: "Camille Vasseur", role: "Cheffe de produit digital",
  contact: ["camille.vasseur@exemple.fr", "06 00 00 00 00", "linkedin.com/in/exemple", "Nantes, France"],
  addressTwoLines: false, contactAlign: "right", template: "colombine",
  font: "Lora", size: 10, lineHeight: 1.45, marginTop: 36, marginBottom: 36, sectionGap: 16,
  primary: "#6d3cf0", sideBg: "#f1ecff", paper: "#fffdf8",
  photo: { show: true, shape: "rounded", size: 84, border: 0, zoom: 1, position: "left" },
  watermark: 0.06,
  sections: [
    sec("Profil", "main", ["Cheffe de produit digitale avec huit ans d'expérience en agence et chez un éditeur logiciel. Je pilote la découverte utilisateur, la priorisation et la mise en production."], "none"),
    sec("Expérience", "main", ["Cheffe de produit senior — Studio Lumen, Nantes (2022 – présent)", "Pilote un portefeuille de quatre produits numériques", "Fait passer le taux d'adoption de 34 % à 71 % en dix-huit mois", "Cheffe de produit — Maison Verte, Rennes (2019 – 2022)", "Refonte du parcours d'achat : +18 % de conversion"]),
    sec("Formation", "main", ["Master Management de l'innovation — IAE Nantes (2016)", "Licence Information-Communication — Rennes 2 (2014)"]),
    sec("Compétences", "side", ["Découverte utilisateur", "Priorisation & feuille de route", "Scrum, Kanban", "Suivi d'indicateurs (KPI)"]),
    sec("Langues", "side", ["Français — natif", "Anglais — C1", "Espagnol — B1"], "disc"),
    sec("Certifications", "side", ["PSPO I — 2021", "Google Analytics — 2020"], "square"),
  ],
};

export function useHistory<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  const past = useRef<T[]>([]); const future = useRef<T[]>([]);
  const [, force] = useState(0);
  const [saved, setSaved] = useState<"ok" | "saving">("ok");

  useEffect(() => { try { const s = localStorage.getItem(key); if (s) setState(JSON.parse(s)); } catch { /* ignore */ } }, [key]);
  useEffect(() => {
    setSaved("saving");
    const t = setTimeout(() => { localStorage.setItem(key, JSON.stringify(state)); setSaved("ok"); }, 500);
    return () => clearTimeout(t);
  }, [key, state]);

  const update = useCallback((fn: (s: T) => T) => {
    setState((s) => { past.current.push(s); if (past.current.length > 80) past.current.shift(); future.current = []; return fn(s); });
  }, []);
  const undo = () => { const p = past.current.pop(); if (p !== undefined) { future.current.push(state); setState(p); force((x) => x + 1); } };
  const redo = () => { const n = future.current.pop(); if (n !== undefined) { past.current.push(state); setState(n); force((x) => x + 1); } };
  const reset = () => update(() => initial);
  return { state, update, undo, redo, reset, canUndo: past.current.length > 0, canRedo: future.current.length > 0, saved };
}
