import { Headphones, House, LockKeyhole, ShieldCheck, Star } from "lucide-react";

const trustPoints = [
  {
    label: "Verified inventory",
    detail: "Quality-checked cars",
    icon: ShieldCheck,
  },
  {
    label: "Free home delivery",
    detail: "Convenient doorstep service",
    icon: House,
  },
  {
    label: "Secure booking",
    detail: "Protected payment process",
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
      <div className="grid overflow-hidden rounded-b-2xl border-x border-b border-[#0b3d32] bg-[#f3f3f3] divide-y divide-[#0b3d32] md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-5">
        {trustPoints.map(({ label, detail, icon: Icon }) => (
          <div key={label} className="flex min-h-20 items-center gap-3 px-4 py-4 lg:justify-center lg:px-5">
            <Icon className={`h-5 w-5 shrink-0 text-sky-600 ${label === "Verified inventory" ? "invisible" : ""}`} strokeWidth={1.8} aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
