import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiPackage, FiDollarSign, FiClock, FiCheckCircle } from "react-icons/fi";
import { fetchMe, fetchVendorOrders, loginAs, updateVendorOrderStatus } from "../services/api";

const nextStatus={pending:"confirmed",confirmed:"preparing",preparing:"ready"};
const nextLabel={pending:"Accept order",confirmed:"Start preparing",preparing:"Mark ready"};

export default function VendorDashboard(){
  const [orders,setOrders]=useState([]),[loading,setLoading]=useState(false),[message,setMessage]=useState("");
  const [username,setUsername]=useState(""),[password,setPassword]=useState(""),[vendorReady,setVendorReady]=useState(false);

  async function load(){
    setLoading(true); setMessage("");
    try{
      const me=await fetchMe("vendor");
      if(me.role!=="vendor"){setVendorReady(false);setMessage("This account is not a vendor account.");return;}
      setVendorReady(true); setOrders(await fetchVendorOrders());
    }catch(e){setVendorReady(false);setMessage(e.response?.data?.detail||"Sign in with a vendor account.");}
    finally{setLoading(false);}
  }
  useEffect(()=>{if(localStorage.getItem("tuko-vendor-access")) load();},[]);

  async function signIn(e){
    e.preventDefault(); setLoading(true); setMessage("");
    try{await loginAs("vendor",username,password); await load();}
    catch(e){setMessage(e.response?.data?.detail||"Vendor login failed.");setLoading(false);}
  }
  async function advance(order){
    const status=nextStatus[order.status]; if(!status)return;
    try{await updateVendorOrderStatus(order.id,status); await load();}
    catch(e){setMessage(e.response?.data?.detail||JSON.stringify(e.response?.data)||"Could not update order.");}
  }
  const stats=useMemo(()=>({
    count:orders.length,
    sales:orders.reduce((n,o)=>n+Number(o.total||0),0),
    preparing:orders.filter(o=>o.status==="preparing").length,
    ready:orders.filter(o=>o.status==="ready").length,
  }),[orders]);

  return <div className="min-h-screen bg-[#fffaf3] p-4 text-slate-900 dark:bg-slate-950 dark:text-white"><div className="mx-auto max-w-7xl">
    <div className="flex items-center justify-between"><Link to="/" className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold dark:bg-slate-900"><FiArrowLeft/> Customer market</Link><div className="text-right"><div className="text-2xl font-black text-emerald-600">TUKO Vendor</div><div className="text-xs text-slate-500">Live vendor workspace</div></div></div>
    {message&&<div className="mt-5 rounded-2xl bg-orange-100 p-4 text-sm font-bold text-orange-900 dark:bg-orange-500/10 dark:text-orange-200">{message}</div>}
    {!vendorReady&&<form onSubmit={signIn} className="mx-auto mt-12 max-w-md rounded-[2rem] bg-white p-6 shadow-xl dark:bg-slate-900"><p className="text-sm font-bold text-emerald-600">Vendor access</p><h1 className="mt-1 text-3xl font-black">Sign in to your shop</h1><p className="mt-2 text-sm text-slate-500">Use a TUKO account whose role is vendor.</p><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Vendor username" className="mt-5 w-full rounded-2xl border p-4 dark:border-slate-700 dark:bg-slate-950"/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="mt-3 w-full rounded-2xl border p-4 dark:border-slate-700 dark:bg-slate-950"/><button disabled={loading} className="mt-4 w-full rounded-2xl bg-emerald-600 py-4 font-black text-white disabled:opacity-50">{loading?"Signing in...":"Open vendor dashboard"}</button></form>}
    {vendorReady&&<>
      <div className="mt-8 grid gap-4 md:grid-cols-4"><Stat icon={<FiPackage/>} label="Visible orders" value={stats.count}/><Stat icon={<FiDollarSign/>} label="Order value" value={`KSh ${stats.sales.toLocaleString()}`}/><Stat icon={<FiClock/>} label="Preparing" value={stats.preparing}/><Stat icon={<FiCheckCircle/>} label="Ready pickup" value={stats.ready}/></div>
      <section className="mt-8 rounded-[2rem] bg-white p-5 shadow-sm dark:bg-slate-900"><div className="flex items-center justify-between"><div><p className="text-sm font-bold text-orange-500">Live orders</p><h1 className="text-3xl font-black">Incoming orders</h1></div><button onClick={load} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold dark:bg-slate-800">Refresh</button></div>
      <div className="mt-5 space-y-3">{!orders.length&&<div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500 dark:bg-slate-800">No orders for this vendor yet.</div>}{orders.map(o=><div key={o.id} className="rounded-3xl border border-slate-100 p-4 dark:border-slate-800"><div className="flex justify-between gap-4"><div><div className="font-black">Order #{o.id}</div><div className="mt-1 text-sm text-slate-500">{o.items?.map(i=>`${i.product_name} × ${Number(i.quantity)}`).join(", ")}</div></div><b>KSh {Number(o.total).toLocaleString()}</b></div><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase text-amber-800">{o.status}</span>{nextStatus[o.status]&&<button onClick={()=>advance(o)} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white">{nextLabel[o.status]}</button>}</div></div>)}</div></section>
    </>}
  </div></div>
}
function Stat({icon,label,value}){return <div className="rounded-3xl bg-white p-5 dark:bg-slate-900"><div className="text-2xl text-emerald-600">{icon}</div><div className="mt-3 text-2xl font-black">{value}</div><div className="text-sm text-slate-500">{label}</div></div>}
