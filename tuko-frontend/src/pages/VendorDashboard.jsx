import { Link } from "react-router-dom";
import { FiArrowLeft, FiPackage, FiDollarSign, FiClock, FiCheckCircle } from "react-icons/fi";

const demoOrders = [
  { id: 1042, customer: "Amina", items: "Tomatoes, potatoes, avocado", total: 860, status: "pending" },
  { id: 1041, customer: "Kevin", items: "Eggs, milk", total: 720, status: "preparing" },
  { id: 1040, customer: "Wanjiku", items: "Rice, beans", total: 940, status: "ready" },
];

export default function VendorDashboard(){
  return <div className="min-h-screen bg-[#fffaf3] p-4 text-slate-900 dark:bg-slate-950 dark:text-white">
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold dark:bg-slate-900"><FiArrowLeft/> Customer market</Link>
        <div className="text-right"><div className="text-2xl font-black text-emerald-600">TUKO Vendor</div><div className="text-xs text-slate-500">Fresh Basket Market</div></div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat icon={<FiPackage/>} label="Orders today" value="18"/>
        <Stat icon={<FiDollarSign/>} label="Sales today" value="KSh 12,480"/>
        <Stat icon={<FiClock/>} label="Preparing" value="4"/>
        <Stat icon={<FiCheckCircle/>} label="Ready pickup" value="3"/>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
        <section className="rounded-[2rem] bg-white p-5 shadow-sm dark:bg-slate-900">
          <div className="flex items-center justify-between"><div><p className="text-sm font-bold text-orange-500">Live orders</p><h1 className="text-3xl font-black">Incoming orders</h1></div><span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">3 need attention</span></div>
          <div className="mt-5 space-y-3">{demoOrders.map(o=><div key={o.id} className="rounded-3xl border border-slate-100 p-4 dark:border-slate-800">
            <div className="flex justify-between gap-4"><div><div className="font-black">Order #{o.id}</div><div className="text-sm text-slate-500">{o.customer} · {o.items}</div></div><b>KSh {o.total}</b></div>
            <div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase text-amber-800">{o.status}</span><button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white">Accept / next step</button><button className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold dark:bg-slate-800">Unavailable item</button></div>
          </div>)}</div>
        </section>
        <section className="rounded-[2rem] bg-emerald-700 p-6 text-white">
          <p className="text-sm font-bold text-emerald-200">Store controls</p><h2 className="mt-1 text-3xl font-black">You’re open</h2>
          <p className="mt-3 text-sm text-white/75">Customers can currently see your active products.</p>
          <button className="mt-5 w-full rounded-2xl bg-white py-3 font-black text-emerald-700">Manage products & stock</button>
          <button className="mt-3 w-full rounded-2xl bg-black/15 py-3 font-bold">Payment settings</button>
          <div className="mt-6 rounded-2xl bg-white/10 p-4"><div className="text-xs text-white/70">Settlement</div><div className="mt-1 font-bold">M-PESA Till ••••890</div></div>
        </section>
      </div>
    </div>
  </div>
}

function Stat({icon,label,value}){return <div className="rounded-3xl bg-white p-5 dark:bg-slate-900"><div className="text-2xl text-emerald-600">{icon}</div><div className="mt-3 text-2xl font-black">{value}</div><div className="text-sm text-slate-500">{label}</div></div>}
