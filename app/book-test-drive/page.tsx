import Link from "next/link";
import Navbar from "../components/Navbar";
import TestDriveForm from "../components/TestDriveForm";
import { carBrands, cars } from "../lib/cars";
import type { Car } from "../lib/cars";
import { getModelsCollection, getVariantsCollection } from "../lib/mongodb-catalog";
import type { ModelDoc, VariantDoc } from "../lib/catalog-types";
import { findBookable } from "../lib/sub-variants";
import type { WithId } from "mongodb";

export const dynamic = "force-dynamic";

const popularCars = cars.slice(0, 6);

type BookTestDrivePageProps = {
  searchParams: Promise<{
    model?: string | string[];
    variant?: string | string[];
    fuel?: string | string[];
    transmission?: string | string[];
  }>;
};

const sameOption = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

async function loadModel(slug: string) {
  try {
    const model: WithId<ModelDoc> | null = await (await getModelsCollection()).findOne({ slug });
    if (!model || model.published === false) return null;
    const variants: WithId<VariantDoc>[] = await (await getVariantsCollection())
      .find({ modelId: model._id.toString() })
      .sort({ createdAt: 1 })
      .toArray();
    return { model, variants };
  } catch {
    return null;
  }
}

export default async function BookTestDrivePage({ searchParams }: BookTestDrivePageProps) {
  const { model: modelParam, variant: variantParam, fuel: fuelParam, transmission: transmissionParam } = await searchParams;
  const modelSlug = typeof modelParam === "string" ? modelParam : undefined;
  const selectedVariantName = typeof variantParam === "string" ? variantParam : undefined;
  const selectedFuel = typeof fuelParam === "string" ? fuelParam : undefined;
  const selectedTransmission = typeof transmissionParam === "string" ? transmissionParam : undefined;

  const loaded = modelSlug ? await loadModel(modelSlug) : null;

  if (loaded) {
    const { model, variants: allVariants } = loaded;
    const variants = allVariants.filter(
      (v) =>
        (!selectedFuel || sameOption(v.fuel, selectedFuel)) &&
        (!selectedTransmission || sameOption(v.transmission, selectedTransmission)),
    );
    const selectedVariant = variants.find((v) => v.name === selectedVariantName);
    // The chosen name can also be a sub-variant (e.g. "ZXi MT Dual Tone") of any variant.
    const found = !selectedVariant && selectedVariantName ? findBookable(model.name, allVariants, selectedVariantName) : null;
    const selectedSub = found?.sub ? found : null;

    // Build a link that sets (or, if already active, clears) one filter while keeping the rest.
    const filterHref = (key: "fuel" | "transmission", value: string) => {
      const next = { fuel: selectedFuel, transmission: selectedTransmission };
      next[key] = next[key] && sameOption(next[key], value) ? undefined : value;
      const params = new URLSearchParams({ model: model.slug });
      if (next.fuel) params.set("fuel", next.fuel);
      if (next.transmission) params.set("transmission", next.transmission);
      return `/book-test-drive?${params.toString()}#variants`;
    };
    const variantHref = (variantName: string) => {
      const params = new URLSearchParams({ model: model.slug });
      if (selectedFuel) params.set("fuel", selectedFuel);
      if (selectedTransmission) params.set("transmission", selectedTransmission);
      params.set("variant", variantName);
      return `/book-test-drive?${params.toString()}#book`;
    };
    const fuelOptions = [...new Set([...model.fuels, ...allVariants.map((v) => v.fuel)].filter(Boolean))];
    const transmissionOptions = [
      ...new Set([...(model.transmissions ?? []), ...allVariants.map((v) => v.transmission)].filter(Boolean)),
    ];
    const chipClass = (active: boolean) =>
      `rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active ? "border-sky-500 bg-sky-50 text-sky-700" : "border-slate-200 text-slate-700 hover:border-sky-400 hover:text-sky-600"
      }`;
    const bookingCar: Car | null = selectedVariant
      ? {
          id: model.slug,
          name: selectedVariant.name.startsWith(model.name) ? selectedVariant.name : `${model.name} ${selectedVariant.name}`,
          brand: model.brandName,
          category: model.type,
          price: selectedVariant.price,
          image: model.image ?? "",
          alt: model.name,
        }
      : selectedSub
        ? {
            id: model.slug,
            name: selectedSub.name,
            brand: model.brandName,
            category: model.type,
            price: selectedSub.price,
            image: model.image ?? "",
            alt: model.name,
          }
        : null;

    return (
      <main className="min-h-screen bg-[#f6f8fa] text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Test drive booking</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-5xl">Which {model.name} variant would you like to test drive?</h1>
            <p className="mt-4 text-base leading-7 text-slate-500">Choose a variant. You can confirm your preferred time and dealer in the next step.</p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <Link href={`/cars/${model.slug}`} className="group border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-sky-400 hover:shadow-xl hover:shadow-slate-200/70">
              <span className="text-3xl" aria-hidden="true">🚗</span>
              <h2 className="mt-6 text-xl font-bold">About the {model.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Review the specifications and highlights before you book.</p>
              <span className="mt-6 inline-block text-sm font-bold text-sky-600">View model →</span>
            </Link>

            <div className="border border-slate-200 bg-white p-6">
              <span className="text-3xl" aria-hidden="true">🔍</span>
              <h2 className="mt-6 text-xl font-bold">Fuel &amp; transmission</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Select an option to filter the {model.name} variants below.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {fuelOptions.map((option) => {
                  const active = !!selectedFuel && sameOption(selectedFuel, option);
                  return (
                    <Link key={`fuel-${option}`} href={filterHref("fuel", option)} aria-pressed={active} className={chipClass(active)}>
                      {option}
                    </Link>
                  );
                })}
              </div>
              {transmissionOptions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {transmissionOptions.map((option) => {
                    const active = !!selectedTransmission && sameOption(selectedTransmission, option);
                    return (
                      <Link key={`transmission-${option}`} href={filterHref("transmission", option)} aria-pressed={active} className={chipClass(active)}>
                        {option}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link href="#variants" className="group border border-slate-200 bg-slate-900 p-6 text-white transition hover:-translate-y-1 hover:bg-slate-800">
              <span className="text-3xl" aria-hidden="true">⭐</span>
              <h2 className="mt-6 text-xl font-bold">Pick from available variants</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">See every {model.name} variant ready for a test drive.</p>
              <span className="mt-6 inline-block text-sm font-bold text-sky-300">See variants ↓</span>
            </Link>
          </div>

          <section id="variants" className="mt-20 scroll-mt-24">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">{model.name} variants</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.03em]">Choose your variant</h2>
              </div>
              <Link href={`/cars/${model.slug}`} className="hidden text-sm font-bold text-slate-600 hover:text-sky-600 sm:block">View model details →</Link>
            </div>

            {(selectedFuel || selectedTransmission) && (
              <p className="mt-4 text-sm text-slate-500">
                Showing {variants.length} of {allVariants.length} variants
                {[selectedFuel, selectedTransmission].filter(Boolean).map((f) => ` · ${f}`).join("")}.{" "}
                <Link href={`/book-test-drive?model=${encodeURIComponent(model.slug)}#variants`} className="font-semibold text-sky-600 hover:underline">
                  Clear filters
                </Link>
              </p>
            )}

            {variants.length === 0 ? (
              <p className="mt-8 text-sm text-slate-500">
                {allVariants.length === 0
                  ? `No variants are listed for the ${model.name} yet.`
                  : "No variants match the selected options. Try a different combination."}
              </p>
            ) : (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {variants.map((variant) => {
                  const isSelected = variant.name === selectedVariant?.name;
                  return (
                    <Link
                      key={variant._id.toString()}
                      href={variantHref(variant.name)}
                      className={`group flex flex-col items-start overflow-hidden border bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 ${isSelected ? "border-sky-500" : "border-slate-200"}`}
                    >
                      {model.image && (
                        <div className="flex aspect-[1.6] w-full items-center justify-center overflow-hidden bg-slate-100 p-5">
                          <img src={model.image} alt={model.name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="mt-3 self-start bg-black px-3 py-2 text-left text-white">
                        <h3 className="text-sm font-bold">{variant.name}</h3>
                      </div>
                      <div className="w-full p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{variant.fuel} · {variant.transmission}</p>
                        <div className="mt-4 flex items-center justify-between gap-4 text-sm">
                          <span className="font-semibold text-slate-600">{variant.price}</span>
                          <span className="font-bold text-sky-600">{isSelected ? "Selected ✓" : "Book test drive →"}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {bookingCar && (
              <div id="book" className="mt-12 scroll-mt-24">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Your details</p>
                <h2 className="mt-3 mb-7 text-2xl font-black tracking-[-0.03em]">Book a test drive for {bookingCar.name}</h2>
                <div className="max-w-3xl">
                  <TestDriveForm car={bookingCar} />
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8fa] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Test drive booking</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-5xl">Which car would you like to test drive?</h1>
          <p className="mt-4 text-base leading-7 text-slate-500">Choose a starting point. You can confirm your preferred car, time, and dealer in the next step.</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Link href="/cars?purpose=test-drive" className="group border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-sky-400 hover:shadow-xl hover:shadow-slate-200/70">
            <span className="text-3xl" aria-hidden="true">🚗</span>
            <h2 className="mt-6 text-xl font-bold">Pick from available stock</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Browse every car currently available for a test drive.</p>
            <span className="mt-6 inline-block text-sm font-bold text-sky-600">Browse stock →</span>
          </Link>

          <div className="border border-slate-200 bg-white p-6">
            <span className="text-3xl" aria-hidden="true">🔍</span>
            <h2 className="mt-6 text-xl font-bold">Search by brand</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Start with a brand you already have in mind.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {carBrands.slice(0, 4).map((brand) => (
                <Link key={brand} href={`/cars?brand=${encodeURIComponent(brand)}`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-sky-400 hover:text-sky-600">
                  {brand}
                </Link>
              ))}
            </div>
          </div>

          <Link href="#popular-models" className="group border border-slate-200 bg-slate-900 p-6 text-white transition hover:-translate-y-1 hover:bg-slate-800">
            <span className="text-3xl" aria-hidden="true">⭐</span>
            <h2 className="mt-6 text-xl font-bold">Pick from popular models</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">See six customer-favorite models ready for a closer look.</p>
            <span className="mt-6 inline-block text-sm font-bold text-sky-300">See popular cars ↓</span>
          </Link>
        </div>

        <section id="popular-models" className="mt-20 scroll-mt-24">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Popular models</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em]">Choose your car</h2>
            </div>
            <Link href="/cars?purpose=test-drive" className="hidden text-sm font-bold text-slate-600 hover:text-sky-600 sm:block">View all stock →</Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularCars.map((car) => (
              <Link key={car.id} href={`/cars/${car.id}/book-test-drive`} className="group flex flex-col items-start overflow-hidden border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
                <div className="flex aspect-[1.6] w-full items-center justify-center overflow-hidden bg-slate-100 p-5">
                  <img src={car.image} alt={car.alt} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="mt-3 self-start bg-black px-3 py-2 text-left text-white">
                  <h3 className="text-sm font-bold">{car.name}</h3>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{car.brand}</p>
                  <div className="mt-4 flex items-center justify-between gap-4 text-sm">
                    <span className="font-semibold text-slate-600">{car.price}</span>
                    <span className="font-bold text-sky-600">Book test drive →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
