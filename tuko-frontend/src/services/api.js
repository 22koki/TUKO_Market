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
export async function initiateMpesa(orderId, phoneNumber) {
  const token = localStorage.getItem("tuko-access");
  const { data } = await api.post("/api/payments/mpesa/initiate/", {
    order_id: orderId,
    phone_number: phoneNumber,
  }, { headers: { Authorization: `Bearer ${token}` } });
  return data;
}

export async function getPayment(orderId) {
  const token = localStorage.getItem("tuko-access");
  const { data } = await api.get(`/api/payments/orders/${orderId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function fetchMe() {
  const token = localStorage.getItem("tuko-access");
  const { data } = await api.get("/api/auth/me/", { headers: { Authorization: `Bearer ${token}` } });
  return data;
}
export async function fetchVendorOrders() {
  const token = localStorage.getItem("tuko-access");
  const { data } = await api.get("/api/orders/vendor/", { headers: { Authorization: `Bearer ${token}` } });
  return data;
}
export async function updateVendorOrderStatus(orderId, status) {
  const token = localStorage.getItem("tuko-access");
  const { data } = await api.patch(`/api/orders/vendor/${orderId}/status/`, { status }, { headers: { Authorization: `Bearer ${token}` } });
  return data;
}
export async function fetchAvailableDeliveries() {
 const token=localStorage.getItem("tuko-access");
 const {data}=await api.get("/api/deliveries/available/",{headers:{Authorization:`Bearer ${token}`}});
 return data;
}
export async function fetchMyDeliveries() {
 const token=localStorage.getItem("tuko-access");
 const {data}=await api.get("/api/deliveries/mine/",{headers:{Authorization:`Bearer ${token}`}});
 return data;
}
export async function acceptDelivery(id) {
 const token=localStorage.getItem("tuko-access");
 const {data}=await api.post(`/api/deliveries/${id}/accept/`,{}, {headers:{Authorization:`Bearer ${token}`}});
 return data;
}
export async function updateDelivery(id, action, pin="") {
 const token=localStorage.getItem("tuko-access");
 const {data}=await api.post(`/api/deliveries/${id}/update/`,{action,pin},{headers:{Authorization:`Bearer ${token}`}});
 return data;
}
export async function fetchOrders() {
 const token=localStorage.getItem("tuko-access");
 const {data}=await api.get("/api/orders/",{headers:{Authorization:`Bearer ${token}`}});
 return data;
}
export async function fetchOrder(id) {
 const token=localStorage.getItem("tuko-access");
 const {data}=await api.get(`/api/orders/${id}/`,{headers:{Authorization:`Bearer ${token}`}});
 return data;
}
export default api;
