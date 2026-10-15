"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { Brand, Model } from "../../lib/catalog-types";

export const BODY_TYPES = ["SUV", "Hatchback", "Sedan", "MPV", "Minivan", "Commercial", "Electric"];
const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Hybrid", "Electric"];
const TRANSMISSION_TYPES = ["Manual", "Automatic", "AMT", "CVT", "DCT", "iMT"];
const DRIVE_TYPES = ["", "FWD", "RWD", "AWD", "4WD"];
const SEGMENTS = ["", "Entry", "Compact", "Mid-size", "Premium", "Luxury", "Performance"];

const inputCls =
  "mt-1.5 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400";

type FormState = {
  brandId: string;
  name: string;
  slug: string;
  type: string;
  segment: string;
  drive: string;
  modelYear: string;
  priceMin: string;
  priceMax: string;
  fuels: string[];
  transmissions: string[];
  specs: string;
  overview: string;
  highlights: { title: string; description: string }[];
  length: string;
  width: string;
  height: string;
  wheelbase: string;
  seatingCapacity: string;
  doors: string;
  bootSpace: string;
  image: string;
  exteriorImages: string;
  interiorImages: string;
  brochureUrl: string;
  websiteUrl: string;
  launchDate: string;
  discontinued: boolean;
  published: boolean;
};

const lines = (v?: string[]) => (v ?? []).join("\n");
const num = (v?: number) => (v === undefined || v === null ? "" : String(v));
const splitLines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
const toNum = (s: string) => (s.trim() === "" ? undefined : Number(s));

function initialState(model: Model | undefined, brandId: string): FormState {
  return {
    brandId: model?.brandId ?? brandId,
    name: model?.name ?? "",
    slug: model?.slug ?? "",
    type: model?.type ?? "SUV",
    segment: model?.segment ?? "",
    drive: model?.drive ?? "",
    modelYear: num(model?.modelYear),
    priceMin: model ? String(model.priceMin) : "",
    priceMax: model ? String(model.priceMax) : "",
    fuels: model ? [...model.fuels] : ["Petrol"],
    transmissions: [...(model?.transmissions ?? [])],
    specs: model?.specs ?? "",
    overview: model?.overview ?? "",
    // Legacy plain-string highlights are dropped; only header + detail entries are kept.
    highlights: (model?.highlights ?? []).flatMap((h) =>
      typeof h === "string" ? [] : [{ title: h.title, description: h.description ?? "" }],
    ),
    length: num(model?.length),
    width: num(model?.width),
    height: num(model?.height),
    wheelbase: num(model?.wheelbase),
    seatingCapacity: num(model?.seatingCapacity),
    doors: num(model?.doors),
    bootSpace: num(model?.bootSpace),
    image: model?.image ?? "",
    exteriorImages: lines(model?.exteriorImages),
    interiorImages: lines(model?.interiorImages),
    brochureUrl: model?.brochureUrl ?? "",
    websiteUrl: model?.websiteUrl ?? "",
    launchDate: model?.launchDate ?? "",
    discontinued: model?.discontinued ?? false,
    published: model?.published ?? true,
  };
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-lg border border-slate-700 bg-slate-900/40 p-4">
      <legend className="px-2 text-xs font-bold uppercase tracking-widest text-amber-400">{title}</legend>
      {hint && <p className="mb-3 text-xs text-slate-500">{hint}</p>}
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-slate-300">
      {label}
      {children}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-300">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-amber-400" />
      {label}
    </label>
  );
}

type Props = {
  /** Existing model to edit; omit to create. */
  model?: Model;
  /** Create mode: fixed brand (brand page) or a list to choose from (global page). */
  brand?: { id: string; name: string; slug: string };
  brands?: Brand[];
  onSaved: () => void;
  onCancel: () => void;
};

