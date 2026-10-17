"use client";

import { useState } from "react";
import CarColorPreview from "./CarColorPreview";
import Car360Viewer from "./Car360Viewer";

/** Car photo recoloured to the chosen colour, with a switch to a drag-to-rotate 360° view in the same colour. */
export default function CarShowcase({ image, frames360 = [], color, label }: {
  image?: string; frames360?: string[]; color: string; label: string;
}) {
  const [view360, setView360] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-200 p-6">
      {view360 && frames360.length > 0 ? (
        <Car360Viewer frames={frames360} color={color} label={label} />
      ) : image ? (
        <CarColorPreview color={color} label={label} src={image} />
      ) : (
        <p className="text-sm text-slate-500">No car photo available.</p>
      )}
      <p className="mt-3 text-center text-sm font-bold text-slate-700">
        {color || "Choose a colour"}
        {color.includes("/") && <span className="block text-xs font-semibold text-slate-400">Body / roof</span>}
      </p>
      {frames360.length > 0 && (
        <button
          type="button" onClick={() => setView360((v) => !v)} aria-pressed={view360}
          className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-[#0b3d32] px-5 py-2.5 text-sm font-bold text-[#0b3d32] transition hover:bg-[#0b3d32]/5"
        >
          {view360 ? "← Back to photo" : "360° view"}
        </button>
      )}
    </div>
  );
}
