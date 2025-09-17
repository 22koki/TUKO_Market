import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function OnboardVendor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    business_name: "",
    categories: "",
    address: "",
    lat: null,
    lon: null,
    allow_phone_public: false,
    supports_delivery: true,
    supports_pickup: true
  });
  const [loading, setLoading] = useState(false);

  const useGPS = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(pos => {
      setForm({...form, lat: pos.coords.latitude, lon: pos.coords.longitude});
    }, err => {
      alert("Could not get location: " + err.message);
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/auth/me/vendor-profile", form);
      alert("Vendor profile saved");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl mb-4">Vendor Onboarding</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required placeholder="Business name" value={form.business_name} onChange={e=>setForm({...form, business_name:e.target.value})}/>
        <input placeholder="Categories (comma separated, e.g., groceries,fruits)" value={form.categories} onChange={e=>setForm({...form, categories:e.target.value})}/>
        <input placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})}/>
        <div>
          <button type="button" onClick={useGPS}>Use my GPS location</button>
          <div>Lat: {form.lat} Lon: {form.lon}</div>
        </div>
        <label><input type="checkbox" checked={form.allow_phone_public} onChange={e=>setForm({...form, allow_phone_public:e.target.checked})}/> Show phone to customers</label>
        <label><input type="checkbox" checked={form.supports_delivery} onChange={e=>setForm({...form, supports_delivery:e.target.checked})}/> Delivery</label>
        <label><input type="checkbox" checked={form.supports_pickup} onChange={e=>setForm({...form, supports_pickup:e.target.checked})}/> Pickup</label>
        <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save vendor profile"}</button>
      </form>
    </div>
  );
}
