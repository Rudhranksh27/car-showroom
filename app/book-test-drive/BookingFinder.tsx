import Link from "next/link";
import { CarFront } from "lucide-react";
import type { WithId } from "mongodb";
import { getModelsCollection, getVariantsCollection } from "../lib/mongodb-catalog";
import type { ModelDoc, VariantDoc } from "../lib/catalog-types";
import { splitOptions } from "../lib/variant-options";
import { fullCarName } from "../lib/sub-variants";

export type FinderFilters = { brand?: string; type?: string; fuel?: string; transmission?: string; budget?: string };

// Budget buckets in lakh; `budget` in the URL is "min-max" (max empty = no upper limit).
const BUDGETS = [
  { label: "Under ₹8L", value: "0-8" },
  { label: "₹8 – 12L", value: "8-12" },
  { label: "₹12 – 20L", value: "12-20" },
  { label: "₹20L+", value: "20-" },
];

type Item = {
  model: WithId<ModelDoc>;
  variant: WithId<VariantDoc>;
  fuels: string[];
  transmissions: string[];
  price: number | null; // lakh
};

const same = (a?: string, b?: string) => !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();
const unique = (values: string[]) => [...new Set(values.filter(Boolean))];

/** "₹11.2 Lakh*", "10.55 L" or "1.2 Cr" → lakh as a number. */
function parseLakh(price: string): number | null {
  const n = parseFloat(price.replace(/,/g, "").match(/\d+(\.\d+)?/)?.[0] ?? "");
  if (Number.isNaN(n)) return null;
  return /cr/i.test(price) ? n * 100 : n;
}

function inBudget(price: number | null, budget?: string) {
  if (!budget) return true;
  const [min, max] = budget.split("-");
  if (price === null) return false;
  return price >= (parseFloat(min) || 0) && (max === "" || max === undefined || price <= parseFloat(max));
}

