"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type CarSlide = {
  name: string;
  price: string;
  image: string;
  alt: string;
};

const sliderCars: CarSlide[] = [
  {
    name: "Maruti Suzuki Brezza",
    price: "Starting ₹8.3L",
    image: "/carImages/maruati.png",
    alt: "Maruti Suzuki Brezza SUV",
  },
  {
    name: "Tata Punch",
    price: "Starting ₹6.1L",
    image: "/carImages/punch (2).png",
    alt: "Tata Punch SUV",
  },
  {
    name: "Renault Duster",
    price: "Starting ₹10.0L",
    image: "/carImages/Duster.png",
    alt: "Renault Duster SUV",
  },
];

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

export default function CarSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % sliderCars.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  return (
    <div aria-label="Car showcase slider" className="relative w-full">
      <div className="relative aspect-4/3 w-full overflow-hidden md:aspect-16/11">
        {sliderCars.map((car, index) => (
          <div
            key={car.name}
            className={`absolute inset-0 transition-all duration-800 ease-out ${
              index === activeIndex
                ? "pointer-events-auto opacity-100 scale-100"
                : "pointer-events-none opacity-0 scale-[1.03]"
            }`}
            aria-hidden={index !== activeIndex}
          >
            <Image
              src={car.image}
              alt={car.alt}
              fill
              priority={index === activeIndex}
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-contain"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {sliderCars.map((car, index) => (
          <button
            key={car.name}
            type="button"
            aria-label={`View ${car.name}`}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? "w-6 bg-sky-500" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export { sliderCars };
