"use client";

import { useState } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import type { Variant } from "../../lib/catalog-types";
import { PAINT_OPTIONS, subColors } from "../../lib/sub-variants";

const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Hybrid", "Electric"];

const inputCls =
  "mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400";

type Row = {
  name: string;
  engine: string;
  fuel: string;
  transmission: string;
  paint: string;
  colors: string;
  price: string;
  description: string;
};

const emptyRow = (): Row => ({
  name: "", engine: "", fuel: "Petrol", transmission: "", paint: "Single Tone", colors: "", price: "", description: "",
});

export default function SubVariantsEditor({ variant, onSaved, onCancel }: {
  variant: Variant; onSaved: () => void; onCancel: () => void;
}) {
  const [rows, setRows] = useState<Row[]>(() =>
    (variant.subVariants ?? []).map((s) => ({
      name: s.name, engine: s.engine, fuel: s.fuel, transmission: s.transmission,
      paint: s.paint, colors: subColors(s).join(", "), price: s.price ?? "", description: s.description ?? "",
    })),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (i: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  async function handleSave() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/variants/${variant._id}/sub-variants`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subVariants: rows }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) { setError(data.error ?? "Failed to save"); return; }
      onSaved();
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Sub-variants of {variant.name}</p>
        <p className="mt-1 text-xs text-slate-500">
          Each one is a bookable configuration (engine, transmission, paint). List every colour this configuration is sold in; customers pick one from those. Leave Price blank to use {variant.price}.
        </p>
      </div>

      {rows.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-700 p-4 text-center text-sm text-slate-500">
          No sub-variants yet.
        </p>
      )}

      {rows.map((r, i) => (
        <div key={i} className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">#{i + 1}</span>
            <button type="button" onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
              className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-red-400">
              <Trash2 className="h-3.5 w-3.5" />Remove
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block text-sm font-semibold text-slate-300">
              Name *
              <input value={r.name} onChange={(e) => update(i, { name: e.target.value })}
                placeholder="e.g. ZXi MT Dual Tone" className={inputCls} />
            </label>
            <label className="block text-sm font-semibold text-slate-300">
              Engine *
              <input value={r.engine} onChange={(e) => update(i, { engine: e.target.value })}
                placeholder="e.g. 1462 cc" className={inputCls} />
            </label>
            <label className="block text-sm font-semibold text-slate-300">
              Fuel *
              <select value={r.fuel} onChange={(e) => update(i, { fuel: e.target.value })} className={inputCls}>
                {FUEL_TYPES.map((f) => <option key={f}>{f}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-300">
              Transmission *
              <input value={r.transmission} onChange={(e) => update(i, { transmission: e.target.value })}
                placeholder="e.g. 5-speed Manual" className={inputCls} />
            </label>
            <label className="block text-sm font-semibold text-slate-300">
              Paint *
              <select value={r.paint} onChange={(e) => update(i, { paint: e.target.value })} className={inputCls}>
                {PAINT_OPTIONS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-300">
              Colours (comma separated)
              <input value={r.colors} onChange={(e) => update(i, { colors: e.target.value })}
                placeholder="e.g. Pearl Arctic White, Midnight Black" className={inputCls} />
            </label>
            <label className="block text-sm font-semibold text-slate-300">
              Price
              <input value={r.price} onChange={(e) => update(i, { price: e.target.value })}
                placeholder="e.g. ₹11.2 Lakh*" className={inputCls} />
            </label>
          </div>
          <label className="mt-3 block text-sm font-semibold text-slate-300">
            Description (optional)
            <input value={r.description} onChange={(e) => update(i, { description: e.target.value })}
              placeholder="e.g. Performance-oriented manual configuration" className={inputCls} />
          </label>
        </div>
      ))}

      <button type="button" onClick={() => setRows((prev) => [...prev, emptyRow()])}
        className="flex items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-amber-400 hover:text-amber-400">
        <Plus className="h-3.5 w-3.5" />Add sub-variant
      </button>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={handleSave} disabled={loading}
          className="flex items-center gap-1 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50">
          <Check className="h-3.5 w-3.5" />{loading ? "Saving..." : "Save sub-variants"}
        </button>
        <button type="button" onClick={onCancel}
          className="flex items-center gap-1 rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-400">
          <X className="h-3.5 w-3.5" />Cancel
        </button>
      </div>
    </div>
  );
}
