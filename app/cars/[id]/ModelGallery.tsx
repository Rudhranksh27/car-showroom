"use client";

import { useState } from "react";
import { CarFront } from "lucide-react";

type Props = { name: string; main?: string; exterior: string[]; interior: string[] };

export default function ModelGallery({ name, main, exterior, interior }: Props) {
  const exteriorAll = Array.from(new Set([...(main ? [main] : []), ...exterior]));
  const tabs = [
    { key: "exterior", label: "Exterior", images: exteriorAll },
    { key: "interior", label: "Interior", images: interior },
  ].filter((t) => t.images.length > 0);

  const [tab, setTab] = useState(tabs[0]?.key ?? "exterior");
  const [index, setIndex] = useState(0);

  if (tabs.length === 0) {
    return (
      <div className="flex aspect-4/3 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <CarFront className="h-28 w-28 text-slate-300" strokeWidth={0.8} />
      </div>
    );
  }

  const active = tabs.find((t) => t.key === tab) ?? tabs[0];
  const current = active.images[Math.min(index, active.images.length - 1)];

  return (
    <div>
      <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
        <img src={current} alt={`${name} ${active.label.toLowerCase()}`} className="h-full w-full object-contain" />
        {tabs.length > 1 && (
          <div className="absolute left-3 top-3 inline-flex rounded-full bg-white/90 p-1 shadow-sm ring-1 ring-slate-200 backdrop-blur">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => { setTab(t.key); setIndex(0); }}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  t.key === active.key ? "bg-[#0b3d32] text-white" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {active.images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {active.images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${active.label.toLowerCase()} image ${i + 1}`}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border bg-white transition ${
                i === index ? "border-sky-500 ring-2 ring-sky-200" : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
