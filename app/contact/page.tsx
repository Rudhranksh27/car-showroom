import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import Navbar from "../components/Navbar";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f3f3f3] text-slate-900">
      <Navbar />
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Contact
          </p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Contact Support
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Have a question about a car, test drive, or booking? Get in touch
            with the VirtualDrive team.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <a
              href="mailto:support@yoursite.com"
              className="flex min-h-32 items-start gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-colors hover:border-primary/40 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <span className="block font-semibold text-gray-900">Email support</span>
                <span className="mt-2 block text-sm text-gray-600">support@yoursite.com</span>
              </span>
            </a>

            <div className="flex min-h-32 items-start gap-4 rounded-xl border border-gray-200 bg-white p-6">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <span className="block font-semibold text-gray-900">Visit us</span>
                <span className="mt-2 block text-sm text-gray-600">Guwahati, Assam, India</span>
              </span>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-600">
            Looking to try a car?{" "}
            <Link
              href="/book-test-drive"
              className="font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Book a test drive
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}