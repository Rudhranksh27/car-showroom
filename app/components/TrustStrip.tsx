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
    <div>
      <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-5">
        {trustPoints.map(({ label, detail, icon: Icon }) => (
          <div key={label} className="flex min-h-24 items-center gap-3.5 px-5 py-5 lg:justify-center lg:px-5">
            <Icon className={`h-6 w-6 shrink-0 text-sky-600 ${label === "Verified inventory" ? "invisible" : ""}`} strokeWidth={1.8} aria-hidden="true" />
            <div>
              <p className="text-base font-bold text-slate-800">{label}</p>
              <p className="mt-0.5 text-sm text-slate-500">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
