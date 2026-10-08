import crypto from "node:crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { orderId, paymentId, signature } = (await request.json()) as {
      orderId?: string;
      paymentId?: string;
      signature?: string;
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

    return NextResponse.json({ verified: true });
  } catch {
    return NextResponse.json({ error: "Unable to verify payment" }, { status: 500 });
  }
}
