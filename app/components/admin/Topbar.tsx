"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Menu, Search } from "lucide-react";
import { useState } from "react";

export type TopbarUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
} | null;

export default function Topbar({ user }: { user: TopbarUser }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function handleLogout() {
    setLogoutError(null);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error("Logout request failed");
      }

      window.dispatchEvent(new Event("auth-state-change"));
      router.replace("/admin/login");
      router.refresh();
    } catch {
      setLogoutError("Unable to log out. Please try again.");
    }
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-sm font-medium text-slate-800">{user?.name ?? "Admin"}</div>
              <div className="text-xs text-slate-500">{user?.role ?? "ADMIN"}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
      {logoutError && <p role="alert" className="px-6 pb-2 text-right text-sm text-red-600">{logoutError}</p>}

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-3 py-3 lg:hidden">
          <nav className="space-y-1">
            <Link href="/admin" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              Dashboard
            </Link>
            <Link href="/admin/cars" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              Cars
            </Link>
            <Link href="/admin/bookings" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              Bookings
            </Link>
            <Link href="/admin/users" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              Users
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
