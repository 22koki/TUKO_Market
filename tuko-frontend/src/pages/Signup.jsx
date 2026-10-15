import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, registerCustomer } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", phone_number: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await registerCustomer(form);
      await login(form.username, form.password);
      navigate("/");
    } catch (e) {
      const details = e.response?.data;
      setError(details ? Object.entries(details).map(([key,value]) => key + ": " + (Array.isArray(value) ? value.join(" ") : value)).join("; ") : "Registration failed. Try again.");
    } finally { setBusy(false); }
  }
  return <main className="min-h-screen bg-[#fffaf3] p-5 text-slate-900 dark:bg-slate-950 dark:text-white">
    <div className="mx-auto max-w-md pt-12">
      <Link to="/" className="font-bold text-emerald-700 dark:text-emerald-400">← TUKO Market</Link>
      <form onSubmit={submit} className="mt-5 rounded-[2rem] bg-white p-7 shadow-xl dark:bg-slate-900">
        <div className="text-sm font-black uppercase tracking-widest text-orange-500">Join the market</div>
        <h1 className="mt-2 text-3xl font-black">Create your customer account</h1>
        <p className="mt-2 text-sm text-slate-500">Shop local groceries and track each delivery.</p>
        {error && <div role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {[
          ["username", "Username", "text"],
          ["email", "Email address", "email"],
          ["phone_number", "Phone number", "tel"],
          ["password", "Password (8+ characters)", "password"]
        ].map(([key,label,type]) => <label key={key} className="mt-4 block text-sm font-bold">
          {label}
          <input required type={type} value={form[key]}
            onChange={e => setForm(old => ({ ...old, [key]: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
        </label>)}
        <button disabled={busy} className="mt-6 w-full rounded-xl bg-emerald-600 p-4 font-black text-white disabled:opacity-50">
          {busy ? "Creating account…" : "Create account"}
        </button>
        <p className="mt-4 text-center text-sm text-slate-500">Already registered? Sign in during checkout.</p>
      </form>
    </div>
  </main>;
}
