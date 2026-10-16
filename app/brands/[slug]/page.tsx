import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CarFront } from "lucide-react";
import type { WithId } from "mongodb";
import Navbar from "../../components/Navbar";
import { getBrandsCollection, getModelsCollection } from "../../lib/mongodb-catalog";
import type { BrandDoc } from "../../lib/catalog-types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export default async function BrandPage({ params }: Params) {
  const { slug } = await params;

  let brand: WithId<BrandDoc> | null = null;
  try {
    const brandsCol = await getBrandsCollection();
    brand = await brandsCol.findOne({ slug });
  } catch {
    notFound();
  }
  if (!brand) notFound();

  const modelsCol = await getModelsCollection();
  const models = await modelsCol
    .find({ brandId: brand._id!.toString(), published: { $ne: false } })
    .sort({ priceMin: 1 })
    .toArray();

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Brand header */}
        <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-5">
            {brand.logo ? (
              <img src={brand.logo} alt={`${brand.name} logo`} className="h-20 w-20 shrink-0 rounded-2xl bg-slate-50 object-contain p-2 ring-1 ring-slate-200" />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                <CarFront className="h-9 w-9 text-slate-400" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Explore the range</p>
              <h1 className="mt-2 text-4xl font-black tracking-[-0.03em] text-slate-900 md:text-5xl">{brand.name}</h1>
              {brand.established && (
                <p className="mt-2 text-base text-slate-500">Established since {brand.established}</p>
              )}
            </div>
          </div>
          {models.length > 0 && (
            <div className="rounded-2xl bg-[#0b3d32] px-6 py-4 text-center text-white">
              <p className="text-3xl font-black">{models.length}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100/80">
                Model{models.length !== 1 ? "s" : ""} available
              </p>
            </div>
          )}
        </section>

        {/* Models grid */}
        <section className="mt-10">
          {models.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">No models available yet</h2>
              <p className="mt-2 text-base text-slate-500">Check back soon for {brand.name} models.</p>
            </div>
          ) : (
            <>
              <h2 className="mb-6 text-2xl font-black tracking-[-0.02em] text-slate-900">
                All {brand.name} models
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {models.map((model) => (
                  <article
                    key={model._id!.toString()}
                    className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
                  >
                    <Link href={`/cars/${model.slug}`} className="relative flex aspect-4/3 items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-6">
                      {model.image ? (
                        <img src={model.image} alt={model.name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                      ) : (
                        <CarFront className="h-24 w-24 text-slate-300" strokeWidth={1.2} />
                      )}
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0b3d32] shadow-sm">
                        {model.type}
                      </span>
                    </Link>
                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {model.fuels.join(" / ")}
                      </p>
                      <h3 className="mt-2 text-2xl font-black tracking-[-0.02em] text-slate-900">{model.name}</h3>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Ex-showroom price</p>
                      <p className="mt-1 text-xl font-black text-[#0b3d32]">
                        ₹{model.priceMin.toFixed(2)} – {model.priceMax.toFixed(2)} Lakh*
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-500">{model.specs}</p>
                      <Link
                        href={`/cars/${model.slug}`}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0b3d32] px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-[#0b3d32]/20 transition hover:bg-[#1a8978]"
                      >
                        View Details
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              <p className="mt-6 text-xs text-slate-400">*Prices are indicative and may vary by location and variant.</p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
