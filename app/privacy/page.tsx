import Link from "next/link";
import Navbar from "../components/Navbar";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fa] text-slate-900">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-sky-600">
          ← Back home
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Privacy Policy</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950">How we handle your information</h1>

          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
            <p>
              We collect personal information such as your name, phone number, preferred date, location,
              and dealer preference only to process and confirm your test drive request.
            </p>
            <p>
              This information is used to contact you about your booking, coordinate the appointment, and
              improve our service experience. We do not sell your information to third parties.
            </p>
            <p>
              By submitting this form, you agree that the details provided are accurate and that we may
              use them to contact you regarding your vehicle enquiry and test drive appointment.
            </p>
            <p>
              If you have questions about your data, please contact our support team through the dealership
              channels shown on the website.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
