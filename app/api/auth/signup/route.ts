import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { assertAuthConfigured, createSessionToken, isValidEmail, passwordValidationError, SESSION_COOKIE, SESSION_MAX_AGE } from "../../../lib/auth";
import { getUsersCollection } from "../../../lib/mongodb";

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
      { error: "Signup is not configured: set AUTH_SECRET to a random value of at least 32 characters, then restart the app." },
      { status: 503 },
    );
  }
  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "Signup is not configured: set MONGODB_URI to your MongoDB connection string, then restart the app." },
      { status: 503 },
    );
  }

  try {
    assertAuthConfigured();
    const users = await getUsersCollection();
    const existingUser = await users.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const user = {
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      createdAt: new Date(),
    };
    const result = await users.insertOne(user);
    const token = createSessionToken({ id: result.insertedId.toString(), name: user.name, email: user.email });
    const response = NextResponse.json({
      user: { id: result.insertedId.toString(), name: user.name, email: user.email },
    }, { status: 201 });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      (error.name === "MongoServerSelectionError" || error.name === "MongoNetworkError")
    ) {
      return NextResponse.json(
        { error: "Cannot connect to MongoDB. Check that your database is running and MONGODB_URI is correct." },
        { status: 503 },
      );
    }

    const errorCode =
      error && typeof error === "object" && "code" in error
        ? String(error.code)
        : "unknown";
    const errorName =
      error && typeof error === "object" && "name" in error
        ? String(error.name)
        : "unknown";
    console.error("Signup failed", { errorName, errorCode });
    return NextResponse.json(
      { error: "Signup failed because of a server error. Check the development server output for details." },
      { status: 500 },
    );
  }
}
