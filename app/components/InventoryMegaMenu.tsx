"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

export const inventoryBrands = [
  { name: "Maruti Suzuki", slug: "maruti-suzuki" },
  { name: "Hyundai", slug: "hyundai" },
  { name: "Tata", slug: "tata" },
  { name: "Mahindra", slug: "mahindra" },
  { name: "Toyota", slug: "toyota" },
  { name: "Honda", slug: "honda" },
  { name: "Kia", slug: "kia" },
  { name: "Skoda", slug: "skoda" },
  { name: "MG", slug: "mg" },
  { name: "Renault", slug: "renault" },
  { name: "Nissan", slug: "nissan" },
  { name: "Volkswagen", slug: "volkswagen" },
  { name: "Ford", slug: "ford" },
  { name: "BMW", slug: "bmw" },
  { name: "Mercedes-Benz", slug: "mercedes-benz" },
  { name: "Audi", slug: "audi" },
  { name: "Jaguar", slug: "jaguar" },
  { name: "Land Rover", slug: "land-rover" },
  { name: "Volvo", slug: "volvo" },
];

export const inventoryCategories = [
  "SUV",
  "Sedan",
  "Hatchback",
  "MUV",
  "Luxury",
  "Electric",
  "Used Cars",
];

export const featuredCars = [
  {
    name: "Mahindra Thar",
    price: "₹14.4 Lakh",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Hyundai Creta",
    price: "₹13.2 Lakh",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "BMW 3 Series",
    price: "₹45.8 Lakh",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
  },
];

type InventoryMegaMenuProps = {
  href?: string;
  label?: string;
  active?: boolean;
};

export function InventoryMegaMenu({
  href = "/cars",
  label = "Inventory",
  active = false,
}: InventoryMegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const openMenu = () => {
    clearTimers();
    openTimer.current = setTimeout(() => setIsOpen(true), 150);
  };

  const closeMenu = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => setIsOpen(false), 200);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearTimers();
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative hidden md:block">
      <div
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
        className="relative"
      >
        <Link
          href={href}
          aria-expanded={isOpen}
          aria-controls="inventory-mega-menu"
          onClick={() => setIsOpen(false)}
          className={`flex items-center gap-1 font-sans text-[17px] font-normal tracking-normal transition-colors duration-200 ${
            "rounded-full px-3 py-2 text-white hover:bg-white/10 hover:text-white"
          }`}
        >
          {label}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </Link>

        <div
          id="inventory-mega-menu"
          role="menu"
          aria-label="Inventory mega menu"
          className={`fixed left-0 right-0 top-17.5 z-50 w-screen transition-all duration-180 ease-out ${
            isOpen
              ? "pointer-events-auto visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-2 opacity-0"
          }`}
        >
          <div className="border-t border-slate-200 bg-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.28)] rounded-b-2xl">
            <div className="mx-auto max-w-[1600px] px-8 py-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
                <div className="pr-6 lg:border-r lg:border-slate-100">
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Browse by Brand
                  </p>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
                    {inventoryBrands.map((brand) => (
                      <Link
                        key={brand.name}
                        href={`/cars?brand=${brand.slug}`}
                        onClick={() => setIsOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-2 rounded-md px-2 py-2 font-sans text-[17px] font-normal tracking-normal text-slate-700 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-950"
                      >
                        <span>{brand.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="lg:border-r lg:border-slate-100">
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Browse by Category
                  </p>
                  <div className="space-y-2">
                    {inventoryCategories.map((category) => (
                      <Link
                        key={category}
                        href={`/cars?category=${category.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => setIsOpen(false)}
                        role="menuitem"
                        className="group flex items-center justify-between rounded-md px-2 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950"
                      >
                        <span>{category}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Featured
                  </p>
                  <div className="space-y-3">
                    {featuredCars.map((car) => (
                      <Link
                        key={car.name}
                        href={`/cars?featured=${car.name.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2 transition-colors hover:border-slate-300 hover:bg-white"
                      >
                        <img
                          src={car.image}
                          alt={car.name}
                          className="h-16 w-20 rounded-md object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">{car.name}</p>
                          <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                            {car.price}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
