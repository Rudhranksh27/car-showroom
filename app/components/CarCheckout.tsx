"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import type { Car } from "../lib/cars";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type CheckoutOrder = {
  mode: "razorpay";
  orderId: string;
  amount: number;
  currency: string;
  keyId?: string;
  carName: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CarCheckout({ car }: { car: Car }) {
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptReady(true);
    script.onerror = () => setError("Unable to load the Razorpay checkout. Please try again.");
    document.body.appendChild(script);

    return () => script.remove();
  }, []);

  async function verifyPayment(payment: RazorpayResponse, order: CheckoutOrder) {
    const response = await fetch("/api/razorpay/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: payment.razorpay_order_id,
        paymentId: payment.razorpay_payment_id,
        signature: payment.razorpay_signature,
      }),
    });

    if (!response.ok) throw new Error("Payment verification failed");
    setConfirmation(`VD-${order.orderId.slice(-6).toUpperCase()}`);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;

    if (!form) {
      setError("The payment form is unavailable. Please refresh and try again.");
      return;
    }

    const formData = new FormData(form);
    setError(null);
    setIsPaying(true);

    try {
      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId: car.id }),
      });
      const order = (await response.json()) as CheckoutOrder & { error?: string };

      if (!response.ok) throw new Error(order.error ?? "Unable to start payment");

      if (!scriptReady || !window.Razorpay || !order.keyId) {
        throw new Error("Razorpay checkout is still loading. Please try again.");
      }

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "VirtualDrive",
        description: `Booking token for ${car.name}`,
        order_id: order.orderId,
        prefill: {
          name: formData.get("name"),
          contact: formData.get("phone"),
        },
        theme: { color: "#78999a" },
        handler: (payment: RazorpayResponse) => {
          verifyPayment(payment, order).catch(() => setError("Payment completed but verification failed."));
        },
        modal: { ondismiss: () => setIsPaying(false) },
      });
      razorpay.open();
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "Unable to start payment");
      setIsPaying(false);
    }
  }

  if (confirmation) {
    return (
      <div className="border border-emerald-200 bg-emerald-50 p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Payment successful</p>
        <h2 className="mt-3 text-3xl font-black text-emerald-950">Your booking is confirmed.</h2>
        <p className="mt-3 text-sm leading-6 text-emerald-900">Your booking token for {car.name} has been received.</p>
        <div className="mt-6 border border-emerald-200 bg-white p-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Booking reference</p><p className="mt-1 text-2xl font-black tracking-wider text-slate-900">{confirmation}</p></div>
        <Link href={`/cars/${car.id}`} className="mt-7 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700">Back to car</Link>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-8 space-y-5 border border-slate-200 bg-white p-6 sm:p-8">
      <label className="block text-sm font-semibold text-slate-700">Full name<input required name="name" type="text" className="mt-2 w-full border border-slate-200 px-4 py-3 font-normal outline-none focus:border-sky-500" placeholder="Your name" /></label>
      <label className="block text-sm font-semibold text-slate-700">Phone number<input required name="phone" type="tel" className="mt-2 w-full border border-slate-200 px-4 py-3 font-normal outline-none focus:border-sky-500" placeholder="10-digit phone number" /></label>
      <label className="block text-sm font-semibold text-slate-700">Preferred dealer<select required name="dealer" defaultValue="" className="mt-2 w-full border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-sky-500"><option value="" disabled>Select a dealer</option><option>VirtualDrive Central</option><option>VirtualDrive North</option><option>VirtualDrive South</option></select></label>
      {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
      <button type="submit" disabled={isPaying} className="w-full rounded-full bg-[#0b3d32] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#082d25] disabled:cursor-wait disabled:opacity-60">{isPaying ? "Opening payment..." : "Pay ₹1,000 now"}</button>
      <p className="text-center text-xs text-slate-400">Test Mode booking token · Razorpay will not charge a real payment method.</p>
    </form>
  );
}
