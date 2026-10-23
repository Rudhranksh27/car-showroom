import Link from "next/link";
import { CarFront, Check, Search, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import BookingFinder from "./BookingFinder";
import CarShowcase from "../components/CarShowcase";
import { get360Frames } from "../lib/car-360";
import TestDriveForm from "../components/TestDriveForm";
import type { Car } from "../lib/cars";
import { getModelsCollection, getVariantsCollection } from "../lib/mongodb-catalog";
import type { ModelDoc, VariantDoc } from "../lib/catalog-types";
import { splitOptions } from "../lib/variant-options";
import { findBookable, fullCarName, subColors } from "../lib/sub-variants";
import type { WithId } from "mongodb";

export const dynamic = "force-dynamic";

const stepLabels = ["Choose a car", "Pick a variant", "Confirm details"];

function Steps({ current }: { current: number }) {
  return (
    <ol className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3" aria-label="Booking steps">
      {stepLabels.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex items-center gap-3">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold ${
                done ? "bg-[#0b3d32] text-white" : active ? "bg-slate-900 text-white ring-4 ring-slate-900/10" : "bg-white text-slate-400 ring-1 ring-slate-200"
              }`}
            >
              {done ? <Check className="h-4 w-4" strokeWidth={3} /> : n}
            </span>
            <span className={`text-base font-bold ${active || done ? "text-slate-900" : "text-slate-400"}`}>{label}</span>
            {n < stepLabels.length && <span className="hidden h-px w-8 bg-slate-300 sm:block" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

type BookTestDrivePageProps = {
  searchParams: Promise<{
    model?: string | string[];
    variant?: string | string[];
    fuel?: string | string[];
    transmission?: string | string[];
    color?: string | string[];
    brand?: string | string[];
    type?: string | string[];
    budget?: string | string[];
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
  const { model: modelParam, variant: variantParam, fuel: fuelParam, transmission: transmissionParam, color: colorParam, brand: brandRaw, type: typeRaw, budget: budgetRaw } = await searchParams;
  const modelSlug = typeof modelParam === "string" ? modelParam : undefined;
  const selectedVariantName = typeof variantParam === "string" ? variantParam : undefined;
  const selectedFuel = typeof fuelParam === "string" ? fuelParam : undefined;
  const selectedTransmission = typeof transmissionParam === "string" ? transmissionParam : undefined;
  const brandParam = typeof brandRaw === "string" ? brandRaw : undefined;
  const typeParam = typeof typeRaw === "string" ? typeRaw : undefined;
  const budgetParam = typeof budgetRaw === "string" ? budgetRaw : undefined;
  const selectedColor = typeof colorParam === "string" ? colorParam : undefined;

  const loaded = modelSlug ? await loadModel(modelSlug) : null;

  if (loaded) {
    const { model, variants: allVariants } = loaded;
    // A variant matches through its own options or any of its sub-variants' (same rule as the finder).
    const optionsOf = (v: WithId<VariantDoc>, field: "fuel" | "transmission") => [
      ...splitOptions(v[field]),
      ...(v.subVariants ?? []).flatMap((s) => splitOptions(s[field])),
    ];
    const variants = allVariants.filter(
      (v) =>
        (!selectedFuel || optionsOf(v, "fuel").some((o) => sameOption(o, selectedFuel))) &&
        (!selectedTransmission || optionsOf(v, "transmission").some((o) => sameOption(o, selectedTransmission))),
    );
    // Show only the chosen option on a card, not every fuel / transmission the variant also offers.
    const shownOptions = (v: WithId<VariantDoc>, field: "fuel" | "transmission", chosen?: string) => {
      const all = [...new Set(optionsOf(v, field))];
      return (chosen ? all.filter((o) => sameOption(o, chosen)) : splitOptions(v[field])).join(" / ");
    };
    const selectedVariant = selectedVariantName ? variants.find((v) => sameOption(v.name, selectedVariantName)) : undefined;
    // The chosen name can also be a sub-variant (e.g. "ZXi MT Dual Tone") of any variant.
    const found = !selectedVariant && selectedVariantName ? findBookable(model.name, allVariants, selectedVariantName) : null;
    const selectedSub = found?.sub ? found : null;

    // The variant whose sub-variants the Fuel / Transmission filters narrow down.
    const parentVariant = selectedVariantName
      ? (allVariants.find((v) => sameOption(v.name, selectedVariantName)) ?? found?.variant ?? null)
      : null;
    // One entry per sub-variant and colour; the id carries the colour (see findBookable).
    const parentSubs = (parentVariant?.subVariants ?? []).flatMap((s) =>
      subColors(s).length ? subColors(s).map((c) => ({ ...s, id: `${s.id}~${c}`, color: c })) : [s],
    );
    const matchingSubs = parentSubs.filter(
      (s) =>
        (!selectedFuel || splitOptions(s.fuel).some((o) => sameOption(o, selectedFuel))) &&
        (!selectedTransmission || splitOptions(s.transmission).some((o) => sameOption(o, selectedTransmission))) &&
        (!selectedColor || (!!s.color && sameOption(s.color, selectedColor))),
    );

    // Configurations identical in everything but colour count as one card; the Colour filter picks which to book.
    const subGroups = Object.values(
      matchingSubs.reduce<Record<string, typeof matchingSubs>>((acc, s) => {
        const key = [s.engine, s.fuel, s.transmission, s.paint, s.price || parentVariant?.price || ""].map((x) => x.trim().toLowerCase()).join("|");
        (acc[key] ??= []).push(s);
        return acc;
      }, {}),
    );

    // Build a link that sets (or, if already active, clears) one filter while keeping the rest.
    const filterHref = (key: "fuel" | "transmission" | "color", value: string) => {
      const next = { fuel: selectedFuel, transmission: selectedTransmission, color: selectedColor };
      next[key] = next[key] && sameOption(next[key], value) ? undefined : value;
      const params = new URLSearchParams({ model: model.slug });
      if (next.fuel) params.set("fuel", next.fuel);
      if (next.transmission) params.set("transmission", next.transmission);
      if (next.color) params.set("color", next.color);
      // Keep the chosen variant so its sub-variants get filtered instead of being lost.
      if (parentVariant) params.set("variant", parentVariant.name);
      return `/book-test-drive?${params.toString()}${parentVariant && parentSubs.length ? "#sub-variants" : "#variants"}`;
    };
    const variantHref = (variantName: string) => {
      const params = new URLSearchParams({ model: model.slug });
      if (selectedFuel) params.set("fuel", selectedFuel);
      if (selectedTransmission) params.set("transmission", selectedTransmission);
      if (selectedColor) params.set("color", selectedColor);
      params.set("variant", variantName);
      return `/book-test-drive?${params.toString()}#book`;
    };
    // With a variant that has sub-variants chosen, offer only the options that variant actually has.
    const fuelOptions = parentSubs.length
      ? [...new Set(parentSubs.flatMap((s) => splitOptions(s.fuel)).filter(Boolean))]
      : [...new Set([...model.fuels, ...allVariants.flatMap((v) => splitOptions(v.fuel))].filter(Boolean))];
    const transmissionOptions = parentSubs.length
      ? [...new Set(parentSubs.flatMap((s) => splitOptions(s.transmission)).filter(Boolean))]
      : [...new Set([...(model.transmissions ?? []), ...allVariants.flatMap((v) => splitOptions(v.transmission))].filter(Boolean))];
    // The colour shown on the car: the one in the chosen configuration, else the Colour filter (if the variant has it).
    const idColor = selectedVariantName?.includes("~") ? selectedVariantName.split("~").slice(1).join("~") : "";
    const previewColor = [idColor, selectedColor ?? ""]
      .map((c) => parentSubs.map((s) => s.color).find((x) => x && c && sameOption(x, c)) ?? "")
      .find(Boolean) ?? "";
    const frames360 = get360Frames(model.name);
    const showcase = (
      <CarShowcase image={model.image} frames360={frames360} color={previewColor} label={selectedSub?.name ?? (selectedVariant ? fullCarName(model.name, selectedVariant.name) : model.name)} />
    );
    const colorOptions = [...new Set(parentSubs.map((s) => s.color?.trim()).filter((c): c is string => !!c))];
    const chipClass = (active: boolean) =>
      `rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active ? "border-[#0b3d32] bg-[#0b3d32] text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
      }`;
    const bookingCar: Car | null = selectedVariant
      ? {
          id: model.slug,
          name: fullCarName(model.name, selectedVariant.name),
          brand: model.brandName,
          category: model.type,
          price: selectedVariant.price,
          image: model.image ?? "",
          alt: model.name,
        }
      : selectedSub
        ? {
            id: model.slug,
            // e.g. "Maruti Suzuki Brezza ZXi MT Dual Tone (Pearl White) · 5-speed Manual", so 5- and 6-speed bookings differ.
            name: [selectedSub.name, selectedSub.sub.transmission].filter(Boolean).join(" · "),
            brand: model.brandName,
            category: model.type,
            price: selectedSub.price,
            image: model.image ?? "",
            alt: model.name,
          }
        : null;

    return (
      <main className="min-h-screen bg-[#f3f3f3] font-[family-name:var(--font-jakarta)] text-slate-900">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link href="/book-test-drive#results" className="text-base font-bold text-[#0b3d32] hover:underline">← Choose a different car</Link>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-primary">Test drive booking</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.03em] md:text-5xl">Which {model.name} variant would you like to test drive?</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">Choose a variant. You can confirm your preferred time and dealer in the next step.</p>
          <Steps current={bookingCar ? 3 : 2} />
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <Link href={`/cars/${model.slug}`} className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-300/60">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 ring-1 ring-slate-200 transition group-hover:bg-slate-900 group-hover:text-white" aria-hidden="true"><CarFront className="h-7 w-7" strokeWidth={1.8} /></span>
              <h2 className="mt-6 text-xl font-extrabold tracking-[-0.01em]">About the {model.name}</h2>
              <p className="mt-2 text-base leading-7 text-slate-600">Review the specifications and highlights before you book.</p>
              <span className="mt-6 inline-block text-base font-bold text-[#0b3d32]">View model →</span>
            </Link>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 ring-1 ring-slate-200 transition group-hover:bg-slate-900 group-hover:text-white" aria-hidden="true"><Search className="h-7 w-7" strokeWidth={1.8} /></span>
              <h2 className="mt-6 text-xl font-extrabold tracking-[-0.01em]">Fuel, transmission &amp; colour</h2>
              <p className="mt-2 text-base leading-7 text-slate-600">Select an option to filter the {model.name} variants below.</p>
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
              {colorOptions.length > 0 && (
                <>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Colour</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {colorOptions.map((option) => {
                      const active = !!selectedColor && sameOption(selectedColor, option);
                      return (
                        <Link key={`color-${option}`} href={filterHref("color", option)} aria-pressed={active} className={chipClass(active)}>
                          {option}
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <Link href="#variants" className="group rounded-3xl border border-slate-900 bg-slate-900 p-7 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-400/40">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-amber-300 ring-1 ring-white/20" aria-hidden="true"><Star className="h-7 w-7" strokeWidth={1.8} /></span>
              <h2 className="mt-6 text-xl font-extrabold tracking-[-0.01em]">Pick from available variants</h2>
              <p className="mt-2 text-base leading-7 text-slate-300">See every {model.name} variant ready for a test drive.</p>
              <span className="mt-6 inline-block text-base font-bold text-amber-300">See variants ↓</span>
            </Link>
          </div>

          <section id="variants" className="mt-24 scroll-mt-24">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">{model.name} variants</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">Choose your variant</h2>
              </div>
              <Link href={`/cars/${model.slug}`} className="hidden text-base font-bold text-[#0b3d32] hover:underline sm:block">View model details →</Link>
            </div>

            {(selectedFuel || selectedTransmission) && (
              <p className="mt-4 text-base text-slate-600">
                Showing {variants.length} of {allVariants.length} variants
                {[selectedFuel, selectedTransmission].filter(Boolean).map((f) => ` · ${f}`).join("")}.{" "}
                <Link href={`/book-test-drive?model=${encodeURIComponent(model.slug)}#variants`} className="font-bold text-[#0b3d32] hover:underline">
                  Clear filters
                </Link>
              </p>
            )}

            {variants.length === 0 ? (
              <p className="mt-8 text-base text-slate-600">
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
                      className={`group flex flex-col items-start overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/60 ${isSelected ? "border-[#0b3d32] ring-2 ring-[#0b3d32]/25" : "border-slate-200"}`}
                    >
                      {model.image && (
                        <div className="flex aspect-[1.6] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-200 p-6">
                          <img src={model.image} alt={model.name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      )}
                      <div className="w-full px-6 pt-5">
                        <h3 className="text-xl font-extrabold tracking-[-0.01em] text-slate-900">{variant.name}</h3>
                        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">{shownOptions(variant, "fuel", selectedFuel)} · {shownOptions(variant, "transmission", selectedTransmission)}</p>
                      </div>
                      <div className="mt-4 flex w-full items-center justify-between gap-4 px-6 pb-6">
                        <span className="text-lg font-extrabold text-slate-900">{variant.price}</span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${isSelected ? "bg-emerald-100 text-[#0b3d32]" : "bg-[#0b3d32] text-white transition group-hover:bg-[#082d25]"}`}>
                          {isSelected ? (<><Check className="h-4 w-4" strokeWidth={3} />Selected</>) : "Book test drive →"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {parentVariant && parentSubs.length > 0 && (
              <div id="sub-variants" className="mt-12 grid scroll-mt-24 gap-8 lg:grid-cols-[1fr_26rem] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">{parentVariant.name} configurations</p>
                <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.02em]">
                  {subGroups.length} option{subGroups.length === 1 ? "" : "s"} match
                  {[selectedFuel, selectedTransmission, selectedColor].filter(Boolean).map((f) => ` · ${f}`).join("")}
                </h2>
                {matchingSubs.length === 0 ? (
                  <p className="mt-4 text-base text-slate-600">No {parentVariant.name} configuration matches. Try a different combination.</p>
                ) : (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {subGroups.map((group) => {
                      const first = group[0];
                      const active = group.find((g) => g.id === selectedVariantName);
                      return (
                        <div
                          key={first.id}
                          className={`rounded-2xl border bg-white p-5 shadow-sm ${active ? "border-[#0b3d32] ring-2 ring-[#0b3d32]/25" : "border-slate-200"}`}
                        >
                          <h3 className="text-lg font-extrabold text-slate-900">{first.name}</h3>
                          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.1em] text-slate-400">
                            {first.fuel} · {first.transmission} · {first.paint}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">{first.engine}</p>
                          <p className="mt-3 text-lg font-extrabold text-slate-900">{first.price || parentVariant.price}</p>
                          {group.length === 1 ? (
                            <Link href={variantHref(first.id)} className="mt-4 inline-block text-sm font-bold text-[#0b3d32] hover:underline">
                              {first.color ? `Book ${first.color} →` : "Book this →"}
                            </Link>
                          ) : (
                            <p className="mt-4 text-sm text-slate-600">
                              <span className="font-bold text-slate-900">{group.length} colours:</span> {group.map((g) => g.color || "Standard").join(", ")}.
                              <span className="block text-slate-500">Pick a colour in the filter above to book.</span>
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="lg:sticky lg:top-24">{showcase}</div>
              </div>
            )}

            {bookingCar && (
              <div id="book" className="mt-12 scroll-mt-24">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Your details</p>
                <h2 className="mt-3 mb-7 text-3xl font-extrabold tracking-[-0.03em]">Book a test drive for {bookingCar.name}</h2>
                <div className={parentSubs.length > 0 ? "max-w-3xl" : "grid gap-8 lg:grid-cols-[1fr_26rem] lg:items-start"}>
                  <TestDriveForm car={bookingCar} />
                  {parentSubs.length === 0 && showcase}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3] font-[family-name:var(--font-jakarta)] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Test drive booking</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.03em] md:text-5xl">Which car would you like to test drive?</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">Filter by brand, body type, fuel, transmission or budget, then pick a car and book it straight away.</p>
        </div>
        <BookingFinder filters={{ brand: brandParam, type: typeParam, fuel: selectedFuel, transmission: selectedTransmission, budget: budgetParam }} />
      </div>
    </main>
  );
}
