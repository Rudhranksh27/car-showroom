import Link from "next/link";
import { ArrowRight, Check, Handshake, Search, Truck, Wallet, X } from "lucide-react";

const steps = [
  {
    title: "Choose your car",
    detail: "Browse models and variants with clear prices. Pick the exact one you want.",
    icon: Search,
  },
  {
    title: "Book with a small amount",
    detail: "Reserve it online by paying a small booking amount through a secure payment.",
    icon: Wallet,
  },
  {
    title: "We handle the dealer",
    detail: "We coordinate with the dealership for you and keep the add-ons off your bill.",
    icon: Handshake,
  },
  {
    title: "Delivered to your door",
    detail: "Your car arrives at your home. No showroom trips, no waiting around.",
    icon: Truck,
  },
];

const comparison = [
  {
    topic: "Add-ons & extra fees",
    dealer: "Accessories and fees are often bundled into the bill",
    us: "No dealer-added costs from us",
  },
  {
    topic: "Paying upfront",
    dealer: "Larger advance and negotiation at the showroom",
    us: "A small booking amount, paid online",
  },
  {
    topic: "Showroom visits",
    dealer: "Multiple trips and long waits",
    us: "Book from your phone, any time",
  },
  {
    topic: "Price clarity",
    dealer: "The real price emerges after extras are added",
    us: "Clear pricing before you book",
  },
  {
    topic: "Getting the car",
    dealer: "Collect it from the showroom",
    us: "Delivered to your doorstep",
  },
];

export default function HowItWorks() {
  return (
    <>
      <section id="how-it-works" className="font-[family-name:var(--font-jakarta)] mt-16 w-full scroll-mt-20 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[15px] font-semibold uppercase tracking-[0.28em] text-primary">Simple. Transparent. Doorstep.</p>
            <h2 className="mt-3 text-[37px] font-extrabold tracking-[-0.03em] text-gray-900 md:text-[49px]">How VirtualDrive Works</h2>
            <p className="mt-5 text-[19px] leading-8 text-gray-600">
              We&apos;re the middleman that works for you, not the dealer. We sit between you and the dealership so the
              extras never reach your bill.
            </p>
          </div>

          <ol className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-[26px] hidden h-[3px] lg:block">
              <div className="flow-line h-full w-full opacity-60" />
              <span className="flow-dot absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.3),0_0_14px_rgba(251,191,36,0.8)]" />
            </div>
            {steps.map(({ title, detail, icon: Icon }, index) => (
              <li key={title} className="relative flex flex-col items-center text-center">
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0b3d32] text-white shadow-lg shadow-[#0b3d32]/25 ring-8 ring-white">
                  <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[13px] font-extrabold text-slate-900">
                    {index + 1}
                  </span>
                </span>
                <h3 className="mt-5 text-[21px] font-bold text-slate-900">{title}</h3>
                <p className="mt-2 max-w-xs text-[17px] leading-7 text-slate-600">{detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="compare" className="font-[family-name:var(--font-jakarta)] w-full scroll-mt-20 border-t border-slate-200 bg-[#f3f3f3]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">See the difference</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] text-gray-900 md:text-5xl">
              Us vs. the usual dealership
            </h2>
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[1fr_1.3fr_1.3fr] border-b border-slate-200 bg-slate-50 text-sm font-extrabold uppercase tracking-[0.14em] md:grid">
              <div className="px-6 py-4 text-slate-400">&nbsp;</div>
              <div className="px-6 py-4 text-slate-500">Typical dealership</div>
              <div className="bg-[#0b3d32] px-6 py-4 text-white">VirtualDrive</div>
            </div>

            {comparison.map(({ topic, dealer, us }) => (
              <div
                key={topic}
                className="grid border-b border-slate-100 last:border-b-0 md:grid-cols-[1fr_1.3fr_1.3fr]"
              >
                <p className="px-6 pt-5 text-lg font-extrabold tracking-[-0.01em] text-slate-900 md:py-5">{topic}</p>
                <p className="flex items-start gap-3 px-6 py-2 text-base font-medium leading-7 text-slate-600 md:py-5">
                  <X className="mt-1 h-5 w-5 shrink-0 text-rose-400" aria-hidden="true" />
                  <span><span className="font-semibold text-slate-400 md:hidden">Dealership: </span>{dealer}</span>
                </p>
                <p className="flex items-start gap-3 bg-emerald-50/70 px-6 py-3 pb-5 text-base font-semibold leading-7 text-slate-900 md:py-5">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden="true" />
                  <span><span className="font-semibold text-emerald-700 md:hidden">VirtualDrive: </span>{us}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="text-xl font-extrabold tracking-[-0.01em] text-slate-900">Ready to skip the extras?</p>
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b3d32] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#0b3d32]/25 transition hover:-translate-y-0.5 hover:bg-[#082d25]"
            >
              Browse &amp; Book Your Car <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
