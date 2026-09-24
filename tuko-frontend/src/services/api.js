import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000",
  timeout: 10000,
});

const accessKey = (role) => `tuko-${role}-access`;
const refreshKey = (role) => `tuko-${role}-refresh`;

function tokenFor(role) {
  return localStorage.getItem(accessKey(role));
}

function authHeaders(role) {
  const token = tokenFor(role);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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

export async function loginAs(role, username, password) {
  const { data } = await api.post("/api/auth/token/", { username, password });
  localStorage.setItem(accessKey(role), data.access);
  localStorage.setItem(refreshKey(role), data.refresh);
  return data;
}

export async function login(username, password) {
  return loginAs("customer", username, password);
}

export function logout(role = "customer") {
  localStorage.removeItem(accessKey(role));
  localStorage.removeItem(refreshKey(role));
}

export async function fetchMe(role = "customer") {
  const { data } = await api.get("/api/auth/me/", { headers: authHeaders(role) });
  return data;
}

export async function ensureRole(role) {
  if (!tokenFor(role)) return false;
  try {
    const me = await fetchMe(role);
    return me.role === role;
  } catch {
    logout(role);
    return false;
  }
}

export async function createOrder(payload) {
  const { data } = await api.post("/api/orders/", payload, { headers: authHeaders("customer") });
  return data;
}

export async function initiateMpesa(orderId, phoneNumber) {
  const { data } = await api.post("/api/payments/mpesa/initiate/", {
    order_id: orderId,
    phone_number: phoneNumber,
  }, { headers: authHeaders("customer") });
  return data;
}

export async function getPayment(orderId) {
  const { data } = await api.get(`/api/payments/orders/${orderId}/`, {
    headers: authHeaders("customer"),
  });
  return data;
}

export async function fetchOrders() {
  const { data } = await api.get("/api/orders/", { headers: authHeaders("customer") });
  return data;
}

export async function fetchOrder(id) {
  const { data } = await api.get(`/api/orders/${id}/`, { headers: authHeaders("customer") });
  return data;
}

export async function fetchVendorOrders() {
  const { data } = await api.get("/api/orders/vendor/", { headers: authHeaders("vendor") });
  return data;
}

export async function updateVendorOrderStatus(orderId, status) {
  const { data } = await api.patch(
    `/api/orders/vendor/${orderId}/status/`,
    { status },
    { headers: authHeaders("vendor") }
  );
  return data;
}

export async function fetchAvailableDeliveries() {
  const { data } = await api.get("/api/deliveries/available/", { headers: authHeaders("rider") });
  return data;
}

export async function fetchMyDeliveries() {
  const { data } = await api.get("/api/deliveries/mine/", { headers: authHeaders("rider") });
  return data;
}

export async function acceptDelivery(id) {
  const { data } = await api.post(
    `/api/deliveries/${id}/accept/`,
    {},
    { headers: authHeaders("rider") }
  );
  return data;
}

export async function updateDelivery(id, action, pin = "") {
  const { data } = await api.post(
    `/api/deliveries/${id}/update/`,
    { action, pin },
    { headers: authHeaders("rider") }
  );
  return data;
}

export default api;
