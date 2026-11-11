// Colombine CV Studio — auteure et propriétaire : Curtis CAFAFA.
// Candidatures enregistrées (stockage local du navigateur — à brancher sur le serveur plus tard).
import { useEffect, useState } from "react";
import type { AppStatus, Job } from "./data";

export type SavedApp = Job & { status: AppStatus; savedAt: string };
const KEY = "cs-applications";
const listeners = new Set<() => void>();

function read(): SavedApp[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function write(v: SavedApp[]) { localStorage.setItem(KEY, JSON.stringify(v)); listeners.forEach((l) => l()); }

export function saveJob(job: Job) {
  const all = read();
  if (all.some((a) => a.id === job.id)) return false;
  write([...all, { ...job, status: "todo", savedAt: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) }]);
  return true;
}
export function setStatus(id: string, status: AppStatus) { write(read().map((a) => (a.id === id ? { ...a, status } : a))); }
export function removeApp(id: string) { write(read().filter((a) => a.id !== id)); }

export function useApplications() {
  const [apps, setApps] = useState<SavedApp[]>([]);
  useEffect(() => {
    const l = () => setApps(read());
    l(); listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return apps;
}
