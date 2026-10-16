import { Headphones, House, LockKeyhole, ShieldCheck, Star } from "lucide-react";

const trustPoints = [
  {
    label: "Verified inventory",
    detail: "Quality-checked cars",
    icon: ShieldCheck,
  },
  {
    label: "Free home delivery",
    detail: "Straight to your doorstep",
    icon: House,
  },
  {
    label: "Secure booking",
    detail: "Small token, protected payment",
    icon: LockKeyhole,
  },
  {
    label: "Dedicated support",
    detail: "Here whenever you need us",
    icon: Headphones,
  },
  {
    label: "Rated 4.8 out of 5",
    detail: "Trusted by our customers",
    icon: Star,
  },
];

export default function TrustStrip() {
  return (
    <div className="font-[family-name:var(--font-jakarta)]">
      <div className="grid divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-5">
        {trustPoints.map(({ label, detail, icon: Icon }) => (
          <div
            key={label}
            className="group flex min-h-28 items-center gap-4 px-6 py-5 transition-colors duration-200 hover:bg-slate-50 lg:justify-center lg:px-5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-amber-300 shadow-md ring-4 ring-white transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
              <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-extrabold leading-tight tracking-[-0.01em] text-slate-900">{label}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
