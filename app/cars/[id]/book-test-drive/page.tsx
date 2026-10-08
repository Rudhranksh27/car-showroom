import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar";
import TestDriveForm from "../../../components/TestDriveForm";
import { cars, getCarById } from "../../../lib/cars";

type BookingPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ variant?: string | string[] }>;
};

export function generateStaticParams() {
  return cars.map((car) => ({ id: car.id }));
}

export default async function CarBookingPage({ params, searchParams }: BookingPageProps) {
  const [{ id }, { variant }] = await Promise.all([params, searchParams]);
  const car = getCarById(id);

  if (!car) notFound();

  const selectedVariant = typeof variant === "string" ? variant : undefined;
  const bookingCar = selectedVariant ? { ...car, name: selectedVariant } : car;

  return (
    <main className="min-h-screen bg-[#f6f8fa] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/book-test-drive" className="text-sm font-semibold text-slate-500 hover:text-sky-600">← Choose another car</Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <div className="flex aspect-16/11 items-center justify-center bg-white p-8">
              <img src={car.image} alt={car.alt} className="h-full w-full object-contain" />
            </div>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">{car.brand} · {car.category}</p>
              <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] md:text-4xl">Book a test drive for {bookingCar.name}</h1>
              <p className="mt-3 text-lg font-semibold text-slate-600">{bookingCar.price}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Your details</p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em]">Choose a time that works for you</h2>
            <p className="mt-3 mb-7 text-sm leading-6 text-slate-500">This is a mock booking flow. Submit the form to receive a sample booking reference.</p>
            <TestDriveForm car={bookingCar} />
          </div>
        </div>
      </div>
    </main>
  );
}
