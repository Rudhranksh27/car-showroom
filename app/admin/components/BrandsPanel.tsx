"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X, ChevronRight } from "lucide-react";
import type { Brand } from "../../lib/catalog-types";

type FormState = {
  name: string; logo: string; established: string;
  soldThisYear: string; soldThisMonth: string; serviceCenters: string;
};
const emptyForm: FormState = { name: "", logo: "", established: "", soldThisYear: "", soldThisMonth: "", serviceCenters: "" };

function BrandFormFields({
  form,
  setForm,
  err,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  err: string | null;
}) {
  return (
    <div>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-semibold text-slate-300">
          Brand Name *
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Maruti Suzuki"
            className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-300">
          Logo URL (optional)
          <input
            value={form.logo}
            onChange={(e) => setForm({ ...form, logo: e.target.value })}
            placeholder="https://… or /logos/brand.png"
            className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
          />
          <span className="mt-1 block text-[11px] font-normal text-slate-500">
            Use a https:// URL or place the file in <code className="text-slate-400">public/</code> and enter its path (e.g. /logos/maruti.png)
          </span>
        </label>
        <label className="block text-sm font-semibold text-slate-300">
          Established (optional)
          <input
            value={form.established}
            onChange={(e) => setForm({ ...form, established: e.target.value })}
            placeholder="e.g. 1981"
            className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
          />
        </label>
      </div>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">Statistics (optional)</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-semibold text-slate-300">
          Sold This Year
          <input
            type="number" min="0"
            value={form.soldThisYear}
            onChange={(e) => setForm({ ...form, soldThisYear: e.target.value })}
            placeholder="e.g. 45000"
            className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-300">
          Sold This Month
          <input
            type="number" min="0"
            value={form.soldThisMonth}
            onChange={(e) => setForm({ ...form, soldThisMonth: e.target.value })}
            placeholder="e.g. 3800"
            className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-300">
          Service Centers
          <input
            type="number" min="0"
            value={form.serviceCenters}
            onChange={(e) => setForm({ ...form, serviceCenters: e.target.value })}
            placeholder="e.g. 120"
            className="mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
          />
        </label>
      </div>
      {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
    </div>
  );
}

export default function BrandsPanel() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<FormState>(emptyForm);
  const [addError, setAddError] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [editError, setEditError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  async function fetchBrands() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/brands");
      const data = (await res.json()) as { brands?: Brand[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to load");
      setBrands(data.brands ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load brands");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void fetchBrands(); }, []);

  async function handleAdd() {
    setAddError(null);
    setAddLoading(true);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) { setAddError(data.error ?? "Failed to add"); return; }
      setAddForm(emptyForm);
      setShowAdd(false);
      await fetchBrands();
    } catch {
      setAddError("Network error");
    } finally {
      setAddLoading(false);
    }
  }

  async function handleEdit() {
    if (!editId) return;
    setEditError(null);
    setEditLoading(true);
    try {
      const res = await fetch(`/api/admin/brands/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) { setEditError(data.error ?? "Failed to update"); return; }
      setEditId(null);
      await fetchBrands();
    } catch {
      setEditError("Network error");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete brand "${name}"? This does not delete its models.`)) return;
    try {
      await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
      await fetchBrands();
    } catch {
      alert("Failed to delete brand");
    }
  }

  function startEdit(brand: Brand) {
    setEditId(brand._id);
    setEditForm({
      name: brand.name, logo: brand.logo ?? "", established: brand.established ?? "",
      soldThisYear: brand.soldThisYear != null ? String(brand.soldThisYear) : "",
      soldThisMonth: brand.soldThisMonth != null ? String(brand.soldThisMonth) : "",
      serviceCenters: brand.serviceCenters != null ? String(brand.serviceCenters) : "",
    });
    setEditError(null);
    setShowAdd(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Brands</h2>
          <p className="mt-1 text-sm text-slate-400">{brands.length} brand{brands.length !== 1 ? "s" : ""} total</p>
        </div>
        <button
          type="button"
          onClick={() => { setShowAdd((v) => !v); setEditId(null); }}
          className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-300"
        >
          <Plus className="h-4 w-4" />
          Add Brand
        </button>
      </div>

      {showAdd && (
        <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-amber-400">New Brand</h3>
          <BrandFormFields form={addForm} setForm={setAddForm} err={addError} />
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleAdd}
              disabled={addLoading}
              className="rounded-lg bg-amber-400 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50"
            >
              {addLoading ? "Saving..." : "Save Brand"}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-lg border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-300 hover:border-slate-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : brands.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/50 p-10 text-center">
          <p className="text-slate-400">No brands yet. Add your first brand above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {brands.map((brand) => (
            <div key={brand._id}>
              {editId === brand._id ? (
                <div className="rounded-xl border border-amber-400/30 bg-slate-800 p-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-400">Editing: {brand.name}</p>
                  <BrandFormFields form={editForm} setForm={setEditForm} err={editError} />
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={handleEdit}
                      disabled={editLoading}
                      className="flex items-center gap-1 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" />{editLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="flex items-center gap-1 rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-400"
                    >
                      <X className="h-3.5 w-3.5" />Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 hover:border-slate-600">
                  <div className="flex items-center gap-4 min-w-0">
                    {brand.logo && (
                      <img src={brand.logo} alt="" className="h-10 w-10 shrink-0 rounded-lg bg-slate-800 object-contain p-1" />
                    )}
                    <div>
                      <p className="font-bold text-white">{brand.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{brand.slug}{brand.established ? ` · est. ${brand.established}` : ""}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(brand)}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-amber-400 hover:text-amber-400"
                    >
                      <Pencil className="h-3.5 w-3.5" />Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(brand._id, brand.name)}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />Delete
                    </button>
                    <Link
                      href={`/admin/brands/${brand._id}`}
                      className="flex items-center gap-1 rounded-lg bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-400/20"
                    >
                      Manage Models <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
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
