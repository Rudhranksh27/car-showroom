import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../lib/auth";
import { addUserBooking, ALREADY_BOOKED_MESSAGE, cleanString } from "../../../lib/bookings";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to book a test drive" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
    }

    const carId = cleanString(body.carId);
    const carName = cleanString(body.carName);
    const contactName = cleanString(body.name);
    const phone = cleanString(body.phone, 30);
    const date = cleanString(body.date, 20);
    const time = cleanString(body.time, 40);
    const location = cleanString(body.location);

    if (!carId || !carName || !contactName || !phone || !date || !time || !location) {
      return NextResponse.json({ error: "Please fill in all the booking details" }, { status: 400 });
    }

    const reference = `VD-${carId.slice(0, 4).toUpperCase()}-${randomInt(1000, 10000)}`;
    const result = await addUserBooking(user.id, {
      action: "test drive booking",
      reference,
      carId,
      carName,
      price: cleanString(body.price, 60) || undefined,
      contactName,
      phone,
      date,
      time,
      location,
      createdAt: new Date(),
    });

    if (result === "duplicate") {
      return NextResponse.json({ error: ALREADY_BOOKED_MESSAGE, code: "already-booked" }, { status: 409 });
    }
    if (result === "no-user") {
      return NextResponse.json({ error: "Your account could not be found. Please log in again." }, { status: 404 });
    }

    return NextResponse.json({ reference });
  } catch {
    return NextResponse.json({ error: "Unable to save your booking right now" }, { status: 500 });
  }
}
