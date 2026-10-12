import Navbar from "./components/Navbar";
import HeroDrive from "./components/HeroDrive";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />
      <HeroDrive />
    </main>
  );
}
