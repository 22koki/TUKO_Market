import { FiMapPin, FiMoon, FiSearch, FiShoppingCart, FiSun } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ search, setSearch }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <div className="min-w-fit">
          <div className="text-2xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">TUKO</div>
          <div className="-mt-1 text-xs font-semibold text-slate-500">Market</div>
        </div>

        <button className="hidden items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-sm font-medium text-slate-700 md:flex dark:bg-amber-400/10 dark:text-slate-200">
          <FiMapPin className="text-orange-500" />
          Nairobi
        </button>

        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tomatoes, milk, meat, cereals..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <button onClick={toggleTheme} className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-amber-300">
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>

        <button className="relative grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 text-white">
          <FiShoppingCart />
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-bold">0</span>
        </button>
      </div>
    </header>
  );
}
