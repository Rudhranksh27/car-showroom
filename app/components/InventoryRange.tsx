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

  return (
    <section className="w-full bg-[#f3f3f3] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Browse by Brand
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-900 md:text-4xl">
              Find your perfect match
            </h2>
          </div>

          {brands.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {["All", ...brands.map((b) => b.name)].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedBrand(name)}
                  className={`rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
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
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-[24px] bg-slate-200" />
            ))}
          </div>
        ) : brands.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
            <p className="text-slate-500">No brands added yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleBrands.map((brand) => (
              <article
                key={brand._id}
                className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
              >
                {/* Brand image / logo area */}
                <div className="flex h-44 items-center justify-center overflow-hidden rounded-[18px] bg-gradient-to-br from-slate-100 to-slate-200">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-28 w-full object-contain px-8"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <CarFront className="h-16 w-16 text-slate-300" strokeWidth={1} />
                      <span className="text-2xl font-black text-slate-300">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-[18px] border border-slate-200 bg-white p-4">
                  <h3 className="text-xl font-black tracking-[-0.02em] text-slate-900">
                    {brand.name}
                  </h3>

                  {/* Stats grid */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Models</p>
                      <p className="mt-0.5 text-base font-black text-slate-900">{brand.modelCount ?? 0}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Service Centers</p>
                      <p className="mt-0.5 text-base font-black text-slate-900">
                        {brand.serviceCenters != null ? brand.serviceCenters.toLocaleString() : "—"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Sold This Year</p>
                      <p className="mt-0.5 text-base font-black text-slate-900">
                        {brand.soldThisYear != null ? brand.soldThisYear.toLocaleString() : "—"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Sold This Month</p>
                      <p className="mt-0.5 text-base font-black text-slate-900">
                        {brand.soldThisMonth != null ? brand.soldThisMonth.toLocaleString() : "—"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/brands/${brand.slug}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0b3d32] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#082d25]"
                  >
                    Know more
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-end">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-slate-900"
          >
            Explore all inventory
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
