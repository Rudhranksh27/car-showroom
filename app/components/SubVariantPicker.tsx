"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarClock, Cog, Fuel, Gauge, Palette, ShoppingCart } from "lucide-react";
import type { SubVariantDoc } from "../lib/catalog-types";
import { subColors } from "../lib/sub-variants";
import CarColorPreview from "./CarColorPreview";
import Car360Viewer from "./Car360Viewer";
import { parseTones } from "../lib/car-recolor";

type Field = { label: string; get: (s: SubVariantDoc) => string; Icon: typeof Gauge };

const FIELDS: Field[] = [
  { label: "Engine", get: (s) => s.engine, Icon: Gauge },
  { label: "Fuel", get: (s) => s.fuel, Icon: Fuel },
  { label: "Transmission", get: (s) => s.transmission, Icon: Cog },
  { label: "Paint", get: (s) => s.paint, Icon: Palette },
  { label: "Colour", get: (s) => s.color ?? "", Icon: Palette },
];

// Transmission and paint are chosen together as one "Version" (e.g. "5-speed Manual · Single Tone"); colour follows from it.
const VERSION: Field = { label: "Version", get: (s) => `${s.transmission} · ${s.paint}`, Icon: Cog };
const CASCADE: Field[] = [VERSION, FIELDS.find((f) => f.label === "Colour")!];

/** One card for a group of sub-variants (same engine + fuel). Dropdowns cascade: transmission, then paint, then colour. */
export default function SubVariantPicker({ subs: rawSubs, variantPrice, slug, modelName, image, frames360 = [] }: {
  subs: SubVariantDoc[]; variantPrice: string; slug: string; modelName: string; image?: string; frames360?: string[]; // slug is already URL-encoded
}) {
  // One option per sub-variant and colour; the id carries the colour so bookings know which one was picked.
  const subs = rawSubs.flatMap((s) =>
    subColors(s).length ? subColors(s).map((c) => ({ ...s, id: `${s.id}~${c}`, color: c })) : [s],
  );
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [view360, setView360] = useState(false);

  // Walk the cascade: keep a pick only while it is still available among the remaining options.
  let candidates = subs;
  const selects: { field: Field; values: string[]; value: string }[] = [];
  for (const field of CASCADE) {
    const values = [...new Set(candidates.map(field.get))];
    const value = values.includes(picked[field.label]) ? picked[field.label] : values[0];
    if (values.length > 1 || (field !== VERSION && values[0])) selects.push({ field, values, value });
    candidates = candidates.filter((c) => field.get(c) === value);
  }
  const sub = candidates[0];
  const varying = new Set(selects.flatMap((x) => (x.field === VERSION ? ["Transmission", "Paint"] : [x.field.label])));
  const price = (s: SubVariantDoc) => s.price || variantPrice;
  const rows = FIELDS.filter((f) => f.get(sub));
  const q = encodeURIComponent(sub.id);
  // Changing a dropdown forgets the picks made after it, so the later ones reset to what is available.
  const choose = (label: string, value: string) =>
    setPicked((prev) => {
      const next: Record<string, string> = {};
      for (const f of CASCADE) {
        if (f.label === label) { next[label] = value; break; }
        next[f.label] = prev[f.label] ?? "";
      }
      return next;
    });

  return (
    <article className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm lg:grid-cols-2">
      <div className="flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-extrabold tracking-[-0.01em] md:text-2xl">{sub.name}</h3>
        <p className="shrink-0 rounded-full bg-[#0b3d32]/10 px-4 py-1.5 text-lg font-extrabold text-[#0b3d32]">{price(sub)}</p>
      </div>

      {selects.map(({ field, values, value }) =>
        field === VERSION ? (
          values.length > 1 && (
            <label key={field.label} className="mt-5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              {field.label}
              <select
                value={value}
                onChange={(e) => choose(field.label, e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base font-bold normal-case tracking-normal text-slate-900 outline-none focus:border-[#0b3d32]"
              >
                {values.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>
          )
        ) : (
          <div key={field.label} className="mt-5" role="radiogroup" aria-label={field.label}>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Choose {field.label.toLowerCase()}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {values.map((v) => {
                const active = v === value;
                return (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => choose(field.label, v)}
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition ${active ? "border-[#0b3d32] bg-[#0b3d32] text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-500"}`}
                  >
                    <span className="mr-2 inline-flex h-3.5 w-3.5 overflow-hidden rounded-full align-middle ring-1 ring-black/20" aria-hidden="true">
                      <span className="h-full w-1/2" style={{ background: parseTones(v).body }} />
                      <span className="h-full w-1/2" style={{ background: parseTones(v).roof }} />
                    </span>
                    {v || "Standard"}
                  </button>
                );
              })}
            </div>
          </div>
        ),
      )}

      {sub.description && <p className="mt-3 text-base leading-7 text-slate-600">{sub.description}</p>}

      <dl className="mt-6 grid grid-cols-2 gap-3">
        {rows.map(({ label, get, Icon }) => {
          const changes = varying.has(label);
          return (
            <div key={label} className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${changes ? "bg-emerald-50 ring-1 ring-[#0b3d32]/30" : "bg-slate-50"}`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0b3d32] shadow-sm ring-1 ring-slate-200"><Icon className="h-5 w-5" strokeWidth={1.75} /></span>
              <div className="min-w-0">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</dt>
                <dd className="text-base font-extrabold leading-snug text-slate-900">{get(sub)}</dd>
              </div>
            </div>
          );
        })}
      </dl>

      <div className="mt-7 flex flex-wrap gap-3">
        <Link href={`/book-test-drive?model=${slug}&variant=${q}#book`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#0b3d32] px-5 py-3.5 text-base font-bold text-[#0b3d32] transition hover:bg-[#0b3d32]/5">
          <CalendarClock className="h-5 w-5" />Book Test Drive
        </Link>
        <Link href={`/cars/${slug}/checkout?variant=${q}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0b3d32] px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-[#0b3d32]/20 transition hover:-translate-y-0.5 hover:bg-[#082d25]">
          <ShoppingCart className="h-5 w-5" />Book Now
        </Link>
      </div>
      </div>

      <div className="order-first flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-200 p-6 lg:order-last">
        {view360 && frames360.length > 0 ? (
          <Car360Viewer frames={frames360} color={sub.color ?? ""} label={`${modelName} ${sub.name}`} />
        ) : image ? (
          <CarColorPreview color={sub.color ?? ""} label={`${modelName} ${sub.name}`} src={image} />
        ) : (
          <p className="text-sm text-slate-500">No car photo available.</p>
        )}
        <p className="mt-3 text-center text-sm font-bold text-slate-700">
          {sub.color || "Choose a colour"}
          {sub.color?.includes("/") && <span className="block text-xs font-semibold text-slate-400">Body / roof</span>}
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
    </article>
  );
}
