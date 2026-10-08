import Navbar from "./components/Navbar";
import HeroDrive from "./components/HeroDrive";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f3f3] text-slate-900">
      <Navbar />
      <HeroDrive />
    </main>
  );
}
