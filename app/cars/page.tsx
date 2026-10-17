import Link from "next/link";
import { CarFront } from "lucide-react";
import Navbar from "../components/Navbar";
import { getModelsCollection } from "../lib/mongodb-catalog";
import type { ModelDoc } from "../lib/catalog-types";
import type { WithId } from "mongodb";
import CarsFilters from "./CarsFilters";

export const dynamic = "force-dynamic";

type CarsPageProps = {
  searchParams: Promise<{ brand?: string; type?: string; fuel?: string; budget?: string; search?: string }>;
};

const escapeRegex = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const filters = await searchParams;
  const brandSlug = filters.brand ? filters.brand.toLowerCase().trim().replace(/\s+/g, "-") : undefined;

  let models: WithId<ModelDoc>[] = [];
  let fuelTypes: string[] = [];
  let bodyTypes: string[] = [];

  try {
    const col = await getModelsCollection();

    // Filter options only list what the (brand's) published models actually have.
    const scope: Record<string, unknown> = { published: { $ne: false } };
    if (brandSlug) scope.brandSlug = brandSlug;
    const [rawFuels, rawTypes] = await Promise.all([col.distinct("fuels", scope), col.distinct("type", scope)]);
    fuelTypes = (rawFuels as string[]).filter(Boolean).sort();
    bodyTypes = (rawTypes as string[]).filter(Boolean).sort();

    const query: Record<string, unknown> = { ...scope };
    if (filters.type && filters.type.toLowerCase() !== "all") query.type = filters.type;
    if (filters.fuel) query.fuels = filters.fuel;
    if (filters.budget) {
      const max = parseFloat(filters.budget);
      if (!isNaN(max)) query.priceMin = { $lte: max };
    }

    const allModels = await col.find(query).sort({ priceMin: 1 }).toArray();

    if (filters.search) {
      const regex = new RegExp(escapeRegex(filters.search), "i");
      models = allModels.filter((m) => regex.test(m.name) || regex.test(m.brandName) || regex.test(m.type));
    } else {
      models = allModels;
    }
  } catch {
    models = [];
  }

  const brandName = models[0]?.brandName ?? filters.brand?.replace(/-/g, " ");
  const heading = brandName
    ? `${brandName} cars`
    : filters.type && filters.type.toLowerCase() !== "all"
      ? `${filters.type} cars`
      : "Available cars";

  return (
    <main className="min-h-screen bg-[#f3f3f3] font-[family-name:var(--font-jakarta)] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">VirtualDrive inventory</p>
        <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-extrabold tracking-[-0.03em] md:text-5xl">{heading}</h1>
            <p className="mt-3 text-lg text-slate-600">
              {models.length} vehicle{models.length !== 1 ? "s" : ""} available
              {filters.brand && (
                <>
                  {" · "}
                  <Link href="/cars" className="font-bold text-[#0b3d32] hover:underline">All brands</Link>
                </>
              )}
            </p>
          </div>
          <Link href="/book-test-drive" className="w-fit rounded-full bg-[#0b3d32] px-6 py-3 text-base font-bold text-white transition hover:bg-[#082d25]">
            Book test drive
          </Link>
        </div>

        <CarsFilters
          fuelTypes={fuelTypes}
          bodyTypes={bodyTypes}
          currentBrand={filters.brand ?? ""}
          currentFuel={filters.fuel ?? ""}
          currentType={filters.type ?? ""}
          currentBudget={filters.budget ?? ""}
        />

        {models.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="text-2xl font-extrabold">No cars found</h2>
            <p className="mt-2 text-base text-slate-600">Try adjusting your filters or check back after the admin adds inventory.</p>
            <Link href="/cars" className="mt-4 inline-block text-base font-bold text-[#0b3d32] hover:underline">Clear all filters →</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => {
              const price =
                model.priceMax > model.priceMin
                  ? `₹${model.priceMin.toFixed(2)} – ${model.priceMax.toFixed(2)} Lakh*`
                  : `₹${model.priceMin.toFixed(2)} Lakh*`;
              const facts = [
                model.modelYear ? String(model.modelYear) : "",
                model.seatingCapacity ? `${model.seatingCapacity} seats` : "",
                model.transmissions?.length ? model.transmissions.join(" / ") : "",
              ].filter(Boolean);
              return (
                <article
                  key={model._id.toString()}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/60"
                >
                  <Link href={`/cars/${model.slug}`} className="relative flex aspect-[1.6] items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-6">
                    {model.image ? (
                      <img src={model.image} alt={model.name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <CarFront className="h-16 w-16 text-slate-300" strokeWidth={1} />
                    )}
                    {model.discontinued && (
                      <span className="absolute left-4 top-4 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">Discontinued</span>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">
                      {model.brandName} · {model.type}
                    </p>
                    <h2 className="mt-2 text-xl font-extrabold tracking-[-0.01em]">
                      <Link href={`/cars/${model.slug}`} className="transition-colors hover:text-[#0b3d32]">{model.name}</Link>
                    </h2>
                    <p className="mt-2 text-lg font-extrabold text-[#0b3d32]">{price}</p>
                    {model.fuels.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {model.fuels.map((f) => (
                          <span key={f} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{f}</span>
                        ))}
                      </div>
                    )}
                    {facts.length > 0 && <p className="mt-3 text-base text-slate-600">{facts.join(" · ")}</p>}
                    <div className="mt-auto pt-5">
                      <Link
                        href={`/cars/${model.slug}`}
                        className="inline-flex w-full items-center justify-center rounded-full bg-[#0b3d32] px-5 py-3.5 text-base font-bold text-white transition hover:bg-[#082d25]"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
