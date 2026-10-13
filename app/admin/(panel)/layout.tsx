import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { getCurrentUser } from "../../lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Topbar user={user} />
          <main className="min-h-screen flex-1 bg-gray-50 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
