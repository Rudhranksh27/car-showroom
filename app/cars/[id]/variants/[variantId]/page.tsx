import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { CalendarClock, Cog, Fuel, Gauge, Palette, ShoppingCart } from "lucide-react";
import Navbar from "../../../../components/Navbar";
import { getModelsCollection, getVariantsCollection } from "../../../../lib/mongodb-catalog";
import type { ModelDoc, SubVariantDoc, VariantDoc } from "../../../../lib/catalog-types";
import type { WithId } from "mongodb";

export const dynamic = "force-dynamic";

type SubVariantsPageProps = {
  params: Promise<{ id: string; variantId: string }>;
};

export default async function SubVariantsPage({ params }: SubVariantsPageProps) {
  const { id, variantId } = await params;
  if (!ObjectId.isValid(variantId)) notFound();

  let model: WithId<ModelDoc> | null = null;
  let variant: WithId<VariantDoc> | null = null;

  try {
    model = await (await getModelsCollection()).findOne({ slug: id });
    if (model) variant = await (await getVariantsCollection()).findOne({ _id: new ObjectId(variantId) });
  } catch {
    notFound();
  }

  if (!model || model.published === false || !variant || variant.modelId !== model._id.toString()) notFound();

  const subVariants = variant.subVariants ?? [];
  const slug = encodeURIComponent(model.slug);

  // Group by engine + fuel, e.g. "Petrol · 1462 cc", keeping the admin's order.
  const groups = new Map<string, SubVariantDoc[]>();
  for (const sub of subVariants) {
    const key = `${sub.fuel} · ${sub.engine}`;
    groups.set(key, [...(groups.get(key) ?? []), sub]);
  }

  return (
    <main className="min-h-screen bg-[#f6f8fa] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-base text-slate-500" aria-label="Breadcrumb">
          <Link href="/cars" className="font-semibold transition-colors hover:text-sky-600">Inventory</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/cars/${slug}`} className="font-semibold transition-colors hover:text-sky-600">{model.name}</Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900">{variant.name}</span>
        </nav>

        <header className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">{model.brandName} · {model.name}</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.03em] md:text-5xl">{variant.name} options</h1>
          <p className="mt-4 text-lg leading-8 text-slate-500">
            {variant.description ? `${variant.description}. ` : ""}
            The {variant.name} comes in {subVariants.length} configuration{subVariants.length === 1 ? "" : "s"}, based on engine,
            transmission, fuel and paint. Pick one to book a test drive or buy.
          </p>
          <p className="mt-3 text-base font-semibold text-slate-700">Starting at {variant.price}</p>
        </header>

        {subVariants.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-lg text-slate-500">No sub-variants are listed for the {variant.name} yet.</p>
            <Link
              href={`/cars/${slug}/checkout?variant=${encodeURIComponent(variant.name)}`}
              className="mt-5 inline-flex rounded-full bg-[#0b3d32] px-6 py-3 text-base font-bold text-white hover:bg-[#082d25]"
            >
              Book the {variant.name}
            </Link>
          </div>
        ) : (
          [...groups.entries()].map(([group, items]) => (
            <section key={group} className="mt-12">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b3d32]/10 text-[#0b3d32]">
                  <Gauge className="h-5 w-5" />
                </span>
                <h2 className="text-2xl font-black tracking-tight">{group}</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{items.length}</span>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {items.map((sub) => (
                  <article key={sub.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-black tracking-tight">{sub.name}</h3>
                      <p className="shrink-0 text-lg font-black text-slate-900">{sub.price || variant.price}</p>
                    </div>
                    {sub.description && <p className="mt-2 text-base leading-7 text-slate-500">{sub.description}</p>}

                    <dl className="mt-5 grid grid-cols-2 gap-3">
                      {[
                        ["Engine", sub.engine, Gauge],
                        ["Fuel", sub.fuel, Fuel],
                        ["Transmission", sub.transmission, Cog],
                        ["Paint", sub.paint, Palette],
                      ].map(([label, value, Icon]) => {
                        const RowIcon = Icon as typeof Gauge;
                        return (
                          <div key={label as string} className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
                            <RowIcon className="h-5 w-5 shrink-0 text-[#0b3d32]" strokeWidth={1.75} />
                            <div className="min-w-0">
                              <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">{label as string}</dt>
                              <dd className="text-base font-bold text-slate-900">{value as string}</dd>
                            </div>
                          </div>
                        );
                      })}
                    </dl>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/book-test-drive?model=${slug}&variant=${encodeURIComponent(sub.name)}#book`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#0b3d32] px-5 py-3 text-base font-bold text-[#0b3d32] transition hover:bg-[#0b3d32]/5"
                      >
                        <CalendarClock className="h-4 w-4" />Book Test Drive
                      </Link>
                      <Link
                        href={`/cars/${slug}/checkout?variant=${encodeURIComponent(sub.name)}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0b3d32] px-5 py-3 text-base font-bold text-white shadow-lg shadow-[#0b3d32]/20 transition hover:bg-[#082d25]"
                      >
                        <ShoppingCart className="h-4 w-4" />Book Now
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))
        )}

        <div className="mt-12 text-center">
          <Link href={`/cars/${slug}`} className="text-base font-semibold text-sky-600 hover:underline">
            ← Back to {model.name}
          </Link>
        </div>
      </div>
    </main>
  );
}
