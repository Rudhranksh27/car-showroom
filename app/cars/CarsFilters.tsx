"use client";

import { useRouter } from "next/navigation";

const BUDGET_OPTIONS = [
  { label: "All budgets", value: "" },
  { label: "Under ₹5L", value: "5" },
  { label: "₹5 – 10L", value: "10" },
  { label: "₹10 – 15L", value: "15" },
  { label: "₹15 – 25L", value: "25" },
  { label: "₹25L+", value: "100" },
];

type Props = {
  fuelTypes: string[];
  bodyTypes: string[];
  currentBrand: string;
  currentFuel: string;
  currentType: string;
  currentBudget: string;
};

export default function CarsFilters({
  fuelTypes,
  bodyTypes,
  currentBrand,
  currentFuel,
  currentType,
  currentBudget,
}: Props) {
  const router = useRouter();

  function navigate(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = {
      brand: currentBrand,
      fuel: currentFuel,
      type: currentType,
      budget: currentBudget,
      ...overrides,
    };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    router.push(`/cars${params.size ? `?${params.toString()}` : ""}`);
  }

  const hasFilters = currentFuel || currentType || currentBudget;

  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Filter by</p>
        {hasFilters && (
          <button
            type="button"
            onClick={() => navigate({ fuel: "", type: "", budget: "" })}
            className="text-sm font-bold text-[#0b3d32] hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Budget */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Budget</p>
        <div className="flex flex-wrap gap-2">
          {BUDGET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => navigate({ budget: opt.value })}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                currentBudget === opt.value
                  ? "border-[#0b3d32] bg-[#0b3d32] text-white"
                  : "border-slate-200 text-slate-600 hover:border-slate-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel type */}
      {fuelTypes.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Fuel Type</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate({ fuel: "" })}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                !currentFuel
                  ? "border-[#0b3d32] bg-[#0b3d32] text-white"
                  : "border-slate-200 text-slate-600 hover:border-slate-400"
              }`}
            >
              All
            </button>
            {fuelTypes.map((fuel) => (
              <button
                key={fuel}
                type="button"
                onClick={() => navigate({ fuel: currentFuel === fuel ? "" : fuel })}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  currentFuel === fuel
                    ? "border-[#0b3d32] bg-[#0b3d32] text-white"
                    : "border-slate-200 text-slate-600 hover:border-slate-400"
                }`}
              >
                {fuel}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Body type */}
      {bodyTypes.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Body Type</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate({ type: "" })}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                !currentType
                  ? "border-[#0b3d32] bg-[#0b3d32] text-white"
                  : "border-slate-200 text-slate-600 hover:border-slate-400"
              }`}
            >
              All
            </button>
            {bodyTypes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => navigate({ type: currentType === t ? "" : t })}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  currentType === t
                    ? "border-[#0b3d32] bg-[#0b3d32] text-white"
                    : "border-slate-200 text-slate-600 hover:border-slate-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
