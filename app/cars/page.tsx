 import Link from "next/link";
import Navbar from "../components/Navbar";
import { cars } from "../lib/cars";

type CarsPageProps = {
  searchParams: Promise<{ brand?: string; category?: string; purpose?: string }>;
};

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const filters = await searchParams;
  const filteredCars = cars.filter((car) => {
    const matchesBrand = !filters.brand || car.brand.toLowerCase() === filters.brand.toLowerCase();
    const matchesCategory = !filters.category || filters.category.toLowerCase() === "all" || car.category.toLowerCase() === filters.category.toLowerCase();
    return matchesBrand && matchesCategory;
  });
  const isTestDrive = filters.purpose === "test-drive";

  return (
    <main className="min-h-screen bg-[#f6f8fa] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">{isTestDrive ? "Test drive stock" : "VirtualDrive inventory"}</p>
        <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-[-0.04em]">{filters.brand ? `${filters.brand} cars` : filters.category && filters.category.toLowerCase() !== "all" ? `${filters.category} cars` : "Available cars"}</h1>
            <p className="mt-3 text-slate-500">{filteredCars.length} mock vehicles available to explore.</p>
          </div>
          <Link href="/book-test-drive" className="w-fit rounded-full bg-[#0b3d32] px-5 py-3 text-sm font-bold text-white hover:bg-[#082d25]">Change selection</Link>
        </div>

        {filteredCars.length === 0 ? (
          <div className="mt-12 border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-xl font-bold">No cars found for this selection</h2>
            <Link href="/cars" className="mt-4 inline-block font-semibold text-sky-600">View all cars →</Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCars.map((car) => (
              <article key={car.id} className="overflow-hidden border border-slate-200 bg-white">
                <Link href={`/cars/${car.id}`} className="flex aspect-16/10 items-center justify-center bg-slate-100 p-5">
                  <img src={car.image} alt={car.alt} className="h-full w-full object-contain" />
                </Link>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{car.brand} · {car.category}</p>
                  <h2 className="mt-2 text-lg font-bold"><Link href={`/cars/${car.id}`} className="hover:text-sky-600">{car.name}</Link></h2>
                  <p className="mt-2 text-sm font-semibold text-slate-600">{car.price}</p>
                  <Link href={`/cars/${car.id}/book-test-drive`} className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#0b3d32] px-4 py-3 text-sm font-bold text-white hover:bg-[#082d25]">Book test drive</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
