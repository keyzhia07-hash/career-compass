// Colombine CV Studio — auteure et propriétaire : Curtis CAFAFA.
// Carte des offres : Leaflet (licence BSD-2) + tuiles OpenStreetMap. Chargée uniquement côté navigateur.
import { useEffect, useRef } from "react";
import type { Job } from "@/lib/data";

export function JobMap({ jobs, selectedId, onSelect }: { jobs: Job[]; selectedId?: string; onSelect: (id: string) => void }) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((mod) => {
      const L = (mod as unknown as { default?: typeof import("leaflet") }).default ?? mod;
      if (cancelled || !el.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(el.current, { scrollWheelZoom: false }).setView([46.6, 2.4], 5);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap contributors" }).addTo(map);
      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      draw();
    });
    return () => { cancelled = true; mapRef.current?.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function draw() {
    const L = LRef.current, layer = layerRef.current, map = mapRef.current;
    if (!L || !layer || !map) return;
    layer.clearLayers();
    jobs.forEach((j) => {
      const active = j.id === selectedId;
      const icon = L.divIcon({
        className: "",
        html: `<div style="transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center"><div style="background:${active ? "var(--primary)" : "var(--navy)"};color:white;border-radius:999px;padding:4px 10px;font:600 12px var(--font-sans);white-space:nowrap;box-shadow:var(--shadow-soft)">${j.contract}</div><div style="width:10px;height:10px;background:${active ? "var(--primary)" : "var(--navy)"};transform:rotate(45deg);margin-top:-6px"></div></div>`,
      });
      L.marker([j.lat, j.lng], { icon }).addTo(layer).bindTooltip(`${j.title} — ${j.company}`).on("click", () => onSelect(j.id));
    });
    const sel = jobs.find((j) => j.id === selectedId);
    if (sel) map.flyTo([sel.lat, sel.lng], 10, { duration: 0.6 });
    else if (jobs.length) map.fitBounds(L.latLngBounds(jobs.map((j) => [j.lat, j.lng])), { padding: [40, 40], maxZoom: 10 });
  }

  useEffect(draw, [jobs, selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={el} className="h-full min-h-[420px] w-full" />;
}
