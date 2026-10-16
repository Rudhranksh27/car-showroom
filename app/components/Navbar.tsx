"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CarFront,
  ChevronDown,
  Menu,
  Phone,
  Search,
  User,
  X,
} from "lucide-react";
import { InventoryMegaMenu, type BrandLink } from "./InventoryMegaMenu";
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
    label: "How It Works",
    href: "/#how-it-works",
    children: [
      { label: "The 4 Steps", href: "/#how-it-works" },
      { label: "Us vs. Dealerships", href: "/#compare" },
      { label: "Why Choose Us", href: "/#why-choose-us" },
      { label: "FAQ", href: "/#faq" },
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
];

const serviceNavLinks = [
  { label: "The 4 Steps", href: "/#how-it-works" },
  { label: "Us vs. Dealerships", href: "/#compare" },
  { label: "Why Choose Us", href: "/#why-choose-us" },
  { label: "FAQ", href: "/#faq" },
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

const bannerColor = "#082d25";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [servicesActive, setServicesActive] = useState(false);
  const [brands, setBrands] = useState<BrandLink[]>([]);

  useEffect(() => {
    const refreshLoginState = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) throw new Error("Unable to read session");
        const result = (await response.json()) as { user: { id: string; name?: string } | null };
        setLoggedIn(Boolean(result.user));
        setUserName(result.user?.name ?? "");
      } catch {
        setAuthError("Unable to check your login status.");
      }
    };

    const handleAuthChange = () => void refreshLoginState();
    void refreshLoginState();
    window.addEventListener("auth-state-change", handleAuthChange);
    return () => window.removeEventListener("auth-state-change", handleAuthChange);
  }, []);

  useEffect(() => {
    fetch("/api/catalog/brands")
      .then((r) => r.json())
      .then((data: { brands?: { name: string; slug: string }[] }) => {
        setBrands(data.brands ?? []);
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    setAuthError(null);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");
      setLoggedIn(false);
      setUserName("");
      setShowUserMenu(false);
      setMobileOpen(false);
    } catch {
      setAuthError("Unable to log out. Please try again.");
    }
  }

  useEffect(() => {
    let frame = 0;
    const updateServicesVisibility = () => {
      const servicesSection = document.getElementById("how-it-works");

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
    <header className="w-full overflow-visible font-[family-name:var(--font-jakarta)]">
      <div className={`sticky top-0 z-50 ${servicesActive ? "hidden" : ""}`}>
        <div
          className={`relative z-50 h-17.5 border-b border-white/10 bg-[#0b3d32] shadow-lg shadow-black/10 backdrop-blur-sm transition-colors duration-300`}
        >
          <div className="mx-auto flex h-full max-w-[120rem] items-center px-4 sm:px-8 lg:px-12">
            <Link href="/" className="group flex shrink-0 items-center gap-3 whitespace-nowrap">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 text-[#0b3d32] shadow-md shadow-black/20 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                <CarFront className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="text-xl font-black tracking-[-0.02em] text-white">
                Virtual<span className="text-amber-300">Drive</span>
              </span>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-2 md:flex lg:gap-4">
              {navItems.map((item) => {
                if (item.label === "Inventory") {
                  return (
                    <InventoryMegaMenu
                      key={item.label}
                      href={item.href ?? "/cars"}
                      label={item.label}
                      active={servicesActive}
                      brands={brands}
                    />
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href ?? "#"}
                    className="relative rounded-full px-4 py-2 font-sans text-[16px] font-medium tracking-normal text-white/90 transition-colors duration-200 after:absolute after:inset-x-4 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-amber-300 after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100"
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
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
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
                    className="flex h-10 items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 text-white ring-1 ring-white/30 transition-colors hover:bg-white/20"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 text-sm font-extrabold uppercase text-[#0b3d32]">
                      {userName ? userName.trim().charAt(0) : <User className="h-4 w-4" />}
                    </span>
                    {userName && (
                      <span className="max-w-[9rem] truncate text-sm font-semibold">
                        {userName.trim().split(/\s+/)[0]}
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-70" aria-hidden="true" />
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
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-full border border-white/40 px-5 py-2 font-sans text-[14px] font-semibold tracking-normal text-white transition-colors hover:border-white hover:bg-white/10"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-amber-300 px-5 py-2 font-sans text-[14px] font-bold tracking-normal text-[#0b3d32] shadow-md shadow-black/20 transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              {authError && <p role="alert" className="text-xs text-red-200">{authError}</p>}

              <Link
                href="/contact"
                className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white ring-1 ring-white/25 transition-colors hover:bg-white/20"
              >
                <Phone className="h-4 w-4" />
                <span className="font-sans text-[14px] font-semibold tracking-normal">
                  Call
                </span>
              </Link>
            </div>

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={toggleMobile}
              className="ml-auto flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        <div
          className="relative z-40 left-1/2 h-12.5 w-screen ml-[-50vw]"
          style={{ backgroundColor: bannerColor }}
        >
          <div className="relative flex h-full items-center overflow-hidden border-b border-white/10">
            <div className="relative z-10 flex h-full shrink-0 items-center gap-2 bg-amber-300 pl-4 pr-6 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0b3d32] sm:pl-8 [clip-path:polygon(0_0,100%_0,calc(100%-14px)_100%,0_100%)]">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0b3d32] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0b3d32]" />
              </span>
              Latest
            </div>
            <div className="customer-bulletin-ticker flex min-w-max items-center whitespace-nowrap">
              {[...customerBulletins, ...customerBulletins].map((bulletin, index) => (
                <span
                  key={`${bulletin}-${index}`}
                  className="flex items-center text-sm font-medium text-white/95"
                >
                  <span className="px-6">{bulletin}</span>
                  <span className="h-1.5 w-1.5 rotate-45 bg-amber-300/80" aria-hidden="true" />
                </span>
              ))}
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#082d25] to-transparent" />
          </div>
        </div>
      </div>

      {servicesActive && (
        <div className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-[#0b3d32]/95 text-white shadow-lg backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[88rem] items-center gap-8 px-4 sm:px-6 lg:px-8">
          <Link
            href="/#how-it-works"
            className="shrink-0 text-lg font-extrabold uppercase tracking-[0.18em] text-white"
          >
            How It Works
          </Link>
          <nav className="flex min-w-0 flex-1 items-center justify-end gap-6 overflow-x-auto md:gap-10">
            {serviceNavLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="shrink-0 py-7 text-[14px] font-bold uppercase tracking-[0.12em] text-emerald-100 transition-colors hover:text-amber-300"
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
                        {brands.map((brand) => (
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
                  {userName && (
                    <p className="rounded-2xl bg-[#0b3d32] px-4 py-3 text-center text-sm font-semibold text-white">
                      Hi, {userName.trim().split(/\s+/)[0]}
                    </p>
                  )}
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
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700"
                  >
                    Logout
                  </button>
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
              {authError && <p role="alert" className="text-center text-sm text-red-600">{authError}</p>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
