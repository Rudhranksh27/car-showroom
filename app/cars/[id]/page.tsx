import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Heart, Scale, FileText, ExternalLink, Check, Gauge, Ruler, Users,
  CarFront, Fuel, Cog, Route, Zap, CalendarDays,
  type LucideIcon,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import ModelGallery from "./ModelGallery";
import { getModelsCollection, getVariantsCollection } from "../../lib/mongodb-catalog";
import type { Highlight, ModelDoc, VariantDoc } from "../../lib/catalog-types";
import type { WithId } from "mongodb";

export const dynamic = "force-dynamic";

type CarDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = await params;

  let model: WithId<ModelDoc> | null = null;
  let variants: WithId<VariantDoc>[] = [];

  try {
    const modelsCol = await getModelsCollection();
    model = await modelsCol.findOne({ slug: id });

    if (model) {
      const variantsCol = await getVariantsCollection();
      variants = await variantsCol
        .find({ modelId: model._id.toString() })
        .sort({ createdAt: 1 })
        .toArray();
    }
  } catch {
    notFound();
  }

  if (!model || model.published === false) notFound();

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long" }) : undefined;
  const mm = (v?: number) => (v ? `${v.toLocaleString("en-IN")} mm` : undefined);
  const specGroups = [
    {
      title: "General", icon: Gauge,
      rows: [
        ["Body type", model.type, CarFront],
        ["Fuel", model.fuels.join(", "), Fuel],
        ["Transmission", model.transmissions?.join(", "), Cog],
        ["Drive", model.drive, Route],
        ["Engine & performance", model.specs, Zap],
        ["Launched", formatDate(model.launchDate), CalendarDays],
      ],
    },
    {
      title: "Dimensions", icon: Ruler,
      rows: [
        ["Length", mm(model.length)],
        ["Width", mm(model.width)],
        ["Height", mm(model.height)],
        ["Wheelbase", mm(model.wheelbase)],
      ],
    },
    {
      title: "Capacity", icon: Users,
      rows: [
        ["Seating", model.seatingCapacity ? `${model.seatingCapacity} seats` : undefined],
        ["Doors", model.doors ? String(model.doors) : undefined],
        ["Boot space", model.bootSpace ? `${model.bootSpace.toLocaleString("en-IN")} litres` : undefined],
      ],
    },
  ]
    .map((g) => ({ title: g.title, icon: g.icon, rows: g.rows.filter((r): r is [string, string, LucideIcon?] => !!r[1]) }))
    .filter((g) => g.rows.length > 0);
  // Legacy plain-string highlights have no header/detail structure, so they are not shown.
  const highlights = (model.highlights ?? []).filter((h): h is Highlight => typeof h !== "string");
  const hasHighlights = highlights.length > 0;

  return (
    <main className="min-h-screen bg-[#f3f3f3] font-[family-name:var(--font-jakarta)] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-base text-slate-500" aria-label="Breadcrumb">
          <Link href="/cars" className="font-semibold transition-colors hover:text-[#0b3d32]">Inventory</Link>
          {model.brandSlug && (
            <>
              <span aria-hidden="true">/</span>
              <Link href={`/brands/${model.brandSlug}`} className="font-semibold transition-colors hover:text-[#0b3d32]">{model.brandName}</Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-slate-900">{model.name}</span>
        </nav>

        {/* Hero */}
        <section className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <ModelGallery
            name={model.name}
            main={model.image}
            exterior={model.exteriorImages ?? []}
            interior={model.interiorImages ?? []}
          />

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              {model.brandName} · {model.type}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] md:text-5xl">{model.name}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {model.discontinued ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />Discontinued
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />In Stock
                </span>
              )}
              {model.modelYear && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{model.modelYear}</span>
              )}
              {model.segment && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{model.segment}</span>
              )}
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <p className="text-4xl font-extrabold text-slate-900">
                ₹{model.priceMin.toFixed(2)} – {model.priceMax.toFixed(2)} <span className="text-xl font-bold text-slate-500">Lakh*</span>
              </p>
              <p className="mt-1 text-base text-slate-500">Ex-showroom · {model.fuels.join(" · ")}</p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/book-test-drive?model=${encodeURIComponent(model.slug)}`}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-[#0b3d32] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#0b3d32]/20 transition hover:-translate-y-0.5 hover:bg-[#082d25]"
              >
                Book Test Drive
              </Link>
              <button type="button" aria-label={`Save ${model.name}`} className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-900 hover:text-slate-900">
                <Heart className="h-5 w-5" />
              </button>
              <button type="button" aria-label={`Compare ${model.name}`} className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-900 hover:text-slate-900">
                <Scale className="h-5 w-5" />
              </button>
            </div>

            {(model.brochureUrl || model.websiteUrl) && (
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-base font-semibold">
                {model.brochureUrl && (
                  <a href={model.brochureUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#0b3d32] hover:underline">
                    <FileText className="h-4 w-4" />Download brochure
                  </a>
                )}
                {model.websiteUrl && (
                  <a href={model.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#0b3d32] hover:underline">
                    <ExternalLink className="h-4 w-4" />Official website
                  </a>
                )}
              </div>
            )}

            <p className="mt-6 border-t border-slate-100 pt-5 text-base text-slate-500">
              Questions? Call <a href="tel:+919999999999" className="font-semibold text-slate-900 hover:text-[#0b3d32]">+91 99999 99999</a>
            </p>
          </div>
        </section>

        {/* About & highlights */}
        {(model.overview || hasHighlights) && (
          <section className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Overview</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.02em] md:text-4xl">About the {model.name}</h2>
            </div>

            {model.overview && (
              <p className="whitespace-pre-line px-6 pt-6 text-lg leading-8 text-slate-600 sm:px-8 sm:pt-8">
                {model.overview}
              </p>
            )}

            {hasHighlights && (
              <div className="p-6 sm:p-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Highlights</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {highlights.map((h, i) => {
                    return (
                      <li key={`${h.title}-${i}`} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-5 py-4">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0b3d32]/10">
                          <Check className="h-3 w-3 text-[#0b3d32]" strokeWidth={3} />
                        </span>
                        <div>
                          <p className="text-base font-extrabold text-slate-900">{h.title}</p>
                          {h.description && <p className="mt-1 text-base leading-6 text-slate-600">{h.description}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Specifications */}
        <section className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Technical details</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.02em] md:text-4xl">Specifications</h2>
          </div>
          <div className={`grid divide-y divide-slate-100 ${specGroups.length === 1 ? "" : specGroups.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"} md:divide-x md:divide-y-0`}>
            {specGroups.map((g) => {
              const Icon = g.icon;
              return (
                <div key={g.title} className="p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b3d32]/10 text-[#0b3d32]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-extrabold tracking-tight">{g.title}</h3>
                  </div>
                  <dl className="mt-5 space-y-2">
                    {g.rows.map(([label, value, RowIcon]) => (
                      <div key={label} className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                        {RowIcon && (
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0b3d32] shadow-sm ring-1 ring-slate-200">
                            <RowIcon className="h-5 w-5" strokeWidth={1.75} />
                          </span>
                        )}
                        <div className="min-w-0">
                          <dt className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-400">{label}</dt>
                          <dd className="mt-0.5 text-base font-bold text-slate-900">{value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })}
          </div>
        </section>

        {/* Variants */}
        {variants.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-slate-900 md:text-4xl">
              {model.name} — Variants &amp; Pricing
            </h2>
            <p className="mt-2 text-base text-slate-500">
              ₹{model.priceMin.toFixed(2)} – {model.priceMax.toFixed(2)} Lakh (ex-showroom)
            </p>

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-extrabold uppercase tracking-[0.1em] text-slate-500">
                <div>Variant</div>
                <div>Ex-Showroom Price</div>
                <div>Action</div>
              </div>
              {variants.map((variant) => {
                const subCount = variant.subVariants?.length ?? 0;
                const variantHref = `/cars/${encodeURIComponent(model.slug)}/variants/${variant._id.toString()}`;
                return (
                <div key={variant._id.toString()} className="grid grid-cols-[1.5fr_1fr_1fr] items-center gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0 hover:bg-slate-50">
                  <div>
                    {subCount > 0 ? (
                      <Link href={variantHref} className="font-bold text-slate-900 hover:text-[#0b3d32]">{variant.name}</Link>
                    ) : (
                      <p className="font-bold text-slate-900">{variant.name}</p>
                    )}
                    {variant.description && <p className="mt-0.5 text-sm text-slate-500">{variant.description}</p>}
                    <p className="mt-1 text-base text-slate-600">{variant.specs}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{variant.price}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{variant.fuel} · {variant.transmission}</p>
                  </div>
                  <div>
                    {subCount > 0 ? (
                      <Link
                        href={variantHref}
                        className="inline-flex items-center justify-center rounded-full bg-[#0b3d32] px-4 py-2 text-base font-bold text-white hover:bg-[#082d25]"
                      >
                        View {subCount} options
                      </Link>
                    ) : (
                      <Link
                        href={`/cars/${encodeURIComponent(model.slug)}/checkout?variant=${encodeURIComponent(variant.name)}`}
                        className="inline-flex items-center justify-center rounded-full bg-[#0b3d32] px-4 py-2 text-base font-bold text-white hover:bg-[#082d25]"
                      >
                        Book Now
                      </Link>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          </section>
        )}

        {model.brandSlug && (
          <div className="mt-10 text-center">
            <Link href={`/brands/${model.brandSlug}`} className="text-base font-bold text-[#0b3d32] hover:underline">
              ← View all {model.brandName} models
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
