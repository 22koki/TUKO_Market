import { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiMapPin, FiPlus, FiStar, FiTruck } from "react-icons/fi";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import { useCart } from "../context/CartContext";
import { fetchCategories, fetchProducts, fetchVendors } from "../services/api";

const fallbackProducts = [
  { id: 1, name: "Tomatoes", unit: "kg", price: "120.00", stock_quantity: "20", image_url: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=80", vendor_name: "Mama Njeri Groceries", category_name: "Vegetables" },
  { id: 2, name: "Potatoes", unit: "kg", price: "90.00", stock_quantity: "50", image_url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=80", vendor_name: "Fresh Basket", category_name: "Vegetables" },
  { id: 3, name: "Avocados", unit: "item", price: "50.00", stock_quantity: "24", image_url: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=80", vendor_name: "Green Corner", category_name: "Fruits" },
  { id: 4, name: "Eggs", unit: "tray", price: "480.00", stock_quantity: "10", image_url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=700&q=80", vendor_name: "Farm Fresh", category_name: "Dairy" },
];

const fallbackCategories = [
  { id: 1, name: "Vegetables", slug: "vegetables" },
  { id: 2, name: "Fruits", slug: "fruits" },
  { id: 3, name: "Meat", slug: "meat" },
  { id: 4, name: "Dairy", slug: "dairy" },
  { id: 5, name: "Cereals", slug: "cereals" },
];

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [catalogOnline, setCatalogOnline] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const { addItem, count } = useCart();

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories(), fetchVendors()])
      .then(([p, c, v]) => {
        setProducts(Array.isArray(p) ? p : []);
        setCategories(Array.isArray(c) ? c : []);
        setVendors(Array.isArray(v) ? v : []);
      })
      .catch(() => {
        setCatalogOnline(false);
        setProducts(fallbackProducts);
        setCategories(fallbackCategories);
        setVendors([]);
      });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = !search || product.name?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !activeCategory || product.category_name?.toLowerCase() === activeCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  return (
    <div className="min-h-screen bg-[#fffaf3] text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <Navbar search={search} setSearch={setSearch} cartCount={count} onCartOpen={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6">
        <section className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-700 via-emerald-600 to-lime-500 p-6 text-white shadow-xl shadow-emerald-900/10 md:p-10">
            <div className="max-w-xl">
              <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">Your local market, minus the hassle</span>
              <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">Fresh groceries from nearby vendors.</h1>
              <p className="mt-4 max-w-lg text-white/85">Shop local produce, compare nearby vendors, choose pickup or delivery, and pay with M-PESA.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-2xl bg-white px-5 py-3 font-bold text-emerald-700">Shop now</button>
                <button className="rounded-2xl bg-black/15 px-5 py-3 font-semibold backdrop-blur">Build a market list</button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[2rem] bg-orange-100 p-6 dark:bg-orange-500/10">
              <FiTruck className="text-3xl text-orange-500" />
              <div className="mt-4 text-xl font-black">Fast local delivery</div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Nearby vendors mean shorter routes and fresher groceries.</p>
            </div>
            <div className="rounded-[2rem] bg-pink-100 p-6 dark:bg-pink-500/10">
              <div className="text-3xl">💬</div>
              <div className="mt-4 text-xl font-black">Order on WhatsApp</div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Soon, send your shopping list and let TUKO source it for you.</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-emerald-600">Browse the market</p>
              <h2 className="text-2xl font-black">What are you shopping for?</h2>
            </div>
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            <button onClick={() => setActiveCategory("")} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${activeCategory === "" ? "bg-emerald-600 text-white" : "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200"}`}>All</button>
            {(categories.length ? categories : fallbackCategories).map((category) => (
              <button key={category.id} onClick={() => setActiveCategory(category.name)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${activeCategory === category.name ? "bg-emerald-600 text-white" : "bg-white text-slate-700 hover:bg-emerald-50 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"}`}>
                {category.name}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Fresh picks near you</p>
              <h2 className="text-2xl font-black">Popular today</h2>
            </div>
            <button className="hidden items-center gap-2 text-sm font-bold text-emerald-600 sm:flex">See all <FiArrowRight /></button>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <article key={product.id} className="group overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:ring-white/10">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={product.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80"} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur dark:bg-slate-900/90 dark:text-white">{product.category_name || "Fresh"}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black">{product.name}</h3>
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500"><FiMapPin /> {product.vendor_name || "Local vendor"}</div>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"><FiStar />4.8</div>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">KSh {Number(product.price).toLocaleString()}</div>
                      <div className="text-xs text-slate-500">per {product.unit}</div>
                    </div>
                    <button disabled={!catalogOnline} title={!catalogOnline ? "Backend catalog unavailable" : "Add to cart"} onClick={() => { if (catalogOnline) { addItem(product); setCartOpen(true); } }} className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 transition hover:scale-105 disabled:cursor-not-allowed disabled:bg-slate-400"><FiPlus /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-[2rem] bg-violet-100 p-6 dark:bg-violet-500/10">
            <div className="text-2xl">🧺</div>
            <h3 className="mt-3 text-lg font-black">One basket, many vendors</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">TUKO will combine nearby vendors into one simple customer checkout.</p>
          </div>
          <div className="rounded-[2rem] bg-cyan-100 p-6 dark:bg-cyan-500/10">
            <div className="text-2xl">📱</div>
            <h3 className="mt-3 text-lg font-black">M-PESA ready</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">A familiar Kenyan checkout experience with settlement handled behind the scenes.</p>
          </div>
          <div className="rounded-[2rem] bg-lime-100 p-6 dark:bg-lime-500/10">
            <div className="text-2xl">🏪</div>
            <h3 className="mt-3 text-lg font-black">Support local markets</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{vendors.length ? `${vendors.length} verified vendors connected` : "Vendor discovery will appear here as shops are verified."}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
