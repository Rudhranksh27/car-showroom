import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, Scale } from "lucide-react";
import Navbar from "../../components/Navbar";
import { cars, getCarById } from "../../lib/cars";

type CarDetailPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return cars.map((car) => ({ id: car.id }));
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = await params;
  const car = getCarById(id);

  if (!car) notFound();

  return (
    <main className="min-h-screen bg-[#f6f8fa] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/cars" className="text-sm font-semibold text-slate-500 transition-colors hover:text-sky-600">
          ← Back to Inventory
        </Link>

        <section className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="flex aspect-16/11 items-center justify-center bg-white p-8">
            <img src={car.image} alt={car.alt} className="h-full w-full object-contain" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">{car.brand} · {car.category}</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-5xl">{car.name}</h1>
            <p className="mt-4 text-lg font-semibold text-slate-600">{car.price} onwards · Petrol · Manual</p>
            <p className="mt-3 text-sm text-slate-500">Available at 3 dealers</p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              In Stock
            </div>

            <div className="mt-9 border-t border-slate-200 pt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Ready to make it yours?</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link href={`/cars/${car.id}/checkout`} className="inline-flex items-center justify-center rounded-full bg-[#0b3d32] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0b3d32]/20 transition hover:bg-[#082d25]">
                  🚗 Book Now
                </Link>
                <Link href={`/cars/${car.id}/book-test-drive`} className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-sky-500 hover:text-sky-600">
                  📅 Test Drive
                </Link>
                <button type="button" aria-label={`Save ${car.name}`} title="Save car" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-900 hover:text-slate-900">
                  <Heart className="h-5 w-5" />
                </button>
                <button type="button" aria-label={`Compare ${car.name}`} title="Compare car" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-900 hover:text-slate-900">
                  <Scale className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-6 text-sm text-slate-500">Or call: <a href="tel:+919999999999" className="font-semibold text-slate-900 hover:text-sky-600">+91 99999 99999</a></p>
            </div>
          </div>
        </section>

        <section className="mt-16 border-y border-slate-200 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Vehicle overview</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div><p className="text-sm text-slate-500">Fuel type</p><p className="mt-1 font-bold">Petrol</p></div>
            <div><p className="text-sm text-slate-500">Transmission</p><p className="mt-1 font-bold">Manual</p></div>
            <div><p className="text-sm text-slate-500">Availability</p><p className="mt-1 font-bold">3 dealers nearby</p></div>
          </div>
        </section>
      </div>
    </main>
  );
}
