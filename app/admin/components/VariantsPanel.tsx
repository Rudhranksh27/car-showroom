"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Check, X, Layers } from "lucide-react";
import type { Model, Variant } from "../../lib/catalog-types";
import SubVariantsEditor from "./SubVariantsEditor";

const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Hybrid", "Electric"];
const TRANSMISSIONS = ["Manual", "Automatic", "AMT", "CVT", "DCT"];

function AddVariantForm({ models, onSaved, onCancel }: {
  models: Model[]; onSaved: () => void; onCancel: () => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const specsRef = useRef<HTMLInputElement>(null);
  const [modelId, setModelId] = useState("");
  const [fuel, setFuel] = useState("Petrol");
  const [transmission, setTransmission] = useState("Manual");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null); setLoading(true);
    try {
      const selectedModel = models.find((m) => m._id === modelId);
      const body = {
        modelId,
        modelSlug: selectedModel?.slug ?? "",
        modelName: selectedModel?.name ?? "",
        name: nameRef.current?.value.trim() ?? "",
        description: descRef.current?.value.trim() ?? "",
        fuel,
        transmission,
        price: priceRef.current?.value.trim() ?? "",
        specs: specsRef.current?.value.trim() ?? "",
      };
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
      <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-amber-400">New Variant</h3>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-300">
            Model *
            <select value={modelId} onChange={(e) => setModelId(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
            >
              <option value="">Select model</option>
              {models.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-300">
            Variant Name *
            <input ref={nameRef} defaultValue="" placeholder="e.g. Brezza ZXI"
              className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-300">
            Fuel *
            <select value={fuel} onChange={(e) => setFuel(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
            >
              {FUEL_TYPES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-300">
            Transmission *
            <select value={transmission} onChange={(e) => setTransmission(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
            >
              {TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-300">
            Price * <span className="text-xs font-normal text-slate-500">(e.g. ₹8.34 Lakh*)</span>
            <input ref={priceRef} defaultValue="" placeholder="₹8.34 Lakh*"
              className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-300">
            Description (optional)
            <input ref={descRef} defaultValue="" placeholder="e.g. Base Model"
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

function EditVariantForm({ variant, onSaved, onCancel }: {
  variant: Variant; onSaved: () => void; onCancel: () => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const specsRef = useRef<HTMLInputElement>(null);
  const [fuel, setFuel] = useState(variant.fuel);
  const [transmission, setTransmission] = useState(variant.transmission);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null); setLoading(true);
    try {
      const body = {
        name: nameRef.current?.value.trim() ?? "",
        description: descRef.current?.value.trim() ?? "",
        fuel,
        transmission,
        price: priceRef.current?.value.trim() ?? "",
        specs: specsRef.current?.value.trim() ?? "",
      };
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
          <input ref={descRef} defaultValue={variant.description ?? ""} placeholder="e.g. Base Model"
            className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-300">
          Fuel *
          <select value={fuel} onChange={(e) => setFuel(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
          >
            {FUEL_TYPES.map((f) => <option key={f}>{f}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-300">
          Transmission *
          <select value={transmission} onChange={(e) => setTransmission(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-amber-400"
          >
            {TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-300">
          Price *
          <input ref={priceRef} defaultValue={variant.price} placeholder="₹8.34 Lakh*"
            className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-300">
          Specs *
          <input ref={specsRef} defaultValue={variant.specs} placeholder="1462 cc, Manual, Petrol"
            className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
          />
        </label>
      </div>
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

export default function VariantsPanel() {
  const [models, setModels] = useState<Model[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [filterModelId, setFilterModelId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [subId, setSubId] = useState<string | null>(null);

  async function fetchModels() {
    try {
      const res = await fetch("/api/admin/models");
      const data = (await res.json()) as { models?: Model[] };
      setModels(data.models ?? []);
    } catch { /* ignore */ }
  }

  async function fetchVariants() {
    setLoading(true); setError(null);
    try {
      const url = filterModelId ? `/api/admin/variants?modelId=${filterModelId}` : "/api/admin/variants";
      const res = await fetch(url);
      const data = (await res.json()) as { variants?: Variant[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to load");
      setVariants(data.variants ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load variants");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void fetchModels(); }, []);
  useEffect(() => { void fetchVariants(); }, [filterModelId]);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete variant "${name}"?`)) return;
    try {
      await fetch(`/api/admin/variants/${id}`, { method: "DELETE" });
      await fetchVariants();
    } catch { alert("Failed to delete variant"); }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Variants</h2>
          <p className="mt-1 text-sm text-slate-400">{variants.length} variant{variants.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={filterModelId} onChange={(e) => setFilterModelId(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 outline-none focus:border-amber-400"
          >
            <option value="">All Models</option>
            {models.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
          <button type="button"
            onClick={() => { setShowAdd((v) => !v); setEditId(null); }}
            className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-300"
          >
            <Plus className="h-4 w-4" />Add Variant
          </button>
        </div>
      </div>

      {showAdd && (
        <AddVariantForm
          models={models}
          onSaved={() => { setShowAdd(false); void fetchVariants(); }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : variants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/50 p-10 text-center">
          <p className="text-slate-400">No variants yet. Add your first variant above.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-700">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700 bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Variant</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300 hidden md:table-cell">Model</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300 hidden sm:table-cell">Fuel / Trans.</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Price</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 bg-slate-900">
              {variants.map((variant) => (
                <tr key={variant._id} className={editId === variant._id || subId === variant._id ? "bg-slate-800" : "hover:bg-slate-800/50"}>
                  {editId === variant._id ? (
                    <td className="px-4 py-4" colSpan={5}>
                      <EditVariantForm
                        key={variant._id}
                        variant={variant}
                        onSaved={() => { setEditId(null); void fetchVariants(); }}
                        onCancel={() => setEditId(null)}
                      />
                    </td>
                  ) : subId === variant._id ? (
                    <td className="px-4 py-4" colSpan={5}>
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
                      </td>
                      <td className="hidden px-4 py-3 text-slate-400 md:table-cell">{variant.modelName}</td>
                      <td className="hidden px-4 py-3 text-slate-400 sm:table-cell">{variant.fuel} / {variant.transmission}</td>
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
