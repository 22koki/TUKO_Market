import { useEffect, useState } from "react";
import { createVendorProduct, fetchCategories, fetchMyVendorStore, fetchVendorInventory, updateVendorProduct } from "../services/api";

const initial = { name: "", description: "", category: "", unit: "item", price: "", stock_quantity: "", image_url: "" };

export default function VendorCatalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [store, setStore] = useState(null);
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function load() {
    try {
      const [p,c,st] = await Promise.all([fetchVendorInventory(), fetchCategories(), fetchMyVendorStore()]);
      setProducts(p);
      setCategories(c);
      setStore(st);
    } catch (e) {
      setError(e.response?.data?.detail || "Could not load your shop inventory.");
    }
  }
  useEffect(() => { load(); }, []);
  async function add(event) {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    try {
      await createVendorProduct({ ...draft, category: Number(draft.category) });
      setDraft(initial);
      setNotice("Product added to your store.");
      await load();
    } catch(e) {
      setError(JSON.stringify(e.response?.data || { detail: "Could not save product." }));
    } finally { setSaving(false); }
  }
  async function patch(product, change) {
    setSaving(true); setError(""); setNotice("");
    try {
      await updateVendorProduct(product.id, change);
      await load();
      setNotice(product.name + " updated.");
    } catch(e) {
      setError(JSON.stringify(e.response?.data || { detail: "Update failed." }));
    } finally { setSaving(false); }
  }
  return <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
    <form onSubmit={add} className="h-fit rounded-[2rem] bg-white p-6 shadow-sm dark:bg-slate-900">
      <p className="text-sm font-bold text-orange-500">Your products</p>
      <h2 className="mt-1 text-2xl font-black">Add inventory</h2>
      {store && <p className="mt-2 text-sm text-slate-500">{store.name} · {store.is_verified ? "Verified store" : "Awaiting verification"}</p>}
      {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      <div className="mt-4 grid gap-3">
        <input required aria-label="Product name" placeholder="Product name" value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})} className="rounded-xl border p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
        <input aria-label="Description" placeholder="Description" value={draft.description} onChange={e=>setDraft({...draft,description:e.target.value})} className="rounded-xl border p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
        <select aria-label="Category" required value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value})} className="rounded-xl border p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
          <option value="">Choose category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select aria-label="Unit" value={draft.unit} onChange={e=>setDraft({...draft,unit:e.target.value})} className="rounded-xl border p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
          {["item","kg","g","l","pack","bunch","tray"].map(u=><option key={u} value={u}>{u}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input required min="0.01" step="0.01" type="number" aria-label="Price in KSh" placeholder="Price in KSh" value={draft.price} onChange={e=>setDraft({...draft,price:e.target.value})} className="min-w-0 rounded-xl border p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          <input required min="0" step="0.01" type="number" aria-label="Stock quantity" placeholder="Stock quantity" value={draft.stock_quantity} onChange={e=>setDraft({...draft,stock_quantity:e.target.value})} className="min-w-0 rounded-xl border p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
        </div>
        <input type="url" aria-label="Product image URL" placeholder="Product image URL (optional)" value={draft.image_url} onChange={e=>setDraft({...draft,image_url:e.target.value})} className="rounded-xl border p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
        <button disabled={saving} className="rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white disabled:opacity-50">Add product</button>
      </div>
    </form>
    <div className="rounded-[2rem] bg-white p-6 shadow-sm dark:bg-slate-900">
      <div className="flex items-center justify-between"><h2 className="text-2xl font-black">Stock manager</h2><button onClick={load} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-800 dark:bg-slate-800 dark:text-white">Refresh</button></div>
      <div className="mt-5 space-y-3">{!products.length && <p className="text-slate-500">No products yet. Add your first item.</p>}
        {products.map(p=><div key={p.id} className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
          <div className="flex flex-wrap items-start justify-between gap-2"><div><b>{p.name}</b><p className="text-xs text-slate-500">{p.category_name} · per {p.unit}</p></div>
            <button disabled={saving} onClick={()=>patch(p,{is_active:!p.is_active})} className={"rounded-full px-3 py-1 text-xs font-bold " + (p.is_active?"bg-emerald-100 text-emerald-800":"bg-slate-200 text-slate-700")}>{p.is_active?"Active · Pause":"Paused · Activate"}</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <label className="text-xs font-bold">Price (KSh)<input type="number" min="0.01" step="0.01" defaultValue={p.price} key={p.id+"price"+p.price} onBlur={e=>{if (e.target.value && Number(e.target.value)>0 && Number(e.target.value)!==Number(p.price)) patch(p,{price:e.target.value});}} className="mt-1 block w-32 rounded-xl border p-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></label>
            <label className="text-xs font-bold">Quantity<input type="number" min="0" step="0.01" defaultValue={p.stock_quantity} key={p.id+"stock"+p.stock_quantity} onBlur={e=>{if (e.target.value && Number(e.target.value)>=0 && Number(e.target.value)!==Number(p.stock_quantity)) patch(p,{stock_quantity:e.target.value});}} className="mt-1 block w-32 rounded-xl border p-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></label>
          </div>
        </div>)}
      </div>
    </div>
  </section>;
}
