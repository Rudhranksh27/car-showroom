"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type AuthFormProps = {
  mode: "login" | "signup";
  admin?: boolean;
};

export default function AuthForm({ mode, admin = false }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [needsAdminAccount, setNeedsAdminAccount] = useState(false);
  const [adminNext, setAdminNext] = useState<string | null>(null);
  const [signupComplete, setSignupComplete] = useState(false);
  const isSignup = mode === "signup";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    const isAdminDestination = next?.startsWith("/admin") === true;
    setIsAdminLogin(admin || (!isSignup && isAdminDestination));
    setNeedsAdminAccount(!isSignup && params.get("reason") === "admin-required");
    setAdminNext(isAdminDestination && next ? next : admin ? "/admin" : null);
    setSignupComplete(admin && !isSignup && params.get("registered") === "1");
  }, [admin, isSignup]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const values = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const endpoint = admin ? `/api/admin/auth/${mode}` : `/api/auth/${mode}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Unable to authenticate");
        return;
      }

      if (admin && isSignup) {
        router.replace("/admin/login?registered=1");
        router.refresh();
        return;
      }

      window.dispatchEvent(new Event("auth-state-change"));
      const requestedNext = new URLSearchParams(window.location.search).get("next");
      const nextUrl = requestedNext ? new URL(requestedNext, window.location.origin) : null;
      const next = nextUrl?.origin === window.location.origin
        ? `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
        : admin ? "/admin" : "/";
      router.replace(next);
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f6f8fa] px-4 py-12">
      <section className="w-full max-w-md border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-800">
          {admin ? "VirtualDrive admin" : "VirtualDrive account"}
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
          {isSignup ? (admin ? "Create admin account" : "Create your account") : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {isSignup
            ? admin
              ? "Create an account for the VirtualDrive admin panel."
              : "Sign up to book your next car."
            : isAdminLogin
              ? "Log in to continue to the admin panel."
              : "Log in to continue to your booking."}
        </p>
        {needsAdminAccount && (
          <p role="status" className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            This account does not have admin access. Sign in with an existing admin account or ask an administrator to grant access.
          </p>
        )}
        {signupComplete && (
          <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            Admin account created. Log in with your new credentials.
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {isSignup && (
            <label className="block text-sm font-semibold text-slate-700">
              Full name
              <input
                required
                name="name"
                autoComplete="name"
                minLength={2}
                maxLength={80}
                className="mt-2 w-full border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-700"
              />
            </label>
          )}
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              className="mt-2 w-full border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-700"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              required
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={isSignup ? 8 : undefined}
              maxLength={isSignup ? 72 : undefined}
              className="mt-2 w-full border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-700"
            />
          </label>
          {isSignup && (
            <p className="-mt-2 text-xs leading-5 text-slate-500">
              Use at least 8 characters with uppercase and lowercase letters, a number, and a special character.
            </p>
          )}
          {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#0b3d32] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#082d25] disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? "Please wait..." : isSignup ? (admin ? "Create admin account" : "Create account") : "Log in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          {isSignup ? "Already have an account? " : admin ? "Need an admin account? " : "New to VirtualDrive? "}
          <Link
            href={`${admin ? (isSignup ? "/admin/login" : "/admin/signup") : (isSignup ? "/login" : "/register")}${adminNext ? `?next=${encodeURIComponent(adminNext)}` : ""}`}
            className="font-semibold text-emerald-800 hover:underline"
          >
            {isSignup ? "Log in" : "Sign up"}
          </Link>
        </p>
      </section>
    </main>
  );
}
