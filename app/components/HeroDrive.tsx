import Link from "next/link";
import CarSlider from "./CarSlider";
import InventoryRange from "./InventoryRange";
import TrustStrip from "./TrustStrip";
import { BadgeCheck, CarFront, CircleDollarSign, Headphones, House, ShieldCheck } from "lucide-react";

const serviceLinks = [
  { label: "Maintenance", detail: "Keep every mile running smoothly." },
  { label: "Repairs", detail: "Certified care when you need it." },
  { label: "Financing", detail: "Flexible plans for your next drive." },
  { label: "Trade-in", detail: "Get a fair value for your current car." },
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
    <section className="w-full bg-[#f3f3f3] py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 rounded-t-2xl border border-gray-200 bg-white px-6 py-10 md:px-10 lg:grid-cols-12 lg:px-12 lg:py-14">
          <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            PREMIUM SHOWROOM
          </p>

          <h1 className="mt-5 text-4xl font-black leading-[0.96] tracking-[-0.04em] text-gray-900 md:text-5xl">
            Find Your Next Drive
          </h1>

          <p className="mt-5 max-w-md text-base leading-7 text-gray-600">
            Explore handpicked models, compare features, and reserve the right fit for your lifestyle in minutes.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center rounded-full bg-[#1a8978] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1a8978]/20 transition-colors duration-200 hover:bg-[#147261] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147261]"
            >
              Browse Inventory →
            </Link>

            <Link
              href="/book-test-drive"
              className="inline-flex items-center text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900"
            >
              Book a Test Drive
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-medium text-gray-400">
            <span>500+ cars</span>
            <span className="text-gray-300">•</span>
            <span>50+ brands</span>
            <span className="text-gray-300">•</span>
            <span>Instant booking</span>
          </div>
          </div>

          <div className="lg:col-span-7">
            <CarSlider />
          </div>
        </div>

        <TrustStrip />
      </div>

      <section id="services" className="mt-16 w-full scroll-mt-20 bg-[#f3f3f3]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Everything after the sale
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-gray-900 md:text-4xl">
              Find Your Services
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-500">
              Expert support, simple financing, and dependable care for every stage of ownership.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {serviceLinks.map((service) => (
                <Link
                  key={service.label}
                  href={`/services/${service.label.toLowerCase()}`}
                  className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:shadow-lg hover:shadow-slate-200/70"
                >
                  <span className="text-sm font-bold uppercase tracking-widest text-slate-900">
                    {service.label}
                  </span>
                  <span className="mt-3 block text-sm leading-6 text-slate-500">
                    {service.detail}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

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
