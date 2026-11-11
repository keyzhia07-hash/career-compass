// Barre flottante à la sélection de texte (une seule liste « Taille »).
import { Bold, Italic, Underline } from "lucide-react";
import { useEffect, useState } from "react";

export function SelectionToolbar({ container }: { container: React.RefObject<HTMLElement | null> }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const h = () => {
      const s = window.getSelection();
      if (!s || s.isCollapsed || !container.current || !container.current.contains(s.anchorNode)) return setPos(null);
      const r = s.getRangeAt(0).getBoundingClientRect();
      setPos({ x: r.left + r.width / 2, y: r.top - 8 });
    };
    document.addEventListener("selectionchange", h);
    return () => document.removeEventListener("selectionchange", h);
  }, [container]);
  if (!pos) return null;
  const cmd = (c: string, v?: string) => document.execCommand(c, false, v);
  return (
    <div className="fixed z-50 flex -translate-x-1/2 -translate-y-full items-center gap-1 rounded-xl border bg-card p-1 shadow-paper" style={{ left: pos.x, top: pos.y }} onMouseDown={(e) => e.preventDefault()}>
      <button onClick={() => cmd("bold")} className="rounded-lg p-1.5 hover:bg-muted" aria-label="Gras"><Bold className="h-4 w-4" /></button>
      <button onClick={() => cmd("italic")} className="rounded-lg p-1.5 hover:bg-muted" aria-label="Italique"><Italic className="h-4 w-4" /></button>
      <button onClick={() => cmd("underline")} className="rounded-lg p-1.5 hover:bg-muted" aria-label="Souligné"><Underline className="h-4 w-4" /></button>
      <select onChange={(e) => cmd("fontSize", e.target.value)} defaultValue="" className="rounded-lg border bg-card px-1.5 py-1 text-xs">
        <option value="" disabled>Taille</option>{[["1", "Très petite"], ["2", "Petite"], ["3", "Normale"], ["4", "Grande"], ["5", "Très grande"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <input type="color" onChange={(e) => cmd("foreColor", e.target.value)} className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent" aria-label="Couleur" />
    </div>
  );
}
