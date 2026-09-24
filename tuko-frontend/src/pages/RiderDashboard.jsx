import { Link } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiNavigation, FiPackage, FiDollarSign } from "react-icons/fi";

export default function RiderDashboard(){
  return <div className="min-h-screen bg-[#fffaf3] p-4 text-slate-900 dark:bg-slate-950 dark:text-white">
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold dark:bg-slate-900"><FiArrowLeft/> Customer market</Link>
        <div className="text-right"><div className="text-2xl font-black text-orange-500">TUKO Rider</div><div className="text-xs text-slate-500">Online · Nairobi</div></div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-orange-500 p-6 text-white"><FiNavigation className="text-2xl"/><div className="mt-4 text-3xl font-black">3</div><div>Available jobs nearby</div></div>
        <div className="rounded-3xl bg-white p-6 dark:bg-slate-900"><FiPackage className="text-2xl text-emerald-600"/><div className="mt-4 text-3xl font-black">5</div><div className="text-slate-500">Deliveries today</div></div>
        <div className="rounded-3xl bg-white p-6 dark:bg-slate-900"><FiDollarSign className="text-2xl text-emerald-600"/><div className="mt-4 text-3xl font-black">KSh 1,420</div><div className="text-slate-500">Today’s earnings</div></div>
      </div>
      <section className="mt-8 rounded-[2rem] bg-white p-6 dark:bg-slate-900">
        <p className="text-sm font-bold text-orange-500">Next delivery opportunity</p>
        <h1 className="mt-1 text-3xl font-black">Multi-vendor pickup</h1>
        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="rounded-3xl bg-emerald-50 p-5 dark:bg-emerald-500/10"><FiMapPin className="text-emerald-600"/><div className="mt-2 font-black">TUKO Demo Market</div><div className="text-sm text-slate-500">3 vendor pickups · 2.4 km</div></div>
          <div className="text-center font-black text-slate-400">→</div>
          <div className="rounded-3xl bg-orange-50 p-5 dark:bg-orange-500/10"><FiMapPin className="text-orange-500"/><div className="mt-2 font-black">Kilimani</div><div className="text-sm text-slate-500">Customer delivery · 4.8 km</div></div>
        </div>
        <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800"><div><div className="text-xs text-slate-500">Delivery earnings</div><div className="text-2xl font-black">KSh 280</div></div><button className="rounded-2xl bg-orange-500 px-6 py-3 font-black text-white">Accept delivery</button></div>
      </section>
    </div>
  </div>
}
