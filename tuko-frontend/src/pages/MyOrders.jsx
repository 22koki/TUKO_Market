import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiPackage, FiTruck } from "react-icons/fi";
import { fetchOrders } from "../services/api";

const stages=["pending","confirmed","preparing","ready","out_for_delivery","delivered"];
const labels={pending:"Order placed",confirmed:"Vendor confirmed",preparing:"Being prepared",ready:"Ready for rider",out_for_delivery:"Out for delivery",delivered:"Delivered",cancelled:"Cancelled"};

export default function MyOrders(){
 const [orders,setOrders]=useState([]),[message,setMessage]=useState("Loading your orders...");
 async function load(){try{const data=await fetchOrders();setOrders(data);setMessage(data.length?"":"No orders yet.");}catch(e){setMessage(e.response?.status===401?"Sign in as your customer account to see orders.":"Could not load orders.");}}
 useEffect(()=>{load();},[]);
 return <div className="min-h-screen bg-[#fffaf3] p-4 text-slate-900 dark:bg-slate-950 dark:text-white"><div className="mx-auto max-w-5xl">
  <div className="flex items-center justify-between"><Link to="/" className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold dark:bg-slate-900"><FiArrowLeft/> Market</Link><div className="text-right"><div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">My TUKO Orders</div><button onClick={load} className="text-xs font-bold text-orange-500">Refresh tracking</button></div></div>
  {message&&<div className="mt-8 rounded-3xl bg-white p-6 text-slate-500 dark:bg-slate-900">{message}</div>}
  <div className="mt-8 space-y-6">{orders.map(o=>{const current=stages.indexOf(o.status);return <article key={o.id} className="overflow-hidden rounded-[2rem] bg-white shadow-sm dark:bg-slate-900">
   <div className="flex flex-wrap items-center justify-between gap-3 border-b p-6 dark:border-slate-800"><div><p className="text-xs font-black uppercase text-orange-500">Order #{o.id}</p><h2 className="text-2xl font-black">{labels[o.status]||o.status}</h2><p className="text-sm text-slate-500">{o.fulfilment==="delivery"?o.delivery_address:"Pickup order"}</p></div><div className="text-right"><p className="text-xs text-slate-500">Total</p><b className="text-xl">KSh {Number(o.total).toLocaleString()}</b></div></div>
   <div className="p-6"><div className="grid gap-2 sm:grid-cols-6">{stages.map((s,i)=><div key={s} className={"rounded-2xl p-3 text-xs font-bold "+(i<=current?"bg-emerald-600 text-white":"bg-slate-100 text-slate-400 dark:bg-slate-800")}><FiCheckCircle className="mb-2"/>{labels[s]}</div>)}</div>
   {o.delivery&&<div className="mt-6 grid gap-4 md:grid-cols-2"><div className="rounded-3xl bg-orange-50 p-5 dark:bg-orange-500/10"><FiTruck className="text-2xl text-orange-500"/><p className="mt-2 text-xs font-bold uppercase text-slate-500">Rider</p><b>{o.delivery.rider_username||"Waiting for a rider to accept"}</b><p className="mt-1 text-sm text-slate-500">Delivery status: {o.delivery.status.replaceAll("_"," ")}</p></div><div className="rounded-3xl bg-emerald-50 p-5 dark:bg-emerald-500/10"><FiPackage className="text-2xl text-emerald-600"/><p className="mt-2 text-xs font-bold uppercase text-slate-500">Delivery PIN</p><div className="text-4xl font-black tracking-[0.35em]">{o.delivery.delivery_pin}</div><p className="mt-2 text-sm text-slate-500">Give this PIN to the rider only after you receive your order.</p></div></div>}
   </div></article>})}</div>
 </div></div>
}
