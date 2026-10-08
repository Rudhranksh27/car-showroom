import Link from "next/link";
import Navbar from "../components/Navbar";
import { carBrands, cars } from "../lib/cars";

const popularCars = cars.slice(0, 6);

export default function BookTestDrivePage() {
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
