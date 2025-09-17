import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (e) {
      setErr(e.response?.data?.detail || "Failed to login");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} required placeholder="Email"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Password" type="password"/>
        <button type="submit">Login</button>
        {err && <p className="text-red-600">{err}</p>}
      </form>
    </div>
  );
}
