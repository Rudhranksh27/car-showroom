import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../lib/auth";
import { resolveCheckoutCar } from "../../../lib/checkout-car";
import { ALREADY_BOOKED_MESSAGE, cleanString, hasUserBooked } from "../../../lib/bookings";

const BOOKING_AMOUNT = 100000;

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to book a car" }, { status: 401 });
    }

    const { carId, carName } = (await request.json()) as { carId?: string; carName?: string };
    const car = carId ? await resolveCheckoutCar(carId, cleanString(carName) || undefined) : null;

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Checked before any payment starts, so nobody pays for a booking that would be rejected.
    if (await hasUserBooked(user.id, "buy now", car.id, car.name)) {
      return NextResponse.json({ error: ALREADY_BOOKED_MESSAGE, code: "already-booked" }, { status: 409 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Razorpay Test Mode keys are not configured on the server" },
        { status: 503 },
      );
    }

    const credentials = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`,
    ).toString("base64");
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: BOOKING_AMOUNT,
        currency: "INR",
        receipt: `booking_${car.id}_${Date.now()}`,
        notes: { car_id: car.id, car_name: car.name },
      }),
    });
    const order = (await razorpayResponse.json()) as {
      id: string;
      amount: number;
      currency: string;
    };

    if (!razorpayResponse.ok) {
      return NextResponse.json({ error: "Razorpay could not create the order" }, { status: 502 });
    }

    return NextResponse.json({
      mode: "razorpay",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      carName: car.name,
    });
  } catch {
    return NextResponse.json({ error: "Unable to create payment order" }, { status: 500 });
  }
}
