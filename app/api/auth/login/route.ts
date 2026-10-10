import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { assertAuthConfigured, createSessionToken, isValidEmail, SESSION_COOKIE, SESSION_MAX_AGE } from "../../../lib/auth";
import { getUsersCollection } from "../../../lib/mongodb";

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
    const user = await (await getUsersCollection()).findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = createSessionToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    });
    const response = NextResponse.json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to log in right now" }, { status: 500 });
  }
}
