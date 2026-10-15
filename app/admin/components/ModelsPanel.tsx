"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Brand, Model } from "../../lib/catalog-types";
import ModelForm from "./ModelForm";

export default function ModelsPanel() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [filterBrandId, setFilterBrandId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  async function fetchBrands() {
    try {
      const res = await fetch("/api/admin/brands");
      const data = (await res.json()) as { brands?: Brand[] };
      setBrands(data.brands ?? []);
    } catch { /* ignore */ }
  }

  async function fetchModels() {
    setLoading(true); setError(null);
    try {
      const url = filterBrandId ? `/api/admin/models?brandId=${filterBrandId}` : "/api/admin/models";
      const res = await fetch(url);
      const data = (await res.json()) as { models?: Model[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to load");
      setModels(data.models ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load models");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void fetchBrands(); }, []);
  useEffect(() => { void fetchModels(); }, [filterBrandId]);

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete model "${name}"? This does not delete its variants.`)) return;
    try {
      await fetch(`/api/admin/models/${id}`, { method: "DELETE" });
      await fetchModels();
    } catch { alert("Failed to delete model"); }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Models</h2>
          <p className="mt-1 text-sm text-slate-400">{models.length} model{models.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={filterBrandId} onChange={(e) => setFilterBrandId(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 outline-none focus:border-amber-400"
          >
            <option value="">All Brands</option>
            {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
          <button type="button"
            onClick={() => { setShowAdd((v) => !v); setEditId(null); }}
            className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-300"
          >
            <Plus className="h-4 w-4" />Add Model
          </button>
        </div>
      </div>

      {showAdd && (
        <ModelForm
          brands={brands}
          onSaved={() => { setShowAdd(false); void fetchModels(); }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : models.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/50 p-10 text-center">
          <p className="text-slate-400">No models yet. Add your first model above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {models.map((model) => (
            <div key={model._id}>
              {editId === model._id ? (
                <ModelForm
                  key={model._id}
                  model={model}
                  onSaved={() => { setEditId(null); void fetchModels(); }}
                  onCancel={() => setEditId(null)}
                />
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 hover:border-slate-600">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white">{model.name}</h3>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">{model.type}</span>
                      {model.fuels.map((f) => (
                        <span key={f} className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">{f}</span>
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {model.brandName} · ₹{model.priceMin.toFixed(2)} - {model.priceMax.toFixed(2)} Lakh
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">{model.specs}</p>
                  </div>
                  <div className="ml-4 flex shrink-0 gap-2">
                    <button type="button" onClick={() => { setEditId(model._id); setShowAdd(false); }}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-amber-400 hover:text-amber-400">
                      <Pencil className="h-3.5 w-3.5" />Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(model._id, model.name)}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-red-500 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
