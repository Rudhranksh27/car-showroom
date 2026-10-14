import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { assertAuthConfigured, createSessionToken, isValidEmail } from "../../../lib/auth";
import { getAdminsCollection } from "../../../lib/mongodb-admin";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from "../../../lib/admin-auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Enter your email and password" }, { status: 400 });
  }

  const { email, password } = body as Record<string, unknown>;
  if (
    typeof email !== "string" ||
    !isValidEmail(email.trim()) ||
    typeof password !== "string" ||
    password.length === 0
  ) {
    return NextResponse.json({ error: "Enter a valid email and password" }, { status: 400 });
  }
  if (Buffer.byteLength(password, "utf8") > 72) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  try {
    assertAuthConfigured();
    const admins = await getAdminsCollection();
    const admin = await admins.findOne({ email: email.trim().toLowerCase() });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = createSessionToken({ id: admin._id.toString(), name: admin.name, email: admin.email });
    const response = NextResponse.json({ admin: { id: admin._id.toString(), name: admin.name, email: admin.email } });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to log in right now" }, { status: 500 });
  }
}
