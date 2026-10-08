"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cars } from "../lib/cars";

const categories = ["All", "Hatchback", "SUV", "Sedan", "EV", "Luxury"];
const displayedCarIds = new Set([
  "maruti-brezza-zxi",
  "tata-punch-accomplished",
  "kia-sonet-gtx",
  "renault-duster-techno",
]);
const displayedCars = cars.filter((car) => displayedCarIds.has(car.id));

export default function InventoryRangeCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  function scrollCars(direction: -1 | 1) {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: direction * carousel.clientWidth * 0.8,
      behavior: "smooth",
    });
  }

  return (
    <section className="w-full px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl border-y border-gray-200 py-10 md:py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="text-3xl font-black text-gray-900 md:text-4xl">
            Explore Inventory by Range
          </h2>

          <nav aria-label="Browse cars by range" className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category}
                href={category === "All" ? "/cars" : `/cars?category=${encodeURIComponent(category)}`}
                aria-current={category === "All" ? "page" : undefined}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  category === "All"
                    ? "border-[#0b3d32] bg-[#0b3d32] text-white hover:bg-[#082d25]"
                    : "border-gray-200 bg-white text-gray-700 hover:border-[#0b3d32] hover:text-[#0b3d32]"
                }`}
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 sm:grid-cols-[3rem_minmax(0,1fr)_3rem] sm:gap-4">
          <button
            type="button"
            aria-label="Show previous cars"
            title="Show previous cars"
            onClick={() => scrollCars(-1)}
            className="flex aspect-square items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 transition-colors hover:border-[#0b3d32] hover:text-[#0b3d32] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <div
            ref={carouselRef}
            aria-label="Available car photos"
            className="flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {displayedCars.map((car) => (
              <article
                key={car.id}
                className="w-[86%] shrink-0 snap-start sm:w-[48%] lg:w-[32%]"
              >
                <Link href={`/cars/${car.id}`} className="group block">
                  <div className="relative aspect-16/10 overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.alt}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {car.brand} · {car.category}
                  </p>
                  <p className="mt-1 text-base font-bold text-gray-900 group-hover:text-[#0b3d32]">
                    {car.name}
                  </p>
                </Link>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    href={`/cars/${car.id}`}
                    aria-label={`Know more about ${car.name}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-md bg-black px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:text-sm"
                  >
                    Know More
                  </Link>
                  <Link
                    href={`/cars/${car.id}/book-test-drive`}
                    aria-label={`Book a test drive for ${car.name}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-md bg-black px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:text-sm"
                  >
                    Book a Test Drive
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            aria-label="Show more cars"
            title="Show more cars"
            onClick={() => scrollCars(1)}
            className="flex aspect-square items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 transition-colors hover:border-[#0b3d32] hover:text-[#0b3d32] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}