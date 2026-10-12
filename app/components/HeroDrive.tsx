 import Link from "next/link";
import CarSlider from "./CarSlider";

export default function HeroDrive() {
  return (
    <section
      style={{ backgroundColor: "#f5f5f5" }}
      className="w-full py-10 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 rounded-[2rem] border border-slate-200 bg-[#f4f4f4] px-6 py-10 md:px-10 lg:grid-cols-12 lg:px-12 lg:py-14">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1aa7eb]">
              PREMIUM SHOWROOM
            </p>

            <h1 className="mt-5 text-4xl font-black leading-[0.96] tracking-[-0.04em] text-slate-900 md:text-[5rem]">
              Find Your Next
              <span className="block">Drive</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
              Explore handpicked models, compare features, and reserve the right fit for your lifestyle in minutes.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/inventory"
                className="inline-flex items-center justify-center rounded-full bg-[#1aa7eb] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-sky-600"
              >
                Browse Inventory →
              </Link>

              <Link
                href="/book-test-drive"
                className="inline-flex items-center text-sm font-semibold text-slate-700 transition-colors hover:text-slate-900"
              >
                Book a Test Drive
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-400">
              <span>500+ cars</span>
              <span className="text-slate-300">•</span>
              <span>50+ brands</span>
              <span className="text-slate-300">•</span>
              <span>Instant booking</span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <CarSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
