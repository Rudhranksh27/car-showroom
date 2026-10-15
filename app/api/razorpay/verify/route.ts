import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../lib/auth";
import { addUserBooking, ALREADY_BOOKED_MESSAGE, cleanString } from "../../../lib/bookings";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to book a car" }, { status: 401 });
    }

    const { orderId, paymentId, signature, carId, carName, price, name, phone } = (await request.json()) as {
      orderId?: string;
      paymentId?: string;
      signature?: string;
      carId?: string;
      carName?: string;
      price?: string;
      name?: string;
      phone?: string;
    };

    if (!orderId || !paymentId || !signature || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Payment verification details are incomplete" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ verified: false }, { status: 400 });
    }

    const reference = `VD-${orderId.slice(-6).toUpperCase()}`;
    const result = await addUserBooking(user.id, {
      action: "buy now",
      reference,
      carId: cleanString(carId),
      carName: cleanString(carName),
      price: cleanString(price, 60) || undefined,
      contactName: cleanString(name) || user.name,
      phone: cleanString(phone, 30),
      paymentId,
      createdAt: new Date(),
    });
    if (result === "duplicate") {
      return NextResponse.json({ error: ALREADY_BOOKED_MESSAGE, code: "already-booked" }, { status: 409 });
    }
    if (result !== "saved") {
      return NextResponse.json({ error: "Payment verified but your booking could not be saved" }, { status: 500 });
    }

    return NextResponse.json({ verified: true, reference });
  } catch {
    return NextResponse.json({ error: "Unable to verify payment" }, { status: 500 });
  }
}