export default function ModelForm({ model, brand, brands, onSaved, onCancel }: Props) {
  const [f, setF] = useState<FormState>(() => initialState(model, brand?.id ?? ""));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setF((prev) => ({ ...prev, [key]: value }));
  const text = (key: keyof FormState) => ({
    value: f[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      set(key, e.target.value as never),
  });

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const selected = brand ?? (() => {
        const b = brands?.find((x) => x._id === f.brandId);
        return b ? { id: b._id, name: b.name, slug: b.slug } : undefined;
      })();

      const body: Record<string, unknown> = {
        name: f.name.trim(),
        slug: f.slug.trim(),
        type: f.type,
        segment: f.segment,
        drive: f.drive,
        modelYear: toNum(f.modelYear),
        fuels: f.fuels,
        transmissions: f.transmissions,
        priceMin: parseFloat(f.priceMin),
        priceMax: parseFloat(f.priceMax),
        specs: f.specs.trim(),
        overview: f.overview,
        highlights: f.highlights.filter((h) => h.title.trim()),
        length: toNum(f.length),
        width: toNum(f.width),
        height: toNum(f.height),
        wheelbase: toNum(f.wheelbase),
        seatingCapacity: toNum(f.seatingCapacity),
        doors: toNum(f.doors),
        bootSpace: toNum(f.bootSpace),
        image: f.image,
        exteriorImages: splitLines(f.exteriorImages),
        interiorImages: splitLines(f.interiorImages),
        brochureUrl: f.brochureUrl,
        websiteUrl: f.websiteUrl,
        launchDate: f.launchDate,
        discontinued: f.discontinued,
        published: f.published,
      };
      if (!model) {
        body.brandId = selected?.id ?? "";
        body.brandSlug = selected?.slug ?? "";
        body.brandName = selected?.name ?? "";
      }

      const res = await fetch(model ? `/api/admin/models/${model._id}` : "/api/admin/models", {
        method: model ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) { setError(data.error ?? "Failed to save"); return; }
      onSaved();
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  }

  const brandName = model?.brandName ?? brand?.name;

  return (
    <div className={`rounded-xl border bg-slate-800 p-5 ${model ? "border-amber-400/30" : "mb-6 border-slate-700"}`}>
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-amber-400">
        {model ? `Editing: ${model.name}` : "New Model"}
        {brandName && <span className="ml-2 font-normal normal-case tracking-normal text-slate-400">Brand: <strong className="text-white">{brandName}</strong></span>}
      </p>

      <div className="space-y-4">
        <Section title="Basic information">
          <div className="grid gap-4 sm:grid-cols-2">
            {!model && !brand && (
              <Field label="Brand *">
                <select {...text("brandId")} className={inputCls}>
                  <option value="">Select brand</option>
                  {brands?.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </Field>
            )}
            <Field label="Model Name *">
              <input {...text("name")} placeholder="e.g. Maruti Suzuki Brezza" className={inputCls} />
            </Field>
            <Field label="Slug">
              <input {...text("slug")} placeholder="auto-generated from name" className={inputCls} />
            </Field>
            <Field label="Body Type *">
              <select {...text("type")} className={inputCls}>
                {BODY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Segment">
              <select {...text("segment")} className={inputCls}>
                {SEGMENTS.map((s) => <option key={s} value={s}>{s || "—"}</option>)}
              </select>
            </Field>
            <Field label="Drive">
              <select {...text("drive")} className={inputCls}>
                {DRIVE_TYPES.map((d) => <option key={d} value={d}>{d || "—"}</option>)}
              </select>
            </Field>
            <Field label="Model Year">
              <input {...text("modelYear")} type="number" min="1900" max="2100" placeholder="2025" className={inputCls} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price Min (Lakh) *">
              <input {...text("priceMin")} type="number" step="0.01" min="0" placeholder="7.50" className={inputCls} />
            </Field>
            <Field label="Price Max (Lakh) *">
              <input {...text("priceMax")} type="number" step="0.01" min="0" placeholder="13.71" className={inputCls} />
            </Field>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-300">Fuel Types *</p>
            <div className="flex flex-wrap gap-2">
              {FUEL_TYPES.map((fuel) => (
                <button key={fuel} type="button"
                  onClick={() => set("fuels", f.fuels.includes(fuel) ? f.fuels.filter((x) => x !== fuel) : [...f.fuels, fuel])}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    f.fuels.includes(fuel)
                      ? "bg-amber-400 text-slate-950"
                      : "border border-slate-600 text-slate-400 hover:border-amber-400 hover:text-amber-400"
                  }`}
                >
                  {fuel}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-300">Transmission</p>
            <div className="flex flex-wrap gap-2">
              {TRANSMISSION_TYPES.map((t) => (
                <button key={t} type="button"
                  onClick={() => set("transmissions", f.transmissions.includes(t) ? f.transmissions.filter((x) => x !== t) : [...f.transmissions, t])}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    f.transmissions.includes(t)
                      ? "bg-amber-400 text-slate-950"
                      : "border border-slate-600 text-slate-400 hover:border-amber-400 hover:text-amber-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Field label="Specs * (e.g. 1462 cc · 109 bhp · 19.8 kmpl)">
            <input {...text("specs")} placeholder="1462 cc · 109 bhp · 19.8 kmpl" className={inputCls} />
          </Field>
        </Section>

        <Section title="Description">
          <Field label="Overview">
            <textarea {...text("overview")} rows={4} placeholder="Short introduction to the model" className={inputCls} />
          </Field>
          <div>
            <p className="text-sm font-semibold text-slate-300">Highlights</p>
            <p className="mt-0.5 text-xs text-slate-500">Each highlight has a bold header and a short detail line.</p>
            <div className="mt-3 space-y-3">
              {f.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg border border-slate-700 bg-slate-900 p-3">
                  <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_2fr]">
                    <input
                      value={h.title}
                      onChange={(e) => set("highlights", f.highlights.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                      placeholder="Header, e.g. Bold SUV Design"
                      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-semibold text-white placeholder:font-normal placeholder:text-slate-500 outline-none focus:border-amber-400"
                    />
                    <input
                      value={h.description}
                      onChange={(e) => set("highlights", f.highlights.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))}
                      placeholder="Detail, e.g. Stylish exterior design with a confident SUV stance."
                      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
                    />
                  </div>
                  <button type="button" aria-label="Remove highlight"
                    onClick={() => set("highlights", f.highlights.filter((_, j) => j !== i))}
                    className="rounded-lg border border-slate-700 p-2 text-slate-400 hover:border-red-500 hover:text-red-400">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button"
              onClick={() => set("highlights", [...f.highlights, { title: "", description: "" }])}
              className="mt-3 rounded-lg border border-dashed border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-amber-400 hover:text-amber-400">
              + Add highlight
            </button>
          </div>
        </Section>

        <Section title="Dimensions (mm)">
          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="Length"><input {...text("length")} type="number" min="0" placeholder="3995" className={inputCls} /></Field>
            <Field label="Width"><input {...text("width")} type="number" min="0" placeholder="1790" className={inputCls} /></Field>
            <Field label="Height"><input {...text("height")} type="number" min="0" placeholder="1685" className={inputCls} /></Field>
            <Field label="Wheelbase"><input {...text("wheelbase")} type="number" min="0" placeholder="2500" className={inputCls} /></Field>
          </div>
        </Section>

        <Section title="Capacity">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Seating capacity"><input {...text("seatingCapacity")} type="number" min="1" placeholder="5" className={inputCls} /></Field>
            <Field label="Number of doors"><input {...text("doors")} type="number" min="1" placeholder="5" className={inputCls} /></Field>
            <Field label="Boot space (litres)"><input {...text("bootSpace")} type="number" min="0" placeholder="328" className={inputCls} /></Field>
          </div>
        </Section>

        <Section title="Images" hint="Image URLs or /public paths. Galleries: one URL per line.">
          <Field label="Main image">
            <input {...text("image")} placeholder="/carImages/model.png" className={inputCls} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Exterior gallery">
              <textarea {...text("exteriorImages")} rows={4} placeholder="/carImages/ext-1.png" className={inputCls} />
            </Field>
            <Field label="Interior gallery">
              <textarea {...text("interiorImages")} rows={4} placeholder="/carImages/int-1.png" className={inputCls} />
            </Field>
          </div>
        </Section>

        <Section title="Documents">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Model brochure PDF">
              <input {...text("brochureUrl")} placeholder="/brochures/model.pdf" className={inputCls} />
            </Field>
            <Field label="Official website URL">
              <input {...text("websiteUrl")} type="url" placeholder="https://www.example.com/model" className={inputCls} />
            </Field>
          </div>
        </Section>

        <Section title="Metadata">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Generation / launch date">
              <input {...text("launchDate")} type="date" className={inputCls} />
            </Field>
            <div className="flex items-end pb-2"><Toggle label="Discontinued" checked={f.discontinued} onChange={(v) => set("discontinued", v)} /></div>
            <div className="flex items-end pb-2"><Toggle label="Active / published" checked={f.published} onChange={(v) => set("published", v)} /></div>
          </div>
        </Section>

        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      <div className="mt-4 flex gap-2">
        <button type="button" onClick={handleSubmit} disabled={loading}
          className="flex items-center gap-1 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50">
          <Check className="h-3.5 w-3.5" />{loading ? "Saving..." : model ? "Save" : "Save Model"}
        </button>
        <button type="button" onClick={onCancel}
          className="flex items-center gap-1 rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-slate-400">
          <X className="h-3.5 w-3.5" />Cancel
        </button>
      </div>
    </div>
  );
}
