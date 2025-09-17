import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "customer" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(form);
      // If vendor, go to vendor onboarding
      if (form.role === "vendor") navigate("/onboard-vendor", { state: { email: form.email } });
      else navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required placeholder="Full name" value={form.name} onChange={e => setForm({...form, name:e.target.value})}/>
        <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})}/>
        <input placeholder="Phone (optional)" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})}/>
        <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password:e.target.value})}/>
        <label>
          <input type="radio" name="role" checked={form.role==="customer"} onChange={()=>setForm({...form, role:"customer"})}/> Customer
        </label>
        <label>
          <input type="radio" name="role" checked={form.role==="vendor"} onChange={()=>setForm({...form, role:"vendor"})}/> Vendor
        </label>
        <button type="submit" disabled={loading}>{loading ? "Registering..." : "Sign up"}</button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
}
