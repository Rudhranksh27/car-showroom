"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is home delivery really free?",
    answer:
      "Yes. We offer free home delivery within Guwahati city limits. For extended areas, a small delivery fee may apply depending on distance. You'll see the exact amount before confirming your booking.",
  },
  {
    question: "How does the doorstep test drive work?",
    answer:
      "Pick any car you like, choose a date and time slot, and we'll bring the car to your home or office. The test drive is completely free — no obligation to book. Our team will accompany you throughout.",
  },
  {
    question: "How long does delivery take after booking?",
    answer:
      "Once your booking is confirmed and payment is processed, we typically deliver within 2–5 business days, depending on the car and your location. You'll receive live updates via SMS and email.",
  },
  {
    question: "How do I book a car on your platform?",
    answer:
      "Simply browse our inventory, select a car, and click Book Now. Fill in your details, choose your payment method (full payment or token amount), and confirm. You'll receive a booking reference instantly.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, credit/debit cards, net banking, and EMI options through Razorpay. All payments are securely processed — we never store your card details.",
  },
  {
    question: "Are the cars and dealers verified?",
    answer:
      "Absolutely. Every car in our showroom comes from a certified dealer and passes a 150-point quality inspection. We only list vehicles with verified documents and clear titles.",
  },
  {
    question: "Can I cancel my booking?",
    answer:
      "Yes. You can cancel within 24 hours of booking for a full refund. After 24 hours, cancellation charges may apply. See our cancellation policy for details.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Everything you need to know before booking your car.
          </p>
        </header>

        <div className="mt-10 space-y-3">
          {faqs.map(({ question, answer }, index) => {
            const isOpen = openIndex === index;
            const questionId = `faq-question-${index}`;
            const answerId = `faq-answer-${index}`;

            return (
              <div
                key={question}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-200 ease-out hover:border-gray-200 hover:shadow-sm"
              >
                <button
                  id={questionId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() =>
                    setOpenIndex((current) => (current === index ? null : index))
                  }
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
                >
                  <span>{question}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ease-out ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className={`border-t px-6 text-sm leading-relaxed text-gray-600 transition-[padding,border-color] duration-300 ease-out ${
                        isOpen
                          ? "border-gray-100 pb-5 pt-4"
                          : "border-transparent pb-0 pt-0"
                      }`}
                    >
                      {answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Still have questions?{" "}
          <Link
            href="/contact"
            className="font-semibold text-primary hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Contact Support →
          </Link>
        </p>
      </div>
    </section>
  );
}