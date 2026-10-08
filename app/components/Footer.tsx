"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  BriefcaseBusiness,
  Camera,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  ShieldCheck,
  Truck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Press", href: "/press" },
  { label: "Contact", href: "/book-test-drive" },
];

const browseLinks = [
  { label: "All Cars", href: "/cars" },
  { label: "SUV", href: "/cars?category=SUV" },
  { label: "Sedan", href: "/cars?category=Sedan" },
  { label: "Hatchback", href: "/cars?category=Hatchback" },
  { label: "MUV", href: "/cars?category=MUV" },
  { label: "Luxury", href: "/cars?category=Luxury" },
];

const supportLinks = [
  { label: "FAQs", href: "/#faq" },
  { label: "Booking Help", href: "/book-test-drive" },
  { label: "Test Drive", href: "/book-test-drive" },
  { label: "Cancellation", href: "/book-test-drive" },
  { label: "Track Order", href: "/cars" },
];

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Cookie Policy", href: "/cookies" },
];

const bottomBarLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

const contactDetails: { label: string; href?: string; icon: LucideIcon }[] = [
  { label: "Guwahati, Assam, India", icon: MapPin },
  { label: "+91-XXXXX-XXXXX", icon: Phone },
  { label: "support@yoursite.com", href: "mailto:support@yoursite.com", icon: Mail },
];

const trustBadges = [
  { label: "Verified Dealers", icon: ShieldCheck },
  { label: "Secure Payments", icon: LockKeyhole },
  { label: "Free Home Delivery", icon: Truck },
];

const paymentMethods = ["Razorpay", "UPI", "Visa", "Mastercard", "RuPay", "NetBanking"];

const socialLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Instagram", href: "https://www.instagram.com/", icon: Camera },
  { label: "Facebook", href: "https://www.facebook.com/", icon: UsersRound },
  { label: "Twitter", href: "https://twitter.com/", icon: MessageCircle },
  { label: "YouTube", href: "https://www.youtube.com/", icon: Play },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: BriefcaseBusiness },
];

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">{title}</h2>
      <ul className="space-y-2.5">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="text-sm text-gray-400 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const [newsletterMessage, setNewsletterMessage] = useState("");

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNewsletterMessage("Newsletter signup is not connected yet.");
  }

  return (
    <footer className="w-full">
      {/* Layer 1: newsletter */}
      <section className="border-b border-gray-100 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 md:text-xl">
              Get new arrivals &amp; offers in your inbox
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Be the first to know about new cars and exclusive deals.
            </p>
          </div>

          <div className="w-full md:max-w-md">
            <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleNewsletterSubmit}>
              <label className="sr-only" htmlFor="footer-newsletter-email">
                Email address
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                autoComplete="email"
                required
                placeholder="Your email address"
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              >
                Subscribe
              </button>
            </form>
            <p aria-live="polite" className="mt-2 min-h-4 text-xs text-gray-400">
              {newsletterMessage || "We respect your privacy. Unsubscribe anytime."}
            </p>
          </div>
        </div>
      </section>

      {/* Layer 2: main footer */}
      <section className="bg-gray-900 py-14 text-gray-300">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="text-xl font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              VirtualDrive
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
              India&apos;s trusted multi-brand car showroom. Browse, test drive, and book, all with free home delivery.
            </p>
            <address className="mt-6 space-y-2 not-italic">
              {contactDetails.map(({ label, href, icon: Icon }) => {
                const content = (
                  <>
                    <Icon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                    <span>{label}</span>
                  </>
                );

                return (
                  <div key={label} className="flex items-center gap-2 text-sm text-gray-400">
                    {href ? (
                      <a href={href} className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-white">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </div>
                );
              })}
            </address>
          </div>

          <FooterLinkGroup title="Company" links={companyLinks} />
          <FooterLinkGroup title="Browse Cars" links={browseLinks} />
          <FooterLinkGroup title="Support" links={supportLinks} />
          <FooterLinkGroup title="Legal" links={legalLinks} />
        </div>
      </section>

      {/* Layer 3: trust, payments, and social links */}
      <section className="border-t border-gray-800 bg-gray-900 py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center justify-items-center gap-6 px-6 md:grid-cols-[1fr_auto_1fr]">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:justify-start">
            {trustBadges.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-2 text-xs text-gray-400">
                <Icon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>

          <ul aria-label="Accepted payment methods" className="flex flex-wrap items-center justify-center gap-2">
            {paymentMethods.map((method) => (
              <li key={method} className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-400">
                {method}
              </li>
            ))}
          </ul>

          <nav aria-label="Social media" className="flex items-center gap-3 md:justify-self-end">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="rounded-full p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Layer 4: bottom bar */}
      <section className="border-t border-gray-800 bg-gray-950 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 text-center md:flex-row md:justify-between md:text-left">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} VirtualDrive. All rights reserved.
          </p>
          <nav aria-label="Footer legal links" className="flex flex-wrap items-center justify-center gap-4">
            {bottomBarLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-gray-500 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </footer>
  );
}