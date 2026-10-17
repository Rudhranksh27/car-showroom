import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Navbar from "../../../components/Navbar";
import TestDriveForm from "../../../components/TestDriveForm";
import { cars, getCarById } from "../../../lib/cars";
import { getModelsCollection } from "../../../lib/mongodb-catalog";

export const dynamic = "force-dynamic";

type BookingPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ variant?: string | string[] }>;
};

export function generateStaticParams() {
  return cars.map((car) => ({ id: car.id }));
}

export default async function CarBookingPage({ params, searchParams }: BookingPageProps) {
  const [{ id }, { variant }] = await Promise.all([params, searchParams]);
  const selectedVariant = typeof variant === "string" ? variant : undefined;

  // Cars managed in the admin book through the single booking page, so every entry point lands in the same flow.
  let inCatalog = false;
  try {
    inCatalog = !!(await (await getModelsCollection()).findOne({ slug: id, published: { $ne: false } }));
  } catch {
    inCatalog = false;
  }
  if (inCatalog) {
    const params = new URLSearchParams({ model: id });
    if (selectedVariant) params.set("variant", selectedVariant);
    redirect(`/book-test-drive?${params.toString()}${selectedVariant ? "#book" : "#variants"}`);
  }

  const car = getCarById(id);
  if (!car) notFound();
  const bookingCar = selectedVariant ? { ...car, name: selectedVariant } : car;

  return (
    <main className="min-h-screen bg-[#f3f3f3] font-[family-name:var(--font-jakarta)] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/book-test-drive#results" className="text-base font-bold text-[#0b3d32] hover:underline">← Choose another car</Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <div className="flex aspect-[1.6] items-center justify-center rounded-3xl bg-gradient-to-br from-slate-50 to-slate-200 p-8">
              <img src={car.image} alt={car.alt} className="h-full w-full object-contain" />
            </div>
            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">{car.brand} · {car.category}</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">Book a test drive for {bookingCar.name}</h1>
              <p className="mt-3 text-lg font-semibold text-slate-600">{bookingCar.price}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Your details</p>
            <h2 className="mt-3 mb-7 text-2xl font-extrabold tracking-[-0.02em]">Choose a time that works for you</h2>
            <TestDriveForm car={bookingCar} />
          </div>
        </div>
      </div>
    </main>
  );
}
