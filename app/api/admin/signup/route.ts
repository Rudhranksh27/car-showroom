import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { assertAuthConfigured, createSessionToken, isValidEmail, passwordValidationError } from "../../../lib/auth";
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
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
  }

  const { name, email, password } = body as Record<string, unknown>;
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80) {
    return NextResponse.json({ error: "Name must be between 2 and 80 characters" }, { status: 400 });
  }
  if (typeof email !== "string" || !isValidEmail(email.trim())) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (typeof password !== "string") {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }
  const passwordError = passwordValidationError(password);
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
    return NextResponse.json(
      { error: "Admin signup is not configured: set AUTH_SECRET, then restart the app." },
      { status: 503 },
    );
  }
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "Admin signup is not configured: set MONGODB_URI, then restart the app." },
      { status: 503 },
    );
  }
  if (!process.env.MONGODB_ADMIN_DB) {
    return NextResponse.json(
      { error: "Admin signup is not configured: set MONGODB_ADMIN_DB, then restart the app." },
      { status: 503 },
    );
  }

  try {
    assertAuthConfigured();
    const admins = await getAdminsCollection();
    const existing = await admins.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 409 });
    }

    const admin = {
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      createdAt: new Date(),
    };
    const result = await admins.insertOne(admin);
    const token = createSessionToken({ id: result.insertedId.toString(), name: admin.name, email: admin.email });

    const response = NextResponse.json(
      { admin: { id: result.insertedId.toString(), name: admin.name, email: admin.email } },
      { status: 201 },
    );
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 409 });
    }
    console.error("Admin signup failed", error);
    return NextResponse.json({ error: "Signup failed due to a server error." }, { status: 500 });
  }
}
