"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const values = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Unable to authenticate");
        return;
      }

      window.dispatchEvent(new Event("auth-state-change"));
      const requestedNext = new URLSearchParams(window.location.search).get("next");
      const nextUrl = requestedNext ? new URL(requestedNext, window.location.origin) : null;
      const next = nextUrl?.origin === window.location.origin
        ? `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
        : "/";
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
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-800">VirtualDrive account</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {isSignup ? "Sign up to book your next car." : "Log in to continue to your booking."}
        </p>

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
            {submitting ? "Please wait..." : isSignup ? "Create account" : "Log in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          {isSignup ? "Already have an account? " : "New to VirtualDrive? "}
          <Link
            href={isSignup ? "/login" : "/register"}
            className="font-semibold text-emerald-800 hover:underline"
          >
            {isSignup ? "Log in" : "Sign up"}
          </Link>
        </p>
      </section>
    </main>
  );
}
