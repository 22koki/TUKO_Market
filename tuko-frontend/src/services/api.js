import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000",
  timeout: 10000,
});

export async function fetchProducts(params = {}) {
  const { data } = await api.get("/api/marketplace/products/", { params });
  return data;
}

export async function fetchCategories() {
  const { data } = await api.get("/api/marketplace/categories/");
  return data;
}

export async function fetchVendors() {
  const { data } = await api.get("/api/vendors/");
  return data;
}

export async function login(username, password) {
  const { data } = await api.post("/api/auth/token/", { username, password });
  localStorage.setItem("tuko-access", data.access);
  localStorage.setItem("tuko-refresh", data.refresh);
  return data;
}
export function logout() {
  localStorage.removeItem("tuko-access");
  localStorage.removeItem("tuko-refresh");
}
export async function createOrder(payload) {
  const token = localStorage.getItem("tuko-access");
  const { data } = await api.post("/api/orders/", payload, { headers: { Authorization: `Bearer ${token}` } });
  return data;
}
export default api;
