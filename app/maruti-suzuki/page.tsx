"use client";

import Image from "next/image";
import Link from "next/link";
import { CarFront, IndianRupee, Store, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";

const models = [
  { id: "alto-k10", name: "Maruti Suzuki Alto K10", type: "Hatchback", fuels: ["Petrol", "CNG"], price: 3.70, priceMax: 5.45, specs: "998 cc · 55.92-68 bhp · 24.39-24.9 kmpl / 33.85 km/kg CNG" },
  { id: "s-presso", name: "Maruti Suzuki S-Presso", type: "Hatchback", fuels: ["Petrol", "CNG"], price: 3.50, priceMax: 5.27, specs: "998 cc · 56-68 bhp · 24.12-25.3 kmpl / 32.73 km/kg CNG" },
  { id: "celerio", name: "Maruti Suzuki Celerio", type: "Hatchback", fuels: ["Petrol", "CNG"], price: 4.70, priceMax: 6.75, specs: "998 cc · 55.92-67.77 bhp · 24.97-26.68 kmpl / 34.43 km/kg CNG" },
  { id: "wagon-r", name: "Maruti Suzuki Wagon R", type: "Hatchback", fuels: ["Petrol", "CNG", "Hybrid"], price: 4.99, priceMax: 7.24, specs: "998-1197 cc · 55.92-88.5 bhp · 23.56-25.19 kmpl / up to 34.05 km/kg CNG" },
  { id: "eeco", name: "Maruti Suzuki Eeco", type: "Minivan", fuels: ["Petrol", "CNG"], price: 5.28, priceMax: 6.46, specs: "1197 cc · 70.67-79.65 bhp · 19.71 kmpl / 26.78 km/kg CNG" },
  { id: "maruti-brezza-zxi", name: "Maruti Suzuki Brezza", type: "SUV", fuels: ["Petrol", "CNG"], price: 7.50, priceMax: 13.71, specs: "998-1462 cc · 86.63-109 bhp · 19.8-21.09 kmpl / up to 26.9 km/kg CNG", image: "/carImages/maruati.png" },
  { id: "swift", name: "Maruti Suzuki Swift", type: "Hatchback", fuels: ["Petrol", "CNG"], price: 5.84, priceMax: 8.89, specs: "1197 cc · 68.8-81.8 bhp · 25.35-26.25 kmpl / up to 35.34 km/kg CNG" },
  { id: "baleno", name: "Maruti Suzuki Baleno", type: "Hatchback", fuels: ["Petrol", "CNG"], price: 5.99, priceMax: 9.99, specs: "1197 cc · 69-82 bhp · 23.8-24.77 kmpl / 33.61 km/kg CNG" },
  { id: "fronx", name: "Maruti Suzuki Fronx", type: "SUV", fuels: ["Petrol", "CNG"], price: 6.90, priceMax: 12.03, specs: "998-1197 cc · 76.43-98.69 bhp · 20.01-22.89 kmpl / 28.51 km/kg CNG" },
  { id: "dzire", name: "Maruti Suzuki Dzire", type: "Sedan", fuels: ["Petrol", "CNG"], price: 6.31, priceMax: 9.54, specs: "1197 cc · 68.79-81.8 bhp · 25.15-26.13 kmpl / up to 36.47 km/kg CNG" },
  { id: "grand-vitara", name: "Maruti Suzuki Grand Vitara", type: "SUV", fuels: ["Petrol", "CNG", "Hybrid"], price: 10.77, priceMax: 19.77, specs: "1462-1490 cc · 87-114 bhp · 19.38-27.97 kmpl / 26.6 km/kg CNG" },
  { id: "ertiga", name: "Maruti Suzuki Ertiga", type: "MPV", fuels: ["Petrol", "CNG"], price: 8.90, priceMax: 13.14, specs: "1462 cc · 86.5-101.6 bhp · 20.3-20.51 kmpl / 26.11 km/kg CNG" },
  { id: "xl6", name: "Maruti Suzuki XL6", type: "MPV", fuels: ["Petrol", "CNG"], price: 11.62, priceMax: 14.68, specs: "1462 cc · 86.63-101.64 bhp · 20.27-20.97 kmpl / 26.32 km/kg CNG" },
  { id: "jimny", name: "Maruti Suzuki Jimny", type: "SUV", fuels: ["Petrol"], price: 12.59, priceMax: 14.67, specs: "1462 cc · 103.3 bhp · 16.39-16.94 kmpl · 4WD" },
  { id: "invicto", name: "Maruti Suzuki Invicto", type: "MPV", fuels: ["Petrol", "Hybrid"], price: 24.97, priceMax: 28.70, specs: "1987 cc · 186 bhp · 23.24 kmpl · Strong hybrid" },
  { id: "victoris", name: "Maruti Suzuki Victoris", type: "SUV", fuels: ["Petrol", "CNG", "Hybrid"], price: 10.50, priceMax: 19.99, specs: "1462-1490 cc · 86.63-114 bhp · 19.07-28.65 kmpl / 27.02 km/kg CNG" },
  { id: "e-vitara", name: "Maruti Suzuki e Vitara", type: "SUV", fuels: ["Electric"], price: 16.19, priceMax: 20.21, specs: "49-61 kWh battery · 142-172 bhp · 440-543 km claimed range" },
  { id: "dzire-tour-s", name: "Maruti Suzuki Dzire Tour S", type: "Sedan", fuels: ["Petrol", "CNG"], price: 6.29, priceMax: 7.25, specs: "1197 cc · 69-80 bhp · 26.06 kmpl / 34.3 km/kg CNG" },
  { id: "ertiga-tour", name: "Maruti Suzuki Ertiga Tour", type: "MPV", fuels: ["Petrol", "CNG"], price: 9.95, priceMax: 10.93, specs: "1462 cc · 91.18-103.25 bhp · 18.04 kmpl / 26.08 km/kg CNG" },
  { id: "alto-tour-h1", name: "Maruti Suzuki Alto Tour H1", type: "Commercial", fuels: ["Petrol", "CNG"], price: 4.00, priceMax: 4.84, specs: "998 cc · 55.92-67.58 bhp · 24.39 kmpl / 33.4 km/kg CNG" },
  { id: "eeco-cargo", name: "Maruti Suzuki Eeco Cargo", type: "Commercial", fuels: ["Petrol", "CNG"], price: 5.39, priceMax: 6.61, specs: "1197 cc · 70.67-79.65 bhp · 20.2 kmpl / 27.05 km/kg CNG" },
  { id: "eeco-tour-v", name: "Maruti Suzuki Eeco Tour V", type: "Minivan", fuels: ["Petrol", "CNG"], price: 5.28, priceMax: 6.46, specs: "1197 cc · 70.67-79.65 bhp · 19.71 kmpl / 26.78 km/kg CNG" },
  { id: "wagon-r-tour", name: "Maruti Suzuki Wagon R Tour", type: "Commercial", fuels: ["Petrol", "CNG"], price: 4.99, priceMax: 5.94, specs: "998 cc · 55.92-65.71 bhp · 25.4 kmpl / 34.73 km/kg CNG" },
];

const bodyTypes = ["All", "SUV", "Hatchback", "Sedan", "MPV", "Minivan", "Commercial"];
const fuelTypes = ["All", "Petrol", "CNG", "Hybrid", "Electric"];
const stats = [
  { label: "Showrooms", value: "4,000+", Icon: Store },
  { label: "Models available", value: "23", Icon: CarFront },
  { label: "Units sold", value: "30M+", Icon: IndianRupee },
  { label: "Service centres", value: "4,500+", Icon: Wrench },
];

export default function MarutiSuzukiPage() {
  const [budget, setBudget] = useState(28.7);
  const [selectedBodyType, setSelectedBodyType] = useState("All");
  const [selectedFuel, setSelectedFuel] = useState("All");
  const [sortOrder, setSortOrder] = useState("price-low");
  const [showAllModels, setShowAllModels] = useState(false);

  const matchingModels = useMemo(() => {
    return models
      .filter((model) => model.price <= budget)
      .filter((model) => selectedBodyType === "All" || model.type === selectedBodyType)
      .filter((model) => selectedFuel === "All" || model.fuels.includes(selectedFuel))
      .toSorted((first, second) => {
        if (sortOrder === "price-high") return second.price - first.price;
        if (sortOrder === "name") return first.name.localeCompare(second.name);
        return first.price - second.price;
      });
  }, [budget, selectedBodyType, selectedFuel, sortOrder]);
  const visibleModels = showAllModels ? matchingModels : matchingModels.slice(0, 6);

  const detailsHref = (id: string) =>
    id === "maruti-brezza-zxi" ? "/maruti-suzuki/breeza" : "/cars?brand=Maruti%20Suzuki";

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-10">
        <section aria-labelledby="brand-heading">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/icon/Maruti-suzuki/icon.png"
                alt="Maruti Suzuki logo"
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 rounded-2xl object-contain shadow-md"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c91f25]">Explore the range</p>
                <h1 id="brand-heading" className="mt-1 text-3xl font-black text-slate-950 sm:text-4xl">Maruti Suzuki</h1>
                <p className="mt-1 text-sm text-slate-500">Established in India since 1981</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid overflow-hidden rounded-3xl bg-white shadow-[0_10px_32px_rgba(15,23,42,0.09)] sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, value, Icon }, index) => (
              <div key={label} className={`flex items-center gap-5 px-6 py-6 sm:px-8 ${index > 0 ? "border-t border-slate-100 sm:border-t-0 sm:border-l" : ""}`}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#d8242a]"><Icon className="h-6 w-6" /></span>
                <div>
                  <p className="text-3xl font-black leading-none text-slate-950">{value}</p>
                  <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid items-start gap-7 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,3.1fr)]">
          <aside className="lg:sticky lg:top-24" aria-label="Filter cars">
            <div className="rounded-3xl bg-white p-6 shadow-[0_10px_32px_rgba(15,23,42,0.09)] sm:p-7">
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-lg font-bold text-slate-900">Your Budget</h2>
                  <span className="text-xl font-black text-[#c91f25]">₹{budget.toFixed(1)}L</span>
                </div>
                <input
                  aria-label="Maximum budget in lakh rupees"
                  type="range"
                  min="3.5"
                  max="28.7"
                  step="0.1"
                  value={budget}
                  onChange={(event) => setBudget(Number(event.target.value))}
                  className="mt-6 h-3 w-full cursor-pointer accent-[#d8242a]"
                />
                <div className="mt-2 flex justify-between text-sm font-medium text-slate-500"><span>₹3.5L</span><span>₹28.7L</span></div>
                <p className="mt-4 text-center text-sm text-slate-500">EMI from ₹6,200 / month</p>
              </div>

              <fieldset className="mt-8 border-t border-slate-100 pt-6">
                <legend className="text-sm font-extrabold tracking-[0.12em] text-slate-500">BODY TYPE</legend>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {bodyTypes.map((type) => (
                    <button key={type} type="button" aria-pressed={selectedBodyType === type} onClick={() => { setSelectedBodyType(type); setShowAllModels(false); }} className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${selectedBodyType === type ? "bg-[#d8242a] text-white" : "bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-[#c91f25]"}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-7 border-t border-slate-100 pt-6">
                <legend className="text-sm font-extrabold tracking-[0.12em] text-slate-500">FUEL</legend>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {fuelTypes.map((fuel) => (
                    <button key={fuel} type="button" aria-pressed={selectedFuel === fuel} onClick={() => { setSelectedFuel(fuel); setShowAllModels(false); }} className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${selectedFuel === fuel ? "bg-[#d8242a] text-white" : "bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-[#c91f25]"}`}>
                      {fuel}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </aside>

          <div id="brand-models" className="min-w-0">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                <strong className="font-extrabold text-slate-950">{matchingModels.length} Cars</strong> under <strong className="font-extrabold text-slate-950">₹{budget.toFixed(1)}L</strong>
              </p>
              <label className="flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 sm:self-auto">
                <span className="font-medium">Sort</span>
                <select aria-label="Sort cars" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="max-w-40 bg-transparent font-semibold text-slate-900 outline-none">
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="name">Name</option>
                </select>
              </label>
            </div>

            {visibleModels.length === 0 ? (
              <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">No cars match these filters</h2>
                <p className="mt-2 text-sm text-slate-500">Try a higher budget or another fuel and body type.</p>
              </div>
            ) : (
              <div id="brand-models-grid" className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
                {visibleModels.map((model) => (
                  <article key={model.id} className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_26px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_14px_34px_rgba(15,23,42,0.13)]">
                    <Link href={detailsHref(model.id)} aria-label={`View details for ${model.name}`} className="relative flex aspect-4/3 items-center justify-center overflow-hidden bg-[#eef2f5] p-6">
                      {model.image ? <Image src={model.image} alt={model.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1536px) 50vw, 33vw" className="object-contain p-5" /> : <CarFront className="h-24 w-24 text-slate-300" strokeWidth={1.2} aria-hidden="true" />}
                    </Link>
                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{model.type} <span aria-hidden="true">·</span> {selectedFuel === "All" ? model.fuels.join(" / ") : selectedFuel}</p>
                      <h2 className="mt-3 text-xl font-extrabold text-slate-950">{model.name}</h2>
                      <p className="mt-2 text-sm text-slate-500">Ex-showroom price</p>
                      <p className="text-xl font-black text-slate-900">₹{model.price.toFixed(2)} - {model.priceMax.toFixed(2)} Lakh*</p>
                      <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">{model.specs}</p>
                      <Link href={detailsHref(model.id)} className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#d8242a] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#c91f25]">
                        View Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <p className="mt-5 text-xs text-slate-400">*Prices and model availability are indicative and may vary by location and variant.</p>
            {matchingModels.length > 6 && (
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  aria-expanded={showAllModels}
                  aria-controls="brand-models-grid"
                  onClick={() => setShowAllModels((showAll) => !showAll)}
                  className="rounded-lg bg-[#d8242a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#c91f25]"
                >
                  {showAllModels ? "Show fewer cars" : "Browse all cars"}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}