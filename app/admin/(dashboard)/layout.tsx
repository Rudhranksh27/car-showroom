import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "../../lib/auth";
import { ADMIN_SESSION_COOKIE } from "../../lib/admin-auth";
import AdminNavbar from "../components/AdminNavbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const admin = verifySessionToken(token);

  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNavbar adminName={admin.name} />
      <main className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
