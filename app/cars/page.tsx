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

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const filters = await searchParams;

  let models: WithId<ModelDoc>[] = [];
  let fuelTypes: string[] = [];
  let bodyTypes: string[] = [];

  try {
    const col = await getModelsCollection();

    // Get distinct fuel types and body types for filter options
    const [rawFuels, rawTypes] = await Promise.all([
      col.distinct("fuels"),
      col.distinct("type"),
    ]);
    fuelTypes = (rawFuels as string[]).sort();
    bodyTypes = (rawTypes as string[]).sort();

    // Build query
    const query: Record<string, unknown> = { published: { $ne: false } };
    if (filters.brand) query.brandSlug = filters.brand.toLowerCase().replace(/\s+/g, "-");
    if (filters.type && filters.type.toLowerCase() !== "all") query.type = filters.type;
    if (filters.fuel) query.fuels = filters.fuel;
    if (filters.budget) {
      const max = parseFloat(filters.budget);
      if (!isNaN(max)) query.priceMin = { $lte: max };
    }

    const allModels = await col.find(query).sort({ priceMin: 1 }).toArray();

    if (filters.search) {
      const regex = new RegExp(filters.search, "i");
      models = allModels.filter(
        (m) => regex.test(m.name) || regex.test(m.brandName) || regex.test(m.type),
      );
    } else {
      models = allModels;
    }
  } catch {
    models = [];
  }

  const heading = filters.brand
    ? `${filters.brand.replace(/-/g, " ")} cars`
    : filters.type && filters.type.toLowerCase() !== "all"
    ? `${filters.type} cars`
    : "Available cars";

  return (
    <main className="min-h-screen bg-[#f6f8fa] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">VirtualDrive inventory</p>
        <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-[-0.04em] capitalize">{heading}</h1>
            <p className="mt-3 text-slate-500">{models.length} vehicle{models.length !== 1 ? "s" : ""} available</p>
          </div>
          <Link href="/book-test-drive" className="w-fit rounded-full bg-[#0b3d32] px-5 py-3 text-sm font-bold text-white hover:bg-[#082d25]">
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
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-xl font-bold">No cars found</h2>
            <p className="mt-2 text-sm text-slate-500">Try adjusting your filters or check back after the admin adds inventory.</p>
            <Link href="/cars" className="mt-4 inline-block font-semibold text-sky-600">Clear all filters →</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <article key={model._id.toString()} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md">
                <Link href={`/cars/${model.slug}`} className="flex aspect-16/10 items-center justify-center bg-slate-100 p-5">
                  {model.image ? (
                    <img src={model.image} alt={model.name} className="h-full w-full object-contain" />
                  ) : (
                    <CarFront className="h-16 w-16 text-slate-300" strokeWidth={1} />
                  )}
                </Link>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {model.brandName} · {model.type}
                  </p>
                  <h2 className="mt-2 text-lg font-bold">
                    <Link href={`/cars/${model.slug}`} className="hover:text-sky-600">{model.name}</Link>
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    ₹{model.priceMin.toFixed(2)} – {model.priceMax.toFixed(2)} Lakh*
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{model.fuels.join(" / ")}</p>
                  <Link
                    href={`/cars/${model.slug}`}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#0b3d32] px-4 py-3 text-sm font-bold text-white hover:bg-[#082d25]"
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
