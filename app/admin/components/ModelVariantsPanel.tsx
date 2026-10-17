"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Check, X, Layers } from "lucide-react";
import type { Variant } from "../../lib/catalog-types";
import { joinOptions, splitOptions } from "../../lib/variant-options";
import VariantOptionChips, { FUEL_TYPES, TRANSMISSION_TYPES } from "./VariantOptionChips";
import SubVariantsEditor from "./SubVariantsEditor";


// Uncontrolled add form — refs collect values on submit, React never touches input DOM values
function AddVariantForm({ modelId, modelName, modelSlug, onSaved, onCancel }: {
  modelId: string; modelName: string; modelSlug: string;
  onSaved: () => void; onCancel: () => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const specsRef = useRef<HTMLInputElement>(null);
  const [fuel, setFuel] = useState<string[]>(["Petrol"]);
  const [transmission, setTransmission] = useState<string[]>(["Manual"]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const body = {
        modelId, modelSlug, modelName,
        name: nameRef.current?.value.trim() ?? "",
        description: descRef.current?.value.trim() ?? "",
        fuel: joinOptions(fuel, FUEL_TYPES),
        transmission: joinOptions(transmission, TRANSMISSION_TYPES),
        price: priceRef.current?.value.trim() ?? "",
        specs: specsRef.current?.value.trim() ?? "",
      };
      if (!body.name) { setError("Variant name is required"); return; }
      const res = await fetch("/api/admin/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) { setError(data.error ?? "Failed to add"); return; }
      onSaved();
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  }

  return (
    <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800 p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">New Variant</span>
        <span className="text-slate-600">·</span>
        <span className="text-xs text-slate-400">Model: <strong className="text-white">{modelName}</strong></span>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-300">
            Variant Name * <span className="text-xs font-normal text-slate-500">(e.g. Brezza ZXI)</span>
            <input ref={nameRef} defaultValue="" placeholder="e.g. Brezza ZXI"
              className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-300">
            Description (optional)
            <input ref={descRef} defaultValue="" placeholder="e.g. Top variant"
              className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <VariantOptionChips label="Fuel" options={FUEL_TYPES} value={fuel} onChange={setFuel} />
          <VariantOptionChips label="Transmission" options={TRANSMISSION_TYPES} value={transmission} onChange={setTransmission} />
          <label className="block text-sm font-semibold text-slate-300">
            Price * <span className="text-xs font-normal text-slate-500">(e.g. ₹8.34 Lakh*)</span>
            <input ref={priceRef} defaultValue="" placeholder="₹8.34 Lakh*"
              className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
            />
          </label>
        </div>
        <label className="block text-sm font-semibold text-slate-300">
          Specs * <span className="text-xs font-normal text-slate-500">(e.g. "1462 cc, Manual, Petrol")</span>
          <input ref={specsRef} defaultValue="" placeholder="1462 cc, Manual, Petrol"
            className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      <div className="mt-4 flex gap-3">
        <button type="button" onClick={handleSubmit} disabled={loading}
          className="rounded-lg bg-amber-400 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50">
          {loading ? "Saving..." : "Save Variant"}
        </button>
        <button type="button" onClick={onCancel}
          className="rounded-lg border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-300 hover:border-slate-400">
          Cancel
        </button>
      </div>
    </div>
  );
}

// Uncontrolled edit form — keyed by variant._id so defaultValue resets when editing a different variant
function EditVariantForm({ variant, onSaved, onCancel }: {
  variant: Variant; onSaved: () => void; onCancel: () => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const specsRef = useRef<HTMLInputElement>(null);
  const [fuel, setFuel] = useState<string[]>(splitOptions(variant.fuel));
  const [transmission, setTransmission] = useState<string[]>(splitOptions(variant.transmission));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const body = {
        name: nameRef.current?.value.trim() ?? "",
        description: descRef.current?.value.trim() ?? "",
        fuel: joinOptions(fuel, FUEL_TYPES),
        transmission: joinOptions(transmission, TRANSMISSION_TYPES),
        price: priceRef.current?.value.trim() ?? "",
        specs: specsRef.current?.value.trim() ?? "",
      };
      if (!body.name) { setError("Variant name is required"); return; }
      const res = await fetch(`/api/admin/variants/${variant._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) { setError(data.error ?? "Failed to update"); return; }
      onSaved();
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-300">
          Variant Name *
          <input ref={nameRef} defaultValue={variant.name} placeholder="e.g. Brezza ZXI"
            className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-300">
          Description (optional)
          <input ref={descRef} defaultValue={variant.description ?? ""} placeholder="e.g. Top variant"
            className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <VariantOptionChips label="Fuel" options={FUEL_TYPES} value={fuel} onChange={setFuel} />
        <VariantOptionChips label="Transmission" options={TRANSMISSION_TYPES} value={transmission} onChange={setTransmission} />
        <label className="block text-sm font-semibold text-slate-300">
          Price *
          <input ref={priceRef} defaultValue={variant.price} placeholder="₹8.34 Lakh*"
            className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
          />
        </label>
      </div>
      <label className="block text-sm font-semibold text-slate-300">
        Specs *
        <input ref={specsRef} defaultValue={variant.specs} placeholder="1462 cc, Manual, Petrol"
          className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
        />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={handleSubmit} disabled={loading}
          className="flex items-center gap-1 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50">
          <Check className="h-3.5 w-3.5" />{loading ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel}
          className="flex items-center gap-1 rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-400">
          <X className="h-3.5 w-3.5" />Cancel
        </button>
      </div>
    </div>
  );
}

type Props = { modelId: string; modelName: string; modelSlug: string };

export default function ModelVariantsPanel({ modelId, modelName, modelSlug }: Props) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [subId, setSubId] = useState<string | null>(null);

  async function fetchVariants() {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/admin/variants?modelId=${modelId}`);
      const data = (await res.json()) as { variants?: Variant[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to load");
      setVariants(data.variants ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load variants");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void fetchVariants(); }, [modelId]);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete variant "${name}"?`)) return;
    try {
      await fetch(`/api/admin/variants/${id}`, { method: "DELETE" });
      await fetchVariants();
    } catch { alert("Failed to delete variant"); }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Model</p>
          <h2 className="mt-1 text-2xl font-black text-white">{modelName}</h2>
          <p className="mt-1 text-sm text-slate-400">{variants.length} variant{variants.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          type="button"
          onClick={() => { setShowAdd((v) => !v); setEditId(null); }}
          className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-300"
        >
          <Plus className="h-4 w-4" />Add Variant
        </button>
      </div>

      {showAdd && (
        <AddVariantForm
          modelId={modelId}
          modelName={modelName}
          modelSlug={modelSlug}
          onSaved={() => { setShowAdd(false); void fetchVariants(); }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {loading ? (
        <p className="text-slate-400">Loading variants...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : variants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/50 p-10 text-center">
          <p className="text-slate-400">No variants yet for <strong className="text-white">{modelName}</strong>.</p>
          <p className="mt-1 text-sm text-slate-500">Click "Add Variant" above to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-700">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700 bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Variant</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300 hidden sm:table-cell">Fuel / Trans.</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Price</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 bg-slate-900">
              {variants.map((variant) => (
                <tr key={variant._id} className={editId === variant._id || subId === variant._id ? "bg-slate-800" : "hover:bg-slate-800/50"}>
                  {editId === variant._id ? (
                    <td className="px-4 py-4" colSpan={4}>
                      <EditVariantForm
                        key={variant._id}
                        variant={variant}
                        onSaved={() => { setEditId(null); void fetchVariants(); }}
                        onCancel={() => setEditId(null)}
                      />
                    </td>
                  ) : subId === variant._id ? (
                    <td className="px-4 py-4" colSpan={4}>
                      <SubVariantsEditor
                        key={variant._id}
                        variant={variant}
                        onSaved={() => { setSubId(null); void fetchVariants(); }}
                        onCancel={() => setSubId(null)}
                      />
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white">{variant.name}</p>
                        {variant.description && <p className="text-xs text-slate-400">{variant.description}</p>}
                        <p className="mt-0.5 text-xs text-slate-500">{variant.specs}</p>
                      </td>
                      <td className="hidden px-4 py-3 text-slate-400 sm:table-cell">{splitOptions(variant.fuel).join(", ")} / {splitOptions(variant.transmission).join(", ")}</td>
                      <td className="px-4 py-3 font-semibold text-white">{variant.price}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button type="button" onClick={() => { setSubId(variant._id); setEditId(null); setShowAdd(false); }}
                            className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-amber-400 hover:text-amber-400">
                            <Layers className="h-3.5 w-3.5" />Sub-variants ({variant.subVariants?.length ?? 0})
                          </button>
                          <button type="button" onClick={() => { setEditId(variant._id); setSubId(null); setShowAdd(false); }}
                            className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-amber-400 hover:text-amber-400">
                            <Pencil className="h-3.5 w-3.5" />Edit
                          </button>
                          <button type="button" onClick={() => handleDelete(variant._id, variant.name)}
                            className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-red-500 hover:text-red-400">
                            <Trash2 className="h-3.5 w-3.5" />Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
