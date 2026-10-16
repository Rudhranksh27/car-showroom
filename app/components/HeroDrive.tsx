import Link from "next/link";
import CarSlider from "./CarSlider";
import InventoryRange from "./InventoryRange";
import TrustStrip from "./TrustStrip";
import HowItWorks from "./HowItWorks";
import { BadgeCheck, BadgePercent, CarFront, CircleDollarSign, Headphones, House, MessageCircleQuestion, ShieldCheck, Sparkles, Wallet } from "lucide-react";

const heroHighlights = [
  {
    title: "Keep the money dealers add on",
    detail: "No forced accessories, no inflated fees. Save on every car you buy.",
    icon: BadgePercent,
  },
  {
    title: "Reserve with a small booking amount",
    detail: "Lock in your car online in minutes, with no big upfront payment.",
    icon: Wallet,
  },
  {
    title: "Delivered free to your doorstep",
    detail: "Skip the showroom queues. Your car arrives right at your home.",
    icon: House,
  },
];

const whyChooseUs = [
  {
    title: "Zero dealer add-ons",
    detail: "No forced accessories or inflated fees. You pay for the car, not the extras.",
    tag: "Save money",
    icon: BadgePercent,
    glow: "#64748b",
    gradient: "bg-slate-100 text-slate-800 ring-slate-200 group-hover:bg-slate-900 group-hover:text-white",
    accent: "bg-slate-800",
    soft: "bg-slate-100 text-slate-700",
  },
  {
    title: "Small booking amount",
    detail: "Reserve your car online in minutes without a big upfront payment.",
    tag: "Low upfront",
    icon: Wallet,
    glow: "#64748b",
    gradient: "bg-slate-100 text-slate-800 ring-slate-200 group-hover:bg-slate-900 group-hover:text-white",
    accent: "bg-slate-800",
    soft: "bg-slate-100 text-slate-700",
  },
  {
    title: "Free home delivery",
    detail: "Skip the showroom queues. Your car is delivered right to your doorstep.",
    tag: "Save time",
    icon: House,
    glow: "#64748b",
    gradient: "bg-slate-100 text-slate-800 ring-slate-200 group-hover:bg-slate-900 group-hover:text-white",
    accent: "bg-slate-800",
    soft: "bg-slate-100 text-slate-700",
  },
  {
    title: "Doorstep test drives",
    detail: "Try your shortlisted cars at a place and time that suits you.",
    tag: "Try first",
    icon: CarFront,
    glow: "#64748b",
    gradient: "bg-slate-100 text-slate-800 ring-slate-200 group-hover:bg-slate-900 group-hover:text-white",
    accent: "bg-slate-800",
    soft: "bg-slate-100 text-slate-700",
  },
  {
    title: "Transparent pricing",
    detail: "See starting prices upfront and compare cars with no hidden surprises.",
    tag: "No surprises",
    icon: CircleDollarSign,
    glow: "#64748b",
    gradient: "bg-slate-100 text-slate-800 ring-slate-200 group-hover:bg-slate-900 group-hover:text-white",
    accent: "bg-slate-800",
    soft: "bg-slate-100 text-slate-700",
  },
  {
    title: "Quality-checked cars",
    detail: "Verified vehicles with clear specs, variants and details before you decide.",
    tag: "Verified",
    icon: BadgeCheck,
    glow: "#64748b",
    gradient: "bg-slate-100 text-slate-800 ring-slate-200 group-hover:bg-slate-900 group-hover:text-white",
    accent: "bg-slate-800",
    soft: "bg-slate-100 text-slate-700",
  },
  {
    title: "Secure booking",
    detail: "Your booking and payment are handled through a protected process.",
    tag: "Protected",
    icon: ShieldCheck,
    glow: "#64748b",
    gradient: "bg-slate-100 text-slate-800 ring-slate-200 group-hover:bg-slate-900 group-hover:text-white",
    accent: "bg-slate-800",
    soft: "bg-slate-100 text-slate-700",
  },
  {
    title: "People-first support",
    detail: "Real help from choosing a car through booking and delivery.",
    tag: "Always helpful",
    icon: Headphones,
    glow: "#64748b",
    gradient: "bg-slate-100 text-slate-800 ring-slate-200 group-hover:bg-slate-900 group-hover:text-white",
    accent: "bg-slate-800",
    soft: "bg-slate-100 text-slate-700",
  },
];

const frequentlyAskedQuestions = [
  {
    question: "What exactly do I pay for when I book through you?",
    answer: "You pay a small booking amount online to reserve your car. We keep dealer-added extras like forced accessories off your bill. Confirm the final on-road price with the team before completing your purchase.",
  },
  {
    question: "How do I book a test drive?",
    answer: "Choose a car from the inventory and use its test-drive booking option, or start from the Book a Test Drive link and submit your details.",
  },
  {
    question: "Can I take a test drive at home?",
    answer: "Doorstep test drives are available in supported areas. Share your location when booking so the team can confirm availability.",
  },
  {
    question: "How does home delivery work?",
    answer: "Once your booking is confirmed, we coordinate with the dealership and arrange for your car to be delivered to your doorstep. The team will share the timeline and next steps with you.",
  },
  {
    question: "Does the displayed price include all charges?",
    answer: "Prices shown are starting prices. Confirm the final on-road price and any applicable charges with the team before completing your purchase.",
  },
  {
    question: "How do I know which cars are available?",
    answer: "Browse the inventory to see listed vehicles and their displayed prices. The category selector shows categories with available cars; other categories are marked coming soon.",
  },
  {
    question: "What happens after I submit a booking?",
    answer: "Your booking details are submitted for follow-up. The team can confirm the next steps, availability, and any details needed to complete your request.",
  },
];

