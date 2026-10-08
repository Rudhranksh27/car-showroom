import { NextResponse } from "next/server";
import { getCarById } from "../../../lib/cars";

const BOOKING_AMOUNT = 100000;

export async function POST(request: Request) {
  try {
    const { carId } = (await request.json()) as { carId?: string };
    const car = carId ? getCarById(carId) : undefined;

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
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
