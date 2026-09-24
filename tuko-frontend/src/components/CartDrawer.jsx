import { useState } from "react";
import { FiMinus, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { createOrder, login } from "../services/api";

export default function CartDrawer({ open, onClose }) {
 const {items,updateQuantity,removeItem,clearCart,subtotal}=useCart();
 const [checkout,setCheckout]=useState(false), [fulfilment,setFulfilment]=useState("delivery");
 const [address,setAddress]=useState(""), [username,setUsername]=useState(""), [password,setPassword]=useState("");
 const [message,setMessage]=useState(""), [busy,setBusy]=useState(false);
 const delivery=items.length&&fulfilment==="delivery"?150:0;
 async function placeOrder(){
   setBusy(true); setMessage("");
   try{
     if(!localStorage.getItem("tuko-access")) await login(username,password);
     const order=await createOrder({fulfilment,delivery_address:fulfilment==="delivery"?address:"",items:items.map(i=>({product:i.id,quantity:i.quantity}))});
     clearCart(); setCheckout(false); setMessage(`Order #${order.id} placed successfully — KSh ${Number(order.total).toLocaleString()}`);
   }catch(e){setMessage(e.response?.data?.detail||"Could not place order. Check your login and checkout details.");}
   finally{setBusy(false);}
 }
 return <><button aria-label="Close cart" onClick={onClose} className={open?"fixed inset-0 z-40 bg-black/40 backdrop-blur-sm":"hidden"}/>
 <aside className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform overflow-y-auto bg-[#fffaf3] p-5 pb-64 shadow-2xl transition duration-300 dark:bg-slate-950 dark:text-white ${open?"translate-x-0":"translate-x-full"}`}>
 <div className="flex items-center justify-between"><div><p className="text-sm font-bold text-emerald-600">{checkout?"Checkout":"Your basket"}</p><h2 className="text-2xl font-black">{checkout?"Almost there":"Market cart"}</h2></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white dark:bg-slate-800"><FiX/></button></div>
 {message&&<div className="mt-4 rounded-2xl bg-emerald-100 p-3 text-sm font-bold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">{message}</div>}
 {!checkout&&<div className="mt-6 space-y-3">{!items.length&&<div className="rounded-3xl bg-white p-8 text-center text-slate-500 dark:bg-slate-900">Your basket is empty. Add something fresh 🌿</div>}{items.map(item=><div key={item.id} className="flex gap-3 rounded-3xl bg-white p-3 dark:bg-slate-900"><img src={item.image_url} alt="" className="h-20 w-20 rounded-2xl object-cover"/><div className="flex-1"><div className="font-black">{item.name}</div><div className="text-xs text-slate-500">{item.vendor_name}</div><div className="mt-2 font-black text-emerald-600">KSh {Number(item.price).toLocaleString()}</div></div><div className="flex flex-col items-end justify-between"><button onClick={()=>removeItem(item.id)}><FiTrash2/></button><div className="flex items-center gap-2 rounded-full bg-slate-100 p-1 dark:bg-slate-800"><button onClick={()=>updateQuantity(item.id,item.quantity-1)}><FiMinus/></button><b>{item.quantity}</b><button onClick={()=>updateQuantity(item.id,item.quantity+1)}><FiPlus/></button></div></div></div>)}</div>}
 {checkout&&<div className="mt-6 space-y-4">
   <div className="grid grid-cols-2 gap-3"><button onClick={()=>setFulfilment("delivery")} className={`rounded-2xl p-4 font-bold ${fulfilment==="delivery"?"bg-emerald-600 text-white":"bg-white dark:bg-slate-900"}`}>🛵 Delivery</button><button onClick={()=>setFulfilment("pickup")} className={`rounded-2xl p-4 font-bold ${fulfilment==="pickup"?"bg-emerald-600 text-white":"bg-white dark:bg-slate-900"}`}>🧺 Pickup</button></div>
   {fulfilment==="delivery"&&<input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Delivery address e.g. Kilimani" className="w-full rounded-2xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900"/>}
   {!localStorage.getItem("tuko-access")&&<div className="rounded-3xl bg-orange-50 p-4 dark:bg-orange-500/10"><div className="mb-3 font-black">Sign in to place your order</div><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="mb-2 w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-900"/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border p-3 dark:border-slate-700 dark:bg-slate-900"/></div>}
   <div className="rounded-3xl bg-white p-4 dark:bg-slate-900"><div className="flex justify-between"><span>Items</span><b>KSh {subtotal.toLocaleString()}</b></div><div className="mt-2 flex justify-between"><span>{fulfilment==="delivery"?"Delivery":"Pickup"}</span><b>KSh {delivery}</b></div><div className="mt-4 flex justify-between text-xl font-black"><span>Total</span><span>KSh {(subtotal+delivery).toLocaleString()}</span></div></div>
   <button disabled={busy} onClick={placeOrder} className="w-full rounded-2xl bg-emerald-600 py-4 font-black text-white disabled:opacity-50">{busy?"Placing order...":"Place order"}</button>
   <p className="text-center text-xs text-slate-500">M-PESA payment comes next. This step creates the order securely.</p>
 </div>}
 {!!items.length&&!checkout&&<div className="fixed bottom-0 right-0 w-full max-w-md border-t bg-white p-5 dark:border-white/10 dark:bg-slate-900"><div className="flex justify-between text-xl font-black"><span>Subtotal</span><span>KSh {subtotal.toLocaleString()}</span></div><button onClick={()=>setCheckout(true)} className="mt-4 w-full rounded-2xl bg-emerald-600 py-4 font-black text-white">Continue to checkout</button></div>}
 </aside></>;
}