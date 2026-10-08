import Link from "next/link";
import { notFound } from "next/navigation";
import CarCheckout from "../../../components/CarCheckout";
import Navbar from "../../../components/Navbar";
import { cars, getCarById } from "../../../lib/cars";

type CheckoutPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return cars.map((car) => ({ id: car.id }));
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = await params;
  const car = getCarById(id);

  if (!car) notFound();

  return (
    <main className="min-h-screen bg-[#f6f8fa] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <Link href={`/cars/${car.id}`} className="text-sm font-semibold text-slate-500 hover:text-sky-600">← Back to {car.name}</Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Mock checkout</p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.04em]">Book your {car.name}</h1>
        <p className="mt-3 text-slate-500">Pay the booking token securely in Razorpay Test Mode.</p>
        <CarCheckout car={car} />
      </div>
    </main>
  );
}
