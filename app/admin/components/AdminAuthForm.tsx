"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AdminAuthFormProps = {
  mode: "login" | "signup";
};

export default function AdminAuthForm({ mode }: AdminAuthFormProps) {
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
      const response = await fetch(`/api/admin/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Unable to authenticate");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <section className="w-full max-w-md border border-slate-700 bg-slate-900 p-7 shadow-lg sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">Admin Portal</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
          {isSignup ? "Create admin account" : "Admin login"}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {isSignup ? "Register a new admin account." : "Sign in to access the admin panel."}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {isSignup && (
            <label className="block text-sm font-semibold text-slate-300">
              Full name
              <input
                required
                name="name"
                autoComplete="name"
                minLength={2}
                maxLength={80}
                className="mt-2 w-full border border-slate-600 bg-slate-800 px-4 py-3 font-normal text-white outline-none focus:border-amber-400"
              />
            </label>
          )}
          <label className="block text-sm font-semibold text-slate-300">
            Email
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              className="mt-2 w-full border border-slate-600 bg-slate-800 px-4 py-3 font-normal text-white outline-none focus:border-amber-400"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-300">
            Password
            <input
              required
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={isSignup ? 8 : undefined}
              maxLength={isSignup ? 72 : undefined}
              className="mt-2 w-full border border-slate-600 bg-slate-800 px-4 py-3 font-normal text-white outline-none focus:border-amber-400"
            />
          </label>
          {isSignup && (
            <p className="-mt-2 text-xs leading-5 text-slate-500">
              Use at least 8 characters with uppercase and lowercase letters, a number, and a special character.
            </p>
          )}
          {error && <p role="alert" className="text-sm font-medium text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-400 px-5 py-3.5 text-sm font-bold text-slate-950 hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? "Please wait..." : isSignup ? "Create admin account" : "Log in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          {isSignup ? "Already have an account? " : "Need an account? "}
          <Link
            href={isSignup ? "/admin/login" : "/admin/signup"}
            className="font-semibold text-amber-400 hover:underline"
          >
            {isSignup ? "Log in" : "Sign up"}
          </Link>
        </p>
      </section>
    </main>
  );
}
