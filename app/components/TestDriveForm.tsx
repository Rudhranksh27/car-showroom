 "use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import type { Car } from "../lib/cars";
import AlreadyBookedModal from "./AlreadyBookedModal";

type TestDriveFormProps = {
  car: Car;
};

export default function TestDriveForm({ car }: TestDriveFormProps) {
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAlreadyBooked, setShowAlreadyBooked] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    setNeedsLogin(false);
    setIsSaving(true);

    try {
      const response = await fetch("/api/bookings/test-drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car.id,
          carName: car.name,
          price: car.price,
          name: formData.get("name"),
          phone: formData.get("phone"),
          date: formData.get("date"),
          time: formData.get("time"),
          location: formData.get("location"),
        }),
      });
      const result = (await response.json()) as { reference?: string; error?: string };

      if (response.status === 401) setNeedsLogin(true);
      if (response.status === 409) {
        setShowAlreadyBooked(true);
        return;
      }
      if (!response.ok || !result.reference) throw new Error(result.error ?? "Unable to save your booking");

      setBookingReference(result.reference);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save your booking");
    } finally {
      setIsSaving(false);
    }
  }

  if (bookingReference) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Booking confirmed</p>
        <h2 className="mt-3 text-3xl font-extrabold text-emerald-950">Your test drive is reserved.</h2>
        <p className="mt-3 text-base leading-7 text-emerald-900">We will contact you shortly to confirm the appointment details for {car.name}.</p>
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Booking reference</p>
          <p className="mt-1 text-2xl font-extrabold tracking-wider text-slate-900">{bookingReference}</p>
        </div>
        <Link href="/" className="mt-7 inline-flex rounded-full bg-slate-900 px-6 py-3 text-base font-bold text-white hover:bg-slate-700">Back to home</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-base font-bold text-slate-800">Full name<input required name="name" type="text" placeholder="Your name" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0b3d32] focus:bg-white focus:ring-4 focus:ring-[#0b3d32]/10" /></label>
        <label className="text-base font-bold text-slate-800">Phone number<input required name="phone" type="tel" placeholder="10-digit phone number" pattern="[0-9+() -]{8,}" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0b3d32] focus:bg-white focus:ring-4 focus:ring-[#0b3d32]/10" /></label>
        <label className="text-base font-bold text-slate-800">Preferred date<input required name="date" type="date" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0b3d32] focus:bg-white focus:ring-4 focus:ring-[#0b3d32]/10" /></label>
        <label className="text-base font-bold text-slate-800">Preferred time<select required name="time" defaultValue="" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base font-normal text-slate-900 outline-none transition focus:border-[#0b3d32] focus:bg-white focus:ring-4 focus:ring-[#0b3d32]/10"><option value="" disabled>Select a time</option><option>10:00 AM - 12:00 PM</option><option>12:00 PM - 2:00 PM</option><option>4:00 PM - 6:00 PM</option></select></label>
        <label className="text-base font-bold text-slate-800 sm:col-span-2">Location<input required name="location" type="text" placeholder="City or area" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0b3d32] focus:bg-white focus:ring-4 focus:ring-[#0b3d32]/10" /></label>
      </div>
      {error && (
        <p role="alert" className="text-base font-medium text-red-600">
          {error}
          {needsLogin && (
            <>
              {" "}
              <Link href="/login" className="underline">Log in</Link>
            </>
          )}
        </p>
      )}
      <button type="submit" disabled={isSaving} className="w-full rounded-full bg-[#0b3d32] px-6 py-4 text-base font-bold shadow-lg shadow-[#0b3d32]/20 text-white transition hover:bg-[#082d25] disabled:cursor-wait disabled:opacity-60">{isSaving ? "Saving..." : "Confirm test drive"}</button>
      {showAlreadyBooked && <AlreadyBookedModal carName={car.name} onClose={() => setShowAlreadyBooked(false)} />}
    </form>
  );
}
