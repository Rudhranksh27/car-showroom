"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type NotificationItem = {
  id: string;
  title: string;
  time: string;
  unread?: boolean;
  href?: string;
};

type NotificationDropdownProps = {
  items?: NotificationItem[];
  badgeCount?: number;
};

const defaultItems: NotificationItem[] = [
  {
    id: "1",
    title: "Your Kia HTK Plus is ready for pickup",
    time: "2 min ago",
    unread: true,
    href: "/bookings/1",
  },
  {
    id: "2",
    title: "New EV inventory has been added",
    time: "1 hour ago",
    unread: true,
    href: "/cars?category=electric",
  },
  {
    id: "3",
    title: "Your service appointment reminder",
    time: "Today",
    href: "/services/appointments",
  },
  {
    id: "4",
    title: "Special financing offers are live",
    time: "Yesterday",
    href: "/offers",
  },
  {
    id: "5",
    title: "New SUV arrivals this week",
    time: "2 days ago",
    href: "/cars?category=suv",
  },
];

export default function NotificationDropdown({
  items = defaultItems,
  badgeCount = 3,
}: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={panelRef} className="relative z-60">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/10 hover:text-white"
      >
        <Bell className="h-4 w-4" />
        {badgeCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {badgeCount}
          </span>
        )}
      </button>

      
       
      <div
        className={`absolute right-0 top-full z-60 mt-2 w-[calc(100vw-2rem)] origin-top-right rounded-lg border border-gray-100 bg-white shadow-xl transition-all duration-150 ease-out md:w-96 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-3">
          <p className="text-sm font-medium text-gray-900">Notifications</p>
          <button
            type="button"
            className="text-[11px] font-medium text-sky-600 transition-colors hover:text-sky-700"
          >
            Mark all read
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href ?? "/notifications"}
              onClick={() => setOpen(false)}
              className={`block rounded-md px-3 py-2.5 transition-colors hover:bg-gray-50 ${
                item.unread ? "bg-sky-50/40" : ""
              }`}
            >
              <div className="flex items-start gap-2">
                {item.unread && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-600" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="border-t border-gray-100 px-3 py-2.5 text-center">
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center text-xs font-medium text-sky-600 transition-colors hover:text-sky-700"
          >
            View all notifications →
          </Link>
        </div>
      </div>
    </div>
  );
}
