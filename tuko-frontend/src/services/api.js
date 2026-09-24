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

export default api;
