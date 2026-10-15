import Link from "next/link";
import CarSlider from "./CarSlider";
import InventoryRange from "./InventoryRange";
import TrustStrip from "./TrustStrip";
import HowItWorks from "./HowItWorks";
import { BadgeCheck, BadgePercent, CarFront, CircleDollarSign, Headphones, House, ShieldCheck, Sparkles, Wallet } from "lucide-react";

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
    title: "Quality-checked cars",
    detail: "Explore verified vehicles with clear details before you decide.",
    icon: BadgeCheck,
    iconStyle: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Doorstep test drives",
    detail: "Experience your shortlist on a test drive at a place that suits you.",
    icon: CarFront,
    iconStyle: "bg-sky-100 text-sky-700",
  },
  {
    title: "Home delivery",
    detail: "Get your chosen car delivered to your doorstep.",
    icon: House,
    iconStyle: "bg-amber-100 text-amber-700",
  },
  {
    title: "Transparent pricing",
    detail: "See vehicle pricing upfront as you compare your options.",
    icon: CircleDollarSign,
    iconStyle: "bg-rose-100 text-rose-700",
  },
  {
    title: "Secure booking",
    detail: "Book with confidence through a protected payment process.",
    icon: ShieldCheck,
    iconStyle: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "People-first support",
    detail: "Get help from selection through booking and delivery.",
    icon: Headphones,
    iconStyle: "bg-teal-100 text-teal-700",
  },
];

const frequentlyAskedQuestions = [
  {
    question: "How do I book a test drive?",
    answer: "Choose a car from the inventory and use its test-drive booking option, or start from the Book a Test Drive link and submit your details.",
  },
   {
    question: "Can I take a test drive at home?",
    answer: "Doorstep test drives are available in supported areas. Share your location when booking so the team can confirm availability.",
  },
  {
    question: "How do I know which cars are available?",
    answer: "Browse the inventory to see listed vehicles and their displayed prices. The category selector shows categories with available cars; other categories are marked coming soon.",
  },
  {
    question: "Does the displayed price include all charges?",
    answer: "Prices shown are starting prices. Confirm the final on-road price and any applicable charges with the team before completing your purchase.",
  },
  {
    question: "What happens after I submit a booking?",
    answer: "Your booking details are submitted for follow-up. The team can confirm the next steps, availability, and any details needed to complete your request.",
  },
];

export default function HeroDrive() {
  return (
    <section className="w-full bg-[#f3f3f3] pb-10 md:pb-16">
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-[#dff1ed] via-[#f5fbf9] to-[#cfe9e3]">
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

          <h1 className="mt-6 text-5xl font-black leading-[0.98] tracking-[-0.04em] text-gray-900 md:text-6xl">
            Pay for the car. <span className="text-[#1a8978]">Not the extras.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
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

      <section id="why-choose-us" className="w-full border-t border-slate-200 bg-[#f3f3f3]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                A better way to buy
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-gray-900 md:text-4xl">
                Why Choose Us
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-slate-500">
              From the first search to the moment your car arrives, every step is designed around you.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map(({ title, detail, icon: Icon, iconStyle }) => (
              <article
                key={title}
                className="border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
              >
                <div className={`flex h-11 w-11 items-center justify-center ${iconStyle}`}>
                  <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="w-full border-t border-slate-200 bg-[#f3f3f3]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Helpful answers
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-gray-900 md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
              Need a hand choosing your next car? Here are answers to some common questions.
            </p>
            <Link
              href="/book-test-drive"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0b3d32] hover:text-sky-700"
            >
              Have another question? Contact us <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="divide-y divide-slate-200 border-y border-slate-200 bg-white">
            {frequentlyAskedQuestions.map(({ question, answer }) => (
              <details key={question} className="group px-5 py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-left text-sm font-bold text-slate-900 marker:content-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b3d32]">
                  {question}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xl font-normal text-[#0b3d32] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pb-5 pr-8 text-sm leading-6 text-slate-600">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
