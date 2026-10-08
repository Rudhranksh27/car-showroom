"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
  Phone,
  Search,
  User,
  X,
} from "lucide-react";
import { InventoryMegaMenu, inventoryBrands } from "./InventoryMegaMenu";
import NotificationDropdown from "./NotificationDropdown";

type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Inventory",
    href: "/cars",
    children: [
      { label: "Sedans", href: "/cars?type=sedans" },
      { label: "SUVs", href: "/cars?type=suvs" },
      { label: "Luxury", href: "/cars?type=luxury" },
    ],
  },
  {
    label: "Services",
    href: "#services",
    children: [
      { label: "Maintenance", href: "#maintenance" },
      { label: "Repairs", href: "#repairs" },
      { label: "Financing", href: "#financing" },
      { label: "Trade-in", href: "#trade-in" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const notifications = [
  { title: "Your Kia HTK plus is ready for pickup", time: "2 min ago" },
  { title: "New EV inventory added", time: "1 hour ago" },
  { title: "Your service appointment reminder", time: "Today" },
];

const userMenu = [
  { label: "My Bookings", href: "/bookings" },
  { label: "Account", href: "/account" },
  { label: "Logout", href: "/logout" },
];

const serviceNavLinks = [
  { label: "Maintenance", href: "#maintenance" },
  { label: "Repairs", href: "#repairs" },
  { label: "Financing", href: "#financing" },
  { label: "Trade-in", href: "#trade-in" },
];

const customerBulletins = [
  "🚗 New arrivals this week — Tata Punch, Kia Seltos & more",
  "🎉 Book any car online and get free home delivery",
  "Low interest EMI available on selected models",
  "Free first service on all bookings this month",
  "New EV inventory added — explore now",
  "Limited-time offers on Maruti Suzuki & Hyundai",
  "Test drive at home — book your slot today",
  "🏁 Festive offer — save up to ₹50,000 on select cars",
];

const bannerColor = "#071827";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [servicesActive, setServicesActive] = useState(false);

  useEffect(() => {
    let frame = 0;
    const updateServicesVisibility = () => {
      const servicesSection = document.getElementById("services");

      if (!servicesSection) return;

      if (window.scrollY <= 4) {
        setServicesActive(false);
        return;
      }

      const bounds = servicesSection.getBoundingClientRect();
      setServicesActive(bounds.top < window.innerHeight && bounds.bottom > 0);
    };

    const handleScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateServicesVisibility);
    };

    updateServicesVisibility();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateServicesVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateServicesVisibility);
    };
  }, []);

  const toggleMobile = () => setMobileOpen((value) => !value);

  return (
    <header className="w-full overflow-visible">
      <div className={`sticky top-0 z-50 ${servicesActive ? "hidden" : ""}`}>
        <div
          className={`relative z-50 h-17.5 border-b shadow-[0_1px_0_rgba(15,23,42,0.05)] backdrop-blur-sm transition-colors duration-300 ${
            servicesActive
              ? "border-[#0b3d32] bg-[#0b3d32]"
              : "border-[#0b3d32] bg-[#0b3d32]"
          }`}
        >
          <div className="flex h-full items-center pl-10 pr-4 lg:pr-6">
            <div className="relative isolate flex h-full w-64 shrink-0 items-center justify-end overflow-hidden bg-[#70f0aa] pr-5">
              <div
                className="pointer-events-none absolute inset-0 bg-[#0b3d32]"
                style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
                aria-hidden="true"
              />
              <Link
                href="/"
                className="relative z-10 flex items-center whitespace-nowrap text-xl font-black uppercase tracking-[0.28em] text-[#071827] transition-colors duration-300"
              >
                VirtualDrive
              </Link>
            </div>

            <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
              {navItems.map((item) => {
                if (item.label === "Inventory") {
                  return (
                    <InventoryMegaMenu
                      key={item.label}
                      href={item.href ?? "/cars"}
                      label={item.label}
                      active={servicesActive}
                    />
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href ?? "#"}
                    className={`font-sans text-[17px] font-normal tracking-normal transition-colors duration-200 ${
                      "rounded-full px-3 py-2 text-white hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="relative z-60 ml-auto hidden items-center gap-4 md:flex">
              <div className="relative flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Open search"
                  onClick={() => setSearchOpen((value) => !value)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                    "text-white hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Search className="h-4 w-4" />
                </button>

                <form
                  action="/cars"
                  method="get"
                  className={`overflow-hidden transition-all duration-200 ${
                    searchOpen ? "w-56 opacity-100" : "w-0 opacity-0"
                  }`}
                >
                  <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                    <Search className="mr-2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      name="search"
                      placeholder="Search cars"
                      className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </form>
              </div>

              <NotificationDropdown items={notifications.map((item) => ({
                id: item.title,
                title: item.title,
                time: item.time,
                href: "/notifications",
              }))} badgeCount={3} />

              {loggedIn ? (
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Open account menu"
                    onClick={() => setShowUserMenu((value) => !value)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b3d32] text-white transition-colors hover:bg-[#082d25]"
                  >
                    <User className="h-4 w-4" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full z-20 mt-3 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                      {userMenu.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="block px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-full border border-white/40 px-4 py-2 font-sans text-[14px] font-normal tracking-normal text-white transition-colors hover:border-white hover:bg-white/10"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-[#0b3d32] px-4 py-2 font-sans text-[14px] font-normal tracking-normal text-white transition-colors hover:bg-[#082d25]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              <Link
                href="/contact"
                className="flex items-center gap-2 rounded-full border border-white/40 px-3 py-2 text-white transition-colors hover:border-white hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                <span className="font-sans text-[14px] font-normal tracking-normal">
                  Call
                </span>
              </Link>
            </div>

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={toggleMobile}
              className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-slate-700 md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        <div
          className="relative z-40 left-1/2 h-12.5 w-screen ml-[-50vw]"
          style={{ backgroundColor: bannerColor }}
        >
          <div className="flex h-full items-center overflow-hidden">
            <div className="customer-bulletin-ticker flex min-w-max items-center gap-12 whitespace-nowrap px-6 sm:px-10">
              {[...customerBulletins, ...customerBulletins].map((bulletin, index) => (
                <span
                  key={`${bulletin}-${index}`}
                  className="text-sm font-medium text-white"
                >
                  {bulletin}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {servicesActive && (
        <div className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-[#071827]/85 text-white shadow-lg backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
          <Link
            href="#services"
            className="shrink-0 text-sm font-black uppercase tracking-[0.2em] text-white"
          >
            Services
          </Link>
          <nav className="flex min-w-0 flex-1 items-center justify-end gap-5 overflow-x-auto md:gap-8">
            {serviceNavLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="shrink-0 py-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/35 md:hidden">
          <div className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-lg font-black uppercase tracking-[0.2em] text-slate-900">
                VirtualDrive
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={toggleMobile}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form action="/cars" method="get" className="mb-5">
              <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2.5">
                <Search className="mr-2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search cars"
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </form>

            <div className="space-y-2">
              {navItems.map((item) => {
                if (item.label === "Inventory") {
                  return (
                    <div key={item.label} className="border-b border-slate-100 pb-2">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between text-left text-sm font-semibold uppercase tracking-[0.14em] text-slate-800"
                        onClick={() => {
                          const next = !document.getElementById("inventory-mobile-panel")?.classList.contains("hidden");
                          const panel = document.getElementById("inventory-mobile-panel");
                          if (panel) {
                            panel.classList.toggle("hidden", next);
                          }
                        }}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4" />
                      </button>

                      <div id="inventory-mobile-panel" className="mt-3 hidden space-y-2">
                        {inventoryBrands.map((brand) => (
                          <Link
                            key={brand.name}
                            href={`/cars?brand=${brand.slug}`}
                            onClick={toggleMobile}
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                          >
                            <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                            {brand.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={item.label} className="border-b border-slate-100 pb-2">
                    <Link
                      href={item.href ?? "#"}
                      onClick={toggleMobile}
                      className="block text-sm font-semibold uppercase tracking-[0.14em] text-slate-800"
                    >
                      {item.label}
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-3">
              {loggedIn ? (
                <>
                  {userMenu.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={toggleMobile}
                      className="block rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700"
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={toggleMobile}
                    className="block rounded-full border border-slate-300 px-4 py-2.5 text-center font-sans text-[14px] font-normal tracking-normal text-slate-700"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={toggleMobile}
                    className="block rounded-full bg-[#0b3d32] px-4 py-2.5 text-center font-sans text-[14px] font-normal tracking-normal text-white"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
