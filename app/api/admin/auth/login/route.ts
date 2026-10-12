import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import {
  assertAuthConfigured,
  createSessionToken,
  isValidEmail,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
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
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
    return NextResponse.json(
      { error: "Admin login is not configured: set AUTH_SECRET to a random value of at least 32 characters, then restart the app." },
      { status: 503 },
    );
  }
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: "Admin login is not configured: set MONGODB_URI and restart the app." }, { status: 503 });
  }
  if (!process.env.MONGODB_ADMIN_DB?.trim()) {
    return NextResponse.json({ error: "Admin login is not configured: set MONGODB_ADMIN_DB and restart the app." }, { status: 503 });
  }
  if (process.env.MONGODB_ADMIN_DB.trim() === process.env.MONGODB_DB?.trim()) {
    return NextResponse.json({ error: "MONGODB_ADMIN_DB must be different from MONGODB_DB." }, { status: 503 });
  }

  try {
    assertAuthConfigured();
    const user = await (await getAdminsCollection()).findOne({ email: email.trim().toLowerCase() });
    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return NextResponse.json({ error: "Invalid admin email or password" }, { status: 401 });
    }

    const token = createSessionToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });
    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    const errorName = error && typeof error === "object" && "name" in error ? String(error.name) : "unknown";
    const errorCode = error && typeof error === "object" && "code" in error ? String(error.code) : "unknown";
    console.error("Admin login failed", { errorName, errorCode });
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
    return NextResponse.json({ error: "Unable to log in right now" }, { status: 500 });
  }
}
