"use client";

export const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Hybrid", "Electric"];
export const TRANSMISSION_TYPES = ["Manual", "Automatic", "AMT", "CVT", "DCT", "iMT"];

/** Shows every option as a chip; the admin can pick one or more. */
export default function VariantOptionChips({ label, options, value, onChange }: {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  // Keep previously saved values selectable even if they are not in the standard list.
  const all = [...options, ...value.filter((v) => !options.includes(v))];
  const toggle = (option: string) =>
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
  return (
    <div role="group" aria-label={label}>
      <p className="text-sm font-semibold text-slate-300">{label} * <span className="text-xs font-normal text-slate-500">(select one or more)</span></p>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {all.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value.includes(option)}
            onClick={() => toggle(option)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              value.includes(option)
                ? "bg-amber-400 text-slate-950"
                : "border border-slate-600 text-slate-400 hover:border-amber-400 hover:text-amber-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