export default async function BookingFinder({ filters, modelSlug }: { filters: FinderFilters; modelSlug?: string }) {
  let items: Item[] = [];
  try {
    const [models, variants] = await Promise.all([
      (await getModelsCollection()).find({ published: { $ne: false } }).toArray(),
      (await getVariantsCollection()).find({}).sort({ createdAt: 1 }).toArray(),
    ]);
    const byId = new Map(models.map((m) => [m._id.toString(), m]));
    items = variants.flatMap((variant) => {
      const model = byId.get(variant.modelId);
      if (!model) return [];
      const subs = variant.subVariants ?? [];
      return [{
        model,
        variant,
        fuels: unique([...splitOptions(variant.fuel), ...subs.flatMap((s) => splitOptions(s.fuel))]),
        transmissions: unique([...splitOptions(variant.transmission), ...subs.flatMap((s) => splitOptions(s.transmission))]),
        price: parseLakh(variant.price),
      }];
    });
  } catch {
    items = [];
  }

  type Facet = keyof FinderFilters;
  const matches = (it: Item, skip?: Facet) =>
    (skip === "brand" || !filters.brand || it.model.brandSlug === filters.brand) &&
    (skip === "type" || !filters.type || same(it.model.type, filters.type)) &&
    (skip === "fuel" || !filters.fuel || it.fuels.some((f) => same(f, filters.fuel))) &&
    (skip === "transmission" || !filters.transmission || it.transmissions.some((t) => same(t, filters.transmission))) &&
    (skip === "budget" || inBudget(it.price, filters.budget)) &&
    (!modelSlug || it.model.slug === modelSlug);

  const results = items.filter((it) => matches(it));

  // Each filter lists only options that still leave results once the other filters are applied (no dead ends).
  const pool = (facet: Facet) => items.filter((it) => matches(it, facet));
  const brandOptions = [...new Map(pool("brand").map((it) => [it.model.brandSlug, it.model.brandName])).entries()].sort((a, b) => a[1].localeCompare(b[1]));
  const typeOptions = unique(pool("type").map((it) => it.model.type)).sort();
  const fuelOptions = unique(pool("fuel").flatMap((it) => it.fuels)).sort();
  const transmissionOptions = unique(pool("transmission").flatMap((it) => it.transmissions)).sort();
  const budgetOptions = BUDGETS.filter((b) => pool("budget").some((it) => inBudget(it.price, b.value)));

  const hrefWith = (patch: Partial<FinderFilters>) => {
    const next = { ...filters, ...patch };
    const params = new URLSearchParams();
    (Object.keys(next) as Facet[]).forEach((k) => { if (next[k]) params.set(k, next[k]!); });
    return `/book-test-drive${params.size ? `?${params.toString()}` : ""}#results`;
  };
  // Picking a car goes straight to its booking form, keeping the filters that led here.
  const bookHref = (it: Item) => {
    const params = new URLSearchParams({ model: it.model.slug, variant: it.variant.name });
    if (filters.fuel) params.set("fuel", filters.fuel);
    if (filters.transmission) params.set("transmission", filters.transmission);
    return `/book-test-drive?${params.toString()}#book`;
  };

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-semibold transition ${
      active ? "border-[#0b3d32] bg-[#0b3d32] text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
    }`;
  const hasFilters = !!(filters.brand || filters.type || filters.fuel || filters.transmission || filters.budget);

  const groups: { label: string; facet: Facet; options: { key: string; label: string }[] }[] = [
    { label: "Brand", facet: "brand", options: brandOptions.map(([key, label]) => ({ key, label })) },
    { label: "Body type", facet: "type", options: typeOptions.map((t) => ({ key: t, label: t })) },
    { label: "Fuel", facet: "fuel", options: fuelOptions.map((f) => ({ key: f, label: f })) },
    { label: "Transmission", facet: "transmission", options: transmissionOptions.map((t) => ({ key: t, label: t })) },
    { label: "Budget", facet: "budget", options: budgetOptions.map((b) => ({ key: b.value, label: b.label })) },
  ];

  return (
    <>
      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold tracking-[-0.01em]">Find your car</h2>
          {hasFilters && (
            <Link href="/book-test-drive#results" className="text-sm font-bold text-[#0b3d32] hover:underline">Clear filters</Link>
          )}
        </div>
        <p className="mt-1 text-base text-slate-600">Pick what matters to you. Only options that match your other choices are shown.</p>
        <div className="mt-5 space-y-5">
          {groups.filter((g) => g.options.length > 0).map((g) => (
            <div key={g.facet}>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{g.label}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {g.options.map((o) => {
                  const active = same(filters[g.facet], o.key);
                  return (
                    <Link key={o.key} href={hrefWith({ [g.facet]: active ? undefined : o.key })} aria-pressed={active} className={chip(active)}>
                      {o.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <section id="results" className="mt-12 scroll-mt-24">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Available for test drive</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">
          {results.length} car{results.length === 1 ? "" : "s"} match{results.length === 1 ? "es" : ""}
        </h2>

        {results.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-lg text-slate-600">No car matches these filters.</p>
            <Link href="/book-test-drive#results" className="mt-4 inline-block text-base font-bold text-[#0b3d32] hover:underline">Clear filters →</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((it) => (
              <Link
                key={it.variant._id.toString()}
                href={bookHref(it)}
                className="group flex flex-col items-start overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/60"
              >
                <div className="flex aspect-[1.6] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-200 p-6">
                  {it.model.image ? (
                    <img src={it.model.image} alt={it.model.name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <CarFront className="h-16 w-16 text-slate-300" strokeWidth={1} />
                  )}
                </div>
                <div className="w-full px-6 pt-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">{it.model.brandName} · {it.model.type}</p>
                  <h3 className="mt-1 text-xl font-extrabold tracking-[-0.01em] text-slate-900">
                    {fullCarName(it.model.name, it.variant.name)}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {/* A chosen fuel / transmission shows alone, not every option the variant also offers. */}
                    {[
                      filters.fuel ? it.fuels.filter((f) => same(f, filters.fuel)) : it.fuels,
                      filters.transmission ? it.transmissions.filter((t) => same(t, filters.transmission)) : it.transmissions,
                    ].map((list) => list.join(" / ")).filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="mt-4 flex w-full items-center justify-between gap-4 px-6 pb-6">
                  <span className="text-lg font-extrabold text-slate-900">{it.variant.price}</span>
                  <span className="inline-flex items-center rounded-full bg-[#0b3d32] px-4 py-2 text-sm font-bold text-white transition group-hover:bg-[#082d25]">Book test drive →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
