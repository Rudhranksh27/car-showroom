import { notFound } from "next/navigation";
import Link from "next/link";
import { CarFront } from "lucide-react";
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
      <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-10">

        {/* Brand header */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {brand.logo ? (
              <img src={brand.logo} alt={`${brand.name} logo`} className="h-16 w-16 shrink-0 rounded-2xl bg-white object-contain p-1 shadow-md" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md">
                <CarFront className="h-8 w-8 text-slate-400" />
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">Explore the range</p>
              <h1 className="mt-1 text-3xl font-black text-slate-950 sm:text-4xl">{brand.name}</h1>
              {brand.established && (
                <p className="mt-1 text-sm text-slate-500">Established since {brand.established}</p>
              )}
            </div>
          </div>
        </section>

        {/* Models grid */}
        <section className="mt-10">
          {models.length === 0 ? (
            <div className="rounded-2xl bg-white p-14 text-center shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">No models available yet</h2>
              <p className="mt-2 text-sm text-slate-500">Check back soon for {brand.name} models.</p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-slate-600">
                <strong className="font-extrabold text-slate-950">{models.length} model{models.length !== 1 ? "s" : ""}</strong> available
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {models.map((model) => (
                  <article
                    key={model._id!.toString()}
                    className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_26px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_14px_34px_rgba(15,23,42,0.13)]"
                  >
                    <Link href={`/cars/${model.slug}`} className="relative flex aspect-4/3 items-center justify-center bg-[#eef2f5] p-6">
                      {model.image ? (
                        <img src={model.image} alt={model.name} className="h-full w-full object-contain" />
                      ) : (
                        <CarFront className="h-20 w-20 text-slate-300" strokeWidth={1.2} />
                      )}
                    </Link>
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {model.type} · {model.fuels.join(" / ")}
                      </p>
                      <h2 className="mt-2 text-lg font-extrabold text-slate-950">{model.name}</h2>
                      <p className="mt-1 text-xs text-slate-500">Ex-showroom price</p>
                      <p className="text-lg font-black text-slate-900">
                        ₹{model.priceMin.toFixed(2)} – {model.priceMax.toFixed(2)} Lakh*
                      </p>
                      <p className="mt-2 text-xs leading-5 text-slate-500">{model.specs}</p>
                      <Link
                        href={`/cars/${model.slug}`}
                        className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-[#0b3d32] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#082d25]"
                      >
                        View Details
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
