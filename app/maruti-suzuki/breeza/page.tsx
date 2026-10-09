"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { useMemo, useState } from "react";

const tabs = [
  "THAR OG",
  "PRICE",
  "COMPARE",
  "IMAGES",
  "SPECS",
  "USER REVIEWS",
  "VARIANTS",
  "VIDEOS",
  "NEWS",
  "MORE",
];

const variants = [
  { name: "Brezza LXI", desc: "Base Model", fuel: "Petrol", transmission: "Manual", specs: "1462 cc, Manual, Petrol", price: "₹8.34 Lakh*" },
  { name: "Brezza VXI", desc: "", fuel: "Petrol", transmission: "Manual", specs: "1462 cc, Manual, Petrol", price: "₹9.10 Lakh*" },
  { name: "Brezza ZXI", desc: "", fuel: "Petrol", transmission: "Manual", specs: "1462 cc, Manual, Petrol", price: "₹10.50 Lakh*" },
  { name: "Brezza ZXI+ AT", desc: "", fuel: "Petrol", transmission: "Automatic", specs: "1462 cc, Automatic, Petrol", price: "₹12.00 Lakh*" },
];

export default function MarutiSuzukiPage() {
  const [fuelFilter, setFuelFilter] = useState("All");
  const [transmissionFilter, setTransmissionFilter] = useState("All");
  const [openVariantMenu, setOpenVariantMenu] = useState<string | null>(null);

  const visibleVariants = useMemo(() => {
    return variants.filter((variant) => {
      const matchesFuel = fuelFilter === "All" || variant.fuel === fuelFilter;
      const matchesTransmission = transmissionFilter === "All" || variant.transmission === transmissionFilter;
      return matchesFuel && matchesTransmission;
    });
  }, [fuelFilter, transmissionFilter]);

  return (
    <main className="min-h-screen bg-[#f3f3f3] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-6 border-b border-slate-200 bg-[#f3f3f3] pb-2">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`text-sm font-semibold uppercase tracking-[0.08em] transition-colors ${
                index === 0
                  ? "border-b-2 border-[#ef6a3a] pb-3 text-[#ef6a3a]"
                  : "pb-3 text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <section className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <div className="rounded-[28px] border border-slate-200 bg-[#dfe2e3] p-5 sm:p-6">
            <div className="relative h-105 w-full overflow-hidden rounded-[20px] bg-[#dfe2e3]">
              <Image
                src="/carImages/maruati.png"
                alt="Maruti Suzuki Brezza"
                fill
                className="object-contain"
                priority
              />
              <button
                type="button"
                aria-label="Next image"
                className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-slate-700 shadow-sm"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                114 Photos
              </button>
              <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                8 Colors
              </button>
              <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                Shorts
              </button>
            </div>
          </div>

          <div className="pt-2">
            <h1 className="text-4xl font-black tracking-[-0.04em] text-slate-900 md:text-5xl">
              Maruti Suzuki Brezza
            </h1>

            <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              <span className="flex items-center gap-1 text-[#f5a623]">
                <Star className="h-4 w-4 fill-current" />
                4.8
              </span>
              <span className="text-slate-500">•</span>
              <span>2 Reviews</span>
              <span className="text-slate-500">•</span>
              <span>Rate &amp; Win ₹1000</span>
            </div>

            <div className="mt-8 text-4xl font-black tracking-[-0.04em] text-slate-900">
              <span>₹ 7.40 - 13.71 Lakh*</span>
              <span className="ml-3 text-lg font-semibold text-slate-600">Get On-Road Price</span>
            </div>

            <p className="mt-2 text-sm text-slate-500">*Ex-Showroom Price in New Delhi</p>

            <Link
              href="/book-test-drive"
              className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-[#f77b42] px-6 py-4 text-lg font-bold text-white shadow-lg shadow-[#f77b42]/25 transition hover:bg-[#ec6a2b]"
            >
              Get Navaratri Offers
            </Link>

            <a
              href="/brochure/brezza/Brochure.pdf"
              download="Maruti-Suzuki-Brezza-Brochure.pdf"
              className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-[#f77b42] bg-white px-6 py-4 text-lg font-bold text-[#f77b42] transition hover:bg-orange-50"
            >
              Download Brochure
            </a>

            <div className="mt-8 flex items-center gap-3 text-lg font-semibold text-slate-700">
              <span className="text-2xl text-[#f77b42]">⏱</span>
              Hurry up to lock festive offers!
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[26px] border border-slate-200 bg-white p-6 sm:p-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-[#1a8978]">
            OUR PROMISE
          </p>

          <h2 className="mt-4 text-center text-3xl font-black tracking-[-0.03em] text-slate-900 sm:text-4xl">
            Zero fees. Full support.
          </h2>

          <p className="mt-4 text-center text-lg text-slate-600">
            We handle the booking. Your dealer handles the ownership. No hidden charges — ever.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center gap-3 text-xl font-black text-slate-900">
                <span className="text-2xl">💰</span>
                <span>WE HANDLE</span>
              </div>
              <ul className="space-y-2 text-base text-slate-700">
                <li>• Zero fees</li>
                <li>• Free delivery</li>
                <li>• Home test</li>
                <li>• Transparent pricing</li>
              </ul>
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center gap-3 text-xl font-black text-slate-900">
                <span className="text-2xl">🤝</span>
                <span>DEALER HANDLES</span>
              </div>
              <ul className="space-y-2 text-base text-slate-700">
                <li>• Insurance</li>
                <li>• Servicing</li>
                <li>• Warranty</li>
                <li>• RTO</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[26px] border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-900 sm:text-4xl">
            Maruti Suzuki Brezza Price &amp; Variants
          </h2>

          <p className="mt-6 max-w-5xl text-lg leading-8 text-slate-600">
            The Maruti Suzuki Brezza is offered in 19 total configurations split across four core
            variant trims: <span className="font-semibold text-slate-900">LXi</span>, <span className="font-semibold text-slate-900">VXi</span>, <span className="font-semibold text-slate-900">ZXi</span>, and <span className="font-semibold text-slate-900">ZXi Plus</span>.
            Prices range from <span className="font-semibold text-slate-900">₹7.40 lakh</span> to <span className="font-semibold text-slate-900">₹13.71 lakh</span> (ex-showroom).
          </p>
        </section>

        <section className="mt-10 rounded-[26px] border border-slate-200 bg-white p-4 sm:p-5">
          <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap gap-2 pb-3">
              {[
                "All",
                "Petrol",
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFuelFilter(option)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                    fuelFilter === option
                      ? "border-[#1a8978] bg-[#1a8978] text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-3">
              {[
                "All",
                "Automatic",
                "Manual",
              ].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTransmissionFilter(option)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                    transmissionFilter === option
                      ? "border-[#1a8978] bg-[#1a8978] text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-[1.3fr_1fr_1fr] gap-3 border-b border-slate-200 pb-3 text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
            <div>Variant</div>
            <div>Ex-Showroom Price</div>
            <div>Action</div>
          </div>

          {visibleVariants.map((variant) => (
            <div key={variant.name} className="grid grid-cols-[1.3fr_1fr_1fr] items-center gap-3 border-b border-slate-200 py-4 last:border-b-0">
              <div>
                <div className="text-lg font-bold text-slate-900">{variant.name}</div>
                {variant.desc ? <div className="mt-1 text-sm text-slate-500">{variant.desc}</div> : null}
                <div className="mt-2 text-sm text-slate-600">{variant.specs}</div>
              </div>

              <div>
                <div className="text-lg font-bold text-slate-900">{variant.price}</div>
                <a href="#" className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
                  Get On-Road Price
                </a>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" className="rounded-full border border-[#f59e67] bg-white px-4 py-2 text-sm font-bold text-[#f77b42] hover:bg-orange-50">
                  Get Festive Offers
                </button>
                <div className="group relative">
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={openVariantMenu === variant.name}
                    onClick={() =>
                      setOpenVariantMenu((current) =>
                        current === variant.name ? null : variant.name,
                      )
                    }
                    className="rounded-full bg-[#0b3d32] px-4 py-2 text-sm font-bold text-white hover:bg-[#082d25]"
                  >
                    Book Now
                  </button>
                  <div
                    className={`absolute right-0 top-full z-10 w-52 pt-2 ${
                      openVariantMenu === variant.name ? "block" : "hidden"
                    } group-hover:block group-focus-within:block`}
                  >
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                      <Link
                        href={`/cars/maruti-brezza-zxi/book-test-drive?variant=${encodeURIComponent(variant.name)}`}
                        className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Book a Test Drive
                      </Link>
                      <Link
                        href={`/cars/maruti-brezza-zxi/checkout?variant=${encodeURIComponent(variant.name)}`}
                        className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
