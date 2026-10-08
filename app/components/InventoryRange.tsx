"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type BrandModelInfo = {
  name: string;
  slug: string;
  count: number;
  image: string;
};

const brandCatalog: BrandModelInfo[] = [
  {
    name: "Maruti Suzuki",
    slug: "maruti-suzuki",
    count: 6,
    image: "/carImages/maruati.png",
  },
  {
    name: "Tata",
    slug: "tata",
    count: 7,
    image: "/carImages/punch%20(2).png",
  },
  {
    name: "Hyundai",
    slug: "hyundai",
    count: 7,
    image: "/carImages/c3.png",
  },
  {
    name: "Kia",
    slug: "kia",
    count: 5,
    image: "/carImages/sonet.png",
  },
  {
    name: "Mahindra",
    slug: "mahindra",
    count: 7,
    image: "/carImages/mahindra.png",
  },
  {
    name: "Renault",
    slug: "renault",
    count: 3,
    image: "/carImages/Duster.png",
  },
  {
    name: "Toyota",
    slug: "toyota",
    count: 5,
    image: "/carImages/toyota.png",
  },
  {
    name: "Honda",
    slug: "honda",
    count: 5,
    image: "/carImages/honda.png",
  },
];

const brandOptions = ["All", ...brandCatalog.map((brand) => brand.name)];

export default function InventoryRange() {
  const [selectedBrand, setSelectedBrand] = useState("All");

  const visibleBrands = useMemo(() => {
    if (selectedBrand === "All") return brandCatalog;
    return brandCatalog.filter((brand) => brand.name === selectedBrand);
  }, [selectedBrand]);

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

          <div className="flex flex-wrap gap-2">
            {brandOptions.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrand(brand)}
                className={`rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
                  selectedBrand === brand
                    ? "border-[#0b3d32] bg-[#0b3d32] text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleBrands.map((brand) => (
            <article
              key={brand.name}
              className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
            >
              <div className="overflow-hidden rounded-[18px] bg-slate-100">
                <img src={brand.image} alt={brand.name} className="h-52 w-full object-cover" />
              </div>

              <div className="mt-4 rounded-[18px] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-black tracking-[-0.02em] text-slate-900">{brand.name}</h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                    Models {brand.count}
                  </span>
                </div>

                <Link
                  href={brand.slug === "maruti-suzuki" ? "/maruti-suzuki" : `/cars?brand=${encodeURIComponent(brand.slug)}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0b3d32] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#082d25]"
                >
                  Know more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

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
