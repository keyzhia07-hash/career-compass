// Colombine CV Studio — auteure et propriétaire : Curtis CAFAFA.
// Aperçu A4 du CV. Les couleurs/polices viennent des choix de l'utilisateur (données du document).
import { Mail, MapPin, Phone, Linkedin } from "lucide-react";
import type { CSSProperties } from "react";
import type { Bullet, CvState, Section } from "./editor-state";
import portrait from "@/assets/portrait.jpg";

const MARK: Record<Bullet, string> = { disc: "•", square: "▪", dash: "–", arrow: "→", number: "", none: "" };
const ICONS = [Mail, Phone, Linkedin, MapPin];

function Block({ s, cv, dark, focused, onFocus }: { s: Section; cv: CvState; dark?: boolean; focused?: boolean; onFocus: () => void }) {
  const style: CSSProperties = { marginBottom: s.spacing, textAlign: s.align, fontFamily: s.font || undefined, fontSize: s.size ? `${s.size}pt` : undefined, color: s.color || undefined };
  return (
    <div style={style} onClick={onFocus} className={`cursor-pointer rounded-sm outline-offset-4 transition ${focused ? "outline-2 outline-dashed" : "hover:outline-1 hover:outline-dashed"}`} data-section={s.id}>
      <h3 style={{ color: dark ? "#fff" : cv.primary, borderColor: dark ? "#ffffff55" : cv.primary + "55", fontFamily: s.font || cv.font }} className="mb-1.5 border-b pb-1 text-[0.95em] font-semibold uppercase tracking-[0.18em]">{s.title}</h3>
      <ul className="space-y-0.5">
        {s.items.map((it, i) => (
          <li key={i} className="flex gap-1.5" style={{ justifyContent: s.align === "center" ? "center" : s.align === "right" ? "flex-end" : undefined }}>
            {s.bullet !== "none" && <span style={{ color: dark ? "#fff" : cv.primary }}>{s.bullet === "number" ? `${i + 1}.` : MARK[s.bullet]}</span>}
            <span contentEditable suppressContentEditableWarning>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CvPreview({ cv, focusId, onFocus }: { cv: CvState; focusId?: string; onFocus: (id: string) => void }) {
  const vis = cv.sections.filter((s) => !s.hidden);
  const main = vis.filter((s) => s.column === "main"), side = vis.filter((s) => s.column === "side");
  const radius = { circle: "50%", square: "0", rounded: "14px", oval: "50% / 40%" }[cv.photo.shape];
  const darkSide = cv.template === "emeraude";
  const photo = cv.photo.show && (
    <div style={{ width: cv.photo.size, height: cv.photo.shape === "oval" ? cv.photo.size * 1.2 : cv.photo.size, borderRadius: radius, border: `${cv.photo.border}px solid ${cv.primary}`, overflow: "hidden", flexShrink: 0 }}>
      <img src={portrait} alt="Photo" style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${cv.photo.zoom})` }} />
    </div>
  );
  const contacts = (
    <div style={{ textAlign: cv.contactAlign }} className="space-y-0.5 text-[0.9em]">
      {cv.contact.map((c, i) => { const I = ICONS[i] ?? Mail; return <div key={i} className="flex items-center gap-1.5" style={{ justifyContent: cv.contactAlign === "right" ? "flex-end" : cv.contactAlign === "center" ? "center" : "flex-start" }}><I style={{ color: cv.primary, width: 12, height: 12 }} /><span contentEditable suppressContentEditableWarning>{c}</span></div>; })}
    </div>
  );
  return (
    <div className="relative mx-auto w-[794px] max-w-full shadow-paper" style={{ background: cv.paper, fontFamily: cv.font, fontSize: `${cv.size}pt`, lineHeight: cv.lineHeight, color: "#1f2330", minHeight: 1123, paddingTop: cv.marginTop, paddingBottom: cv.marginBottom }}>
      {cv.watermark > 0 && <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden text-5xl font-bold" style={{ opacity: cv.watermark, transform: "rotate(-25deg)", color: cv.primary }}>Colombine CV Studio</div>}
      <header className={`relative flex items-center gap-5 px-12 ${cv.template === "classique" ? "flex-col text-center" : ""}`} style={{ flexDirection: cv.template === "classique" ? "column" : cv.photo.position === "right" ? "row-reverse" : "row" }}>
        {photo}
        <div className="flex-1">
          <div contentEditable suppressContentEditableWarning className="text-[2.6em] leading-tight" style={{ fontFamily: cv.template === "colombine" ? "Playfair Display" : cv.font }}>{cv.name}</div>
          <div contentEditable suppressContentEditableWarning style={{ color: cv.primary }} className="text-[1.25em]">{cv.role}</div>
        </div>
        {contacts}
      </header>
      <div className="relative mt-6 grid gap-6 px-12" style={{ gridTemplateColumns: cv.template === "classique" ? "1fr" : "1fr 2fr" }}>
        <aside className="rounded-md p-4" style={{ background: cv.sideBg, color: darkSide ? "#fff" : undefined, order: cv.template === "classique" ? 2 : 0 }}>
          {side.map((s) => <div key={s.id} style={{ marginBottom: cv.sectionGap }}><Block s={s} cv={cv} dark={darkSide} focused={focusId === s.id} onFocus={() => onFocus(s.id)} /></div>)}
        </aside>
        <div>{main.map((s) => <div key={s.id} style={{ marginBottom: cv.sectionGap }}><Block s={s} cv={cv} focused={focusId === s.id} onFocus={() => onFocus(s.id)} /></div>)}</div>
      </div>
    </div>
  );
}
