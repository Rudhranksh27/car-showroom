"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, CarFront } from "lucide-react";
import { useEffect, useState } from "react";
import type { Brand } from "../lib/catalog-types";

export default function InventoryRange() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState("All");

  useEffect(() => {
    fetch("/api/catalog/brands")
      .then((r) => r.json())
      .then((data: { brands?: Brand[] }) => {
        setBrands(data.brands ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const visibleBrands =
    selectedBrand === "All" ? brands : brands.filter((b) => b.name === selectedBrand);

  const stats = (brand: Brand) => [
    { label: "Models", value: brand.modelCount ?? 0 },
    { label: "Service Centers", value: brand.serviceCenters },
    { label: "Sold This Year", value: brand.soldThisYear },
    { label: "Sold This Month", value: brand.soldThisMonth },
  ];

  return (
    <section className="w-full border-t border-slate-200 bg-white px-4 py-16 font-[family-name:var(--font-jakarta)] sm:px-6 md:py-24 lg:px-8">
      <div className="relative isolate mx-auto max-w-[88rem]">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2.5 rounded-full bg-[#0b3d32] px-5 py-2 text-sm font-extrabold uppercase tracking-[0.16em] text-white shadow-lg shadow-[#0b3d32]/25 ring-4 ring-[#1a8978]/15">
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-300" />
              </span>
              <span className="relative mr-1 flex h-5 w-[76px] items-center [--car-dist:34px]" aria-hidden="true">
                <span className="car-run absolute left-0 top-0 flex h-5 w-10 items-center justify-center">
                  <span className="car-speed absolute -left-3 top-[6px] h-[2px] w-3 rounded-full bg-amber-300/80" />
                  <span className="car-speed absolute -left-2.5 top-[11px] h-[2px] w-2.5 rounded-full bg-amber-300/60 [animation-delay:0.25s]" />
                  <svg viewBox="0 0 48 24" className="car-bounce relative h-5 w-10 overflow-visible" fill="none">
                    {/* body */}
                    <path
                      d="M2 17V13.2c0-1.4.9-2.5 2.3-2.8l6.7-1.5 4-4.1c.8-.8 1.8-1.3 3-1.3h11.2c1.3 0 2.5.5 3.4 1.4l3.7 4 5.5 1.2c1.4.3 2.2 1.3 2.2 2.7V17c0 .9-.7 1.6-1.6 1.6H3.6C2.7 18.6 2 17.9 2 17Z"
                      fill="#fcd34d"
                    />
                    {/* lower shading */}
                    <path d="M2 15h44v2c0 .9-.7 1.6-1.6 1.6H3.6C2.7 18.6 2 17.9 2 17v-2Z" fill="#f59e0b" />
                    {/* windows */}
                    <path d="M16.2 9 19 5.9c.4-.4.9-.6 1.5-.6H24V9h-7.8Z" fill="#d6f1ea" />
                    <path d="M26 5.3h3.2c.6 0 1.1.2 1.5.6L33.6 9H26V5.3Z" fill="#d6f1ea" />
                    {/* door line + handle */}
                    <path d="M25 9.4v6.2" stroke="#d97706" strokeWidth=".8" strokeLinecap="round" />
                    <path d="M27.2 11.6h2.4" stroke="#b45309" strokeWidth=".9" strokeLinecap="round" />
                    {/* lights */}
                    <path d="M44.2 11.2h1.6c.5 0 .8.3.8.8v1.2h-2.4v-2Z" fill="#fff" />
                    <rect x="2.2" y="11.4" width="1.8" height="2" rx=".5" fill="#ef4444" />
                    {/* wheel arches */}
                    <circle cx="12.5" cy="18.4" r="5.2" fill="#0b3d32" />
                    <circle cx="36" cy="18.4" r="5.2" fill="#0b3d32" />
                    {/* wheels */}
                    <g className="car-wheel" style={{ transformOrigin: "12.5px 18.4px" }}>
                      <circle cx="12.5" cy="18.4" r="4" fill="#1f2937" />
                      <circle cx="12.5" cy="18.4" r="2.2" fill="#e5e7eb" />
                      <path d="M12.5 16.2v4.4M10.3 18.4h4.4" stroke="#6b7280" strokeWidth=".8" />
                    </g>
                    <g className="car-wheel" style={{ transformOrigin: "36px 18.4px" }}>
                      <circle cx="36" cy="18.4" r="4" fill="#1f2937" />
                      <circle cx="36" cy="18.4" r="2.2" fill="#e5e7eb" />
                      <path d="M36 16.2v4.4M33.8 18.4h4.4" stroke="#6b7280" strokeWidth=".8" />
                    </g>
                  </svg>
                </span>
              </span>
              Browse by Brand
            </p>
            <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-slate-900 md:text-6xl">
              Find your{" "}
              <span className="relative inline-block text-[#1a8978]">
                perfect match
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 20"
                  preserveAspectRatio="none"
                  className="absolute overflow-visible -bottom-[21px] -left-4 h-5 w-[calc(100%+2rem)] md:-bottom-[25px] md:-left-6 md:h-6 md:w-[calc(100%+3rem)]"
                >
                  <path
                    d="M8 18 Q 150 -6 292 18"
                    fill="none"
                    stroke="#0b3d32"
                    strokeWidth="11"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
            <p className="mt-9 max-w-xl text-[18px] leading-7 text-slate-600 md:mt-11 md:text-[20px] md:leading-8">
              Explore trusted manufacturers, their model line-ups and service reach, all in one place.
            </p>
          </div>

          {brands.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {["All", ...brands.map((b) => b.name)].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedBrand(name)}
                  className={`rounded-full border px-4 py-2 text-[15px] font-semibold transition-colors ${
                    selectedBrand === name
                      ? "border-[#0b3d32] bg-[#0b3d32] text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-3xl bg-slate-200" />
            ))}
          </div>
        ) : brands.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
            <p className="text-slate-500">No brands added yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleBrands.map((brand) => (
              <Link
                key={brand._id}
                href={`/brands/${brand.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-300/60"
              >
                {/* Watermark initial */}
                <span className="pointer-events-none absolute -right-2 -top-6 select-none text-[9rem] font-extrabold leading-none text-slate-900/[0.04]">
                  {brand.name.charAt(0)}
                </span>

                <div className="relative flex items-start justify-between">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain" />
                    ) : (
                      <CarFront className="h-10 w-10 text-slate-300" strokeWidth={1.25} />
                    )}
                  </div>
                  {brand.established && (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-600">
                      Est. {brand.established}
                    </span>
                  )}
                </div>

                <h3 className="relative mt-6 text-2xl font-extrabold tracking-[-0.02em] text-slate-900">
                  {brand.name}
                </h3>
                <p className="relative mt-1 text-base font-medium text-slate-500">
                  {brand.modelCount ?? 0} {(brand.modelCount ?? 0) === 1 ? "model" : "models"} available
                </p>

                <div className="relative mt-6 grid grid-cols-2 gap-3">
                  {stats(brand).map((s) => (
                    <div key={s.label} className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xl font-extrabold text-slate-900">
                        {s.value != null ? s.value.toLocaleString() : "—"}
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                <span className="relative mt-6 inline-flex items-center justify-between gap-2 rounded-full bg-[#0b3d32] px-6 py-3.5 text-base font-bold text-white transition group-hover:bg-[#082d25]">
                  Know more
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 flex items-center justify-end">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-base font-bold text-slate-700 transition hover:text-slate-900"
          >
            Explore all inventory
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
