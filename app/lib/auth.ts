import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "session";
export const LEGACY_SESSION_COOKIE = "virtualdrive_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role?: Role;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

type SessionPayload = {
  userId?: string;
  id?: string;
  email?: string;
  name?: string;
  role?: Role;
  exp?: number;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be configured with at least 32 characters");
  }
  return secret;
}

export function assertAuthConfigured() {
  getAuthSecret();
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest();
}

export function createSessionToken(user: SessionUser) {
  const safeUser = {
    ...user,
    role: user.role ?? "USER",
  };
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({ ...safeUser, id: safeUser.id, userId: safeUser.id, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE }),
  ).toString("base64url");
  const unsignedToken = `${header}.${payload}`;
  return `${unsignedToken}.${sign(unsignedToken).toString("base64url")}`;
}

export async function createSession(user: { userId: string; email: string; name: string; role?: Role }) {
  const secret = new TextEncoder().encode(getAuthSecret());
  return new SignJWT({
    userId: user.userId,
    email: user.email,
    name: user.name,
    role: user.role ?? "USER",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export function verifySessionToken(token: string | undefined): SessionUser | null {
  if (!token) return null;

  try {
    const [header, payload, signature, extra] = token.split(".");
    if (!header || !payload || !signature || extra !== undefined) return null;

    const unsignedToken = `${header}.${payload}`;
    const actualSignature = Buffer.from(signature, "base64url");
    const expectedSignature = sign(unsignedToken);
    if (
      actualSignature.length !== expectedSignature.length ||
      !timingSafeEqual(actualSignature, expectedSignature)
    ) {
      return null;
    }

    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as Partial<SessionPayload>;
    const userId = parsed.userId ?? parsed.id;
    if (
      typeof userId !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.exp !== "number" ||
      parsed.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return {
      id: userId,
      email: parsed.email,
      name: parsed.name,
      role: parsed.role ?? "USER",
    };
  } catch {
    return null;
  }
}

export async function verifySession(req?: NextRequest): Promise<SessionUser | null> {
  const cookieStore = req ? req.cookies : await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? cookieStore.get(LEGACY_SESSION_COOKIE)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(getAuthSecret()));
    if (typeof payload.userId !== "string" || typeof payload.email !== "string") {
      return null;
    }

    const role = payload.role === "ADMIN" || payload.role === "SUPER_ADMIN" || payload.role === "USER" ? payload.role : "USER";
    return {
      id: payload.userId,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "User",
      role,
    };
  } catch {
    return verifySessionToken(token);
  }
}

export async function requireAdmin(req: NextRequest): Promise<{ user: SessionUser } | NextResponse> {
  const session = await verifySession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return { user: session };
}

export async function getCurrentUser(req?: NextRequest): Promise<User | null> {
  const session = await verifySession(req);
  if (!session) {
    return null;
  }

  return {
    id: session.id,
    email: session.email,
    name: session.name,
    role: session.role ?? "USER",
  };
}

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const user = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value ?? cookieStore.get(LEGACY_SESSION_COOKIE)?.value);
  return user;
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function passwordValidationError(password: string) {
  if (Buffer.byteLength(password, "utf8") > 72) {
    return "Password must be no more than 72 bytes";
  }
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    return "Password must include uppercase and lowercase letters";
  }
  if (!/\d/.test(password)) return "Password must include at least one number";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must include at least one special character";
  return null;
}