export default function HeroDrive() {
  return (
    <section className="w-full bg-[#f3f3f3] pb-10 md:pb-16">
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-[#dff1ed] via-[#f5fbf9] to-[#cfe9e3] font-[family-name:var(--font-jakarta)]">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-32 -z-10 h-[26rem] w-[26rem] rounded-full bg-[#1a8978]/25 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 right-[-6rem] -z-10 h-[30rem] w-[30rem] rounded-full bg-amber-200/50 blur-3xl" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(#0b3d32_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />

        <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 px-0 pb-24 pt-14 md:px-6 lg:grid-cols-12 lg:px-10 lg:pb-32 lg:pt-20">
          <div className="lg:col-span-5">
          <p className="inline-flex items-center gap-2.5 rounded-full bg-[#0b3d32] px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.16em] text-white shadow-lg shadow-[#0b3d32]/30 ring-4 ring-[#1a8978]/15">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-300" />
            </span>
            <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
            Zero dealer add-on fees
          </p>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-[-0.035em] text-gray-900 md:text-6xl xl:text-7xl">
            Pay for the car. <span className="text-[#1a8978]">Not the extras.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg font-medium leading-8 text-gray-600">
            Say goodbye to inflated dealer charges. Reserve your dream car with a small booking amount and we deliver it
            straight to your doorstep.
          </p>

          <ul className="mt-8 grid max-w-lg gap-5">
            {heroHighlights.map(({ title, detail, icon: Icon }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a8978]/10 text-[#1a8978]">
                  <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="text-base leading-6 text-gray-600">
                  <strong className="block text-lg font-bold text-gray-900">{title}</strong>
                  {detail}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center rounded-full bg-[#1a8978] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#1a8978]/25 transition-colors duration-200 hover:bg-[#147261] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147261]"
            >
              Browse &amp; Book Your Car →
            </Link>

            <Link
              href="/book-test-drive"
              className="inline-flex items-center text-base font-semibold text-gray-700 transition-colors hover:text-gray-900"
            >
              Book a Test Drive
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3 text-sm font-semibold text-gray-500">
            <span>500+ cars</span>
            <span className="text-gray-300">•</span>
            <span>50+ brands</span>
            <span className="text-gray-300">•</span>
            <span>Instant booking</span>
          </div>
          </div>

          <div className="relative lg:col-span-7">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-[8%] inset-y-[12%] rounded-full bg-white/70 blur-2xl" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-[16%] bottom-[14%] h-8 rounded-[50%] bg-[#0b3d32]/20 blur-xl" />
            <div className="relative">
              <CarSlider />
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-12 max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <TrustStrip />
      </div>

      <HowItWorks />

      <InventoryRange />

      <section id="why-choose-us" className="w-full border-t border-slate-200 bg-[#f3f3f3] font-[family-name:var(--font-jakarta)]">
        <div className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              A better way to buy
            </p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.03em] text-gray-900 md:text-5xl">
              Why book your car with us
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Buying a car shouldn&apos;t mean hidden charges and showroom hassle. We let you pick, test drive and
              book online, then deliver the car to your door.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map(({ title, detail, tag, icon: Icon, gradient, accent, soft, glow }) => (
              <article
                key={title}
                style={{ "--glow": glow } as React.CSSProperties}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-transparent transition duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-2xl hover:shadow-slate-300/60"
              >
                <span aria-hidden="true" className="edge-glow" />
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${accent}`}
                />
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-25 ${accent}`}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white via-white to-slate-50"
                />

                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ring-1 transition duration-300 group-hover:scale-105 ${gradient}`}
                >
                  <Icon className="h-7 w-7" strokeWidth={1.8} aria-hidden="true" />
                </div>

                <h3 className="relative mt-6 text-xl font-extrabold tracking-[-0.01em] text-slate-900">{title}</h3>
                <p className="relative mt-3 text-base leading-7 text-slate-600">{detail}</p>

                <span className={`relative mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${soft}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                  {tag}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="w-full border-t border-slate-200 bg-white font-[family-name:var(--font-outfit)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-8">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              Got questions?
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.02em] text-gray-900 md:text-5xl">
              Answers before you <span className="text-[#1a8978]">ask</span>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-slate-600">
              Pricing, test drives, booking and delivery: everything people usually want to know before they reserve
              a car.
            </p>

            <div className="mt-8 max-w-md rounded-2xl bg-[#0b3d32] p-6 text-white shadow-xl shadow-[#0b3d32]/20">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <MessageCircleQuestion className="h-6 w-6 text-amber-300" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p className="mt-4 text-xl font-bold">Still have a question?</p>
              <p className="mt-1 text-sm leading-6 text-emerald-100/80">
                Our team will help you from choosing a car to delivery.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0b3d32] transition hover:bg-amber-200"
              >
                Talk to us <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {frequentlyAskedQuestions.map(({ question, answer }, index) => (
              <details
                key={question}
                open={index === 0}
                className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow open:border-[#1a8978]/40 open:shadow-lg open:shadow-slate-200/70 hover:border-slate-300"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 p-5 text-left marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b3d32] [&::-webkit-details-marker]:hidden">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a8978]/10 text-sm font-black text-[#1a8978] transition-colors group-open:bg-[#0b3d32] group-open:text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-lg font-bold text-slate-900">{question}</span>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xl leading-none text-[#0b3d32] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-6 pl-[4.5rem] pr-6 text-base leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
