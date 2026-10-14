import Link from "next/link";
import { Tag, Car, Layers } from "lucide-react";

export default function AdminOverviewPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-400">Admin Portal</p>
        <h1 className="mt-2 text-3xl font-black text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Manage your car catalog from here.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/brands"
          className="group rounded-xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-amber-400/5 p-6 transition-all hover:scale-[1.02] hover:border-amber-400/40"
        >
          <Tag className="h-8 w-8 text-amber-400" />
          <h3 className="mt-4 text-xl font-black text-white">Brands</h3>
          <p className="mt-1 text-sm text-slate-400">Add and manage car brands</p>
          <p className="mt-4 text-xs font-semibold text-amber-400 group-hover:underline">Manage brands →</p>
        </Link>

        <Link
          href="/admin/models"
          className="group rounded-xl border border-sky-400/20 bg-gradient-to-br from-sky-400/10 to-sky-400/5 p-6 transition-all hover:scale-[1.02] hover:border-sky-400/40"
        >
          <Car className="h-8 w-8 text-sky-400" />
          <h3 className="mt-4 text-xl font-black text-white">Models</h3>
          <p className="mt-1 text-sm text-slate-400">Add models with specs and price range</p>
          <p className="mt-4 text-xs font-semibold text-sky-400 group-hover:underline">Manage models →</p>
        </Link>

        <Link
          href="/admin/variants"
          className="group rounded-xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 to-emerald-400/5 p-6 transition-all hover:scale-[1.02] hover:border-emerald-400/40"
        >
          <Layers className="h-8 w-8 text-emerald-400" />
          <h3 className="mt-4 text-xl font-black text-white">Variants</h3>
          <p className="mt-1 text-sm text-slate-400">Add trims and individual pricing</p>
          <p className="mt-4 text-xs font-semibold text-emerald-400 group-hover:underline">Manage variants →</p>
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Quick Guide</h2>
        <ol className="space-y-2 text-sm text-slate-400">
          <li><span className="font-semibold text-amber-400">1. Add Brands</span> — Create car brands (e.g. Maruti Suzuki, Hyundai)</li>
          <li><span className="font-semibold text-sky-400">2. Add Models</span> — Add car models under each brand with specs and price range</li>
          <li><span className="font-semibold text-emerald-400">3. Add Variants</span> — Add trim variants for each model with individual pricing</li>
          <li><span className="font-semibold text-white">4. Live instantly</span> — Data shows on the user-facing site immediately at <a href="/cars" className="text-amber-400 underline">/cars</a> and <code className="text-xs">/brands/[slug]</code></li>
        </ol>
      </div>
    </div>
  );
}
