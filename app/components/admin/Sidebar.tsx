"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Car,
  Gauge,
  MapPin,
  ShieldCheck,
  Users,
  CalendarDays,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/cars", label: "Cars", icon: Car },
  { href: "/admin/brands", label: "Brands", icon: Gauge },
  { href: "/admin/models", label: "Models", icon: ShieldCheck },
  { href: "/admin/variants", label: "Variants", icon: Car },
  { href: "/admin/dealers", label: "Dealers", icon: MapPin },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-16 items-center justify-center border-b border-slate-200 px-4">
        <div className="text-lg font-bold tracking-[0.2em] text-slate-800 uppercase">
          VirtualDrive
        </div>
      </div>

      <nav className="space-y-2 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
