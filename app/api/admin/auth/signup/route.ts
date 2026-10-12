import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import {
  assertAuthConfigured,
  isValidEmail,
  passwordValidationError,
} from "../../../../lib/auth";
import { getAdminsCollection } from "../../../../lib/mongodb";

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

  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
    return NextResponse.json(
      { error: "Sign-up is not configured: set AUTH_SECRET to a random value of at least 32 characters, then restart the app." },
      { status: 503 },
    );
  }
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: "Sign-up is not configured: set MONGODB_URI and restart the app." }, { status: 503 });
  }
  if (!process.env.MONGODB_ADMIN_DB?.trim()) {
    return NextResponse.json({ error: "Admin sign-up is not configured: set MONGODB_ADMIN_DB and restart the app." }, { status: 503 });
  }
  if (process.env.MONGODB_ADMIN_DB.trim() === process.env.MONGODB_DB?.trim()) {
    return NextResponse.json({ error: "MONGODB_ADMIN_DB must be different from MONGODB_DB." }, { status: 503 });
  }

  try {
    assertAuthConfigured();
    const admins = await getAdminsCollection();
    const normalizedEmail = email.trim().toLowerCase();
    const existingAdmin = await admins.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return NextResponse.json({ error: "An admin account with this email already exists" }, { status: 409 });
    }

    const user = {
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role: "ADMIN" as const,
      createdAt: new Date(),
    };
    await admins.insertOne(user);
    const response = NextResponse.json(
      { success: true },
      { status: 201 },
    );
    return response;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json({ error: "An admin account with this email already exists" }, { status: 409 });
    }

    const errorName = error && typeof error === "object" && "name" in error ? String(error.name) : "unknown";
    const errorCode = error && typeof error === "object" && "code" in error ? String(error.code) : "unknown";
    console.error("Admin signup failed", { errorName, errorCode });
    if (error instanceof Error && error.message === "MONGODB_ADMIN_DB must be different from MONGODB_DB") {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    if (
      errorName === "MongoServerSelectionError" ||
      errorName === "MongoNetworkError" ||
      errorName === "MongoParseError"
    ) {
      return NextResponse.json({ error: "Cannot connect to MongoDB. Check your database configuration." }, { status: 503 });
    }
    return NextResponse.json({ error: "Unable to create an admin account right now" }, { status: 500 });
  }
}
