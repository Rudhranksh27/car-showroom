import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { Gauge } from "lucide-react";
import Navbar from "../../../../components/Navbar";
import { get360Frames } from "../../../../lib/car-360";
import SubVariantPicker from "../../../../components/SubVariantPicker";
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
  const frames360 = get360Frames(model.name);
  const slug = encodeURIComponent(model.slug);

  // Group by engine + fuel, e.g. "Petrol · 1462 cc", keeping the admin's order.
  const groups = new Map<string, SubVariantDoc[]>();
  for (const sub of subVariants) {
    const key = `${sub.fuel} · ${sub.engine}`;
    groups.set(key, [...(groups.get(key) ?? []), sub]);
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3] font-[family-name:var(--font-jakarta)] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-base text-slate-500" aria-label="Breadcrumb">
          <Link href="/cars" className="font-semibold transition-colors hover:text-[#0b3d32]">Inventory</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/cars/${slug}`} className="font-semibold transition-colors hover:text-[#0b3d32]">{model.name}</Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900">{variant.name}</span>
        </nav>

        <header className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">{model.brandName} · {model.name}</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] md:text-5xl">{variant.name} options</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {variant.description ? `${variant.description}. ` : ""}
            The {variant.name} comes in {subVariants.length} configuration{subVariants.length === 1 ? "" : "s"}, based on engine,
            transmission, fuel and paint. Pick one to book a test drive or buy.
          </p>
          <p className="mt-5 inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2 text-base font-bold text-slate-900 shadow-sm">Starting at <span className="ml-2 text-[#0b3d32]">{variant.price}</span></p>
        </header>

        {subVariants.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
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
            <section key={group} className="mt-14">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 ring-1 ring-slate-200">
                  <Gauge className="h-5 w-5" />
                </span>
                <h2 className="text-2xl font-extrabold tracking-[-0.02em] md:text-3xl">{group}</h2>
                <span className="rounded-full bg-[#0b3d32] px-3 py-1 text-sm font-bold text-white">{items.length} version{items.length === 1 ? "" : "s"}</span>
              </div>

              <div className="mt-6">
                <SubVariantPicker subs={items} variantPrice={variant.price} slug={slug} modelName={model.name} image={model.image} frames360={frames360} />
              </div>
            </section>
          ))
        )}

        <div className="mt-14 text-center">
          <Link href={`/cars/${slug}`} className="text-base font-bold text-[#0b3d32] hover:underline">
            ← Back to {model.name}
          </Link>
        </div>
      </div>
    </main>
  );
}
