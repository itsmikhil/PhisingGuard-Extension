/**
 * Centralized API client for PhishingGuard.
 * Attaches the JWT token from localStorage to every request.
 * On 401, clears auth state and redirects to /login.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const getToken = () => localStorage.getItem("pg_token");

const apiFetch = async (path, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid — clear storage and redirect
    localStorage.removeItem("pg_token");
    localStorage.removeItem("pg_user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data;
};

// ─────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: () => apiFetch("/auth/me"),
};

// ─────────────────────────────────────────────
// User
// ─────────────────────────────────────────────
export const userApi = {
  getProfile: () => apiFetch("/user/profile"),

  updateProfile: (name) =>
    apiFetch("/user/profile", {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),

  getStats: () => apiFetch("/user/stats"),

  getHistory: (page = 1, limit = 10) =>
    apiFetch(`/user/history?page=${page}&limit=${limit}`),

  createReport: (url, reason) =>
    apiFetch("/user/report", {
      method: "POST",
      body: JSON.stringify({ url, reason }),
    }),
};

// ─────────────────────────────────────────────
// Scan
// ─────────────────────────────────────────────
export const scanApi = {
  scan: (url) =>
    apiFetch("/scan", {
      method: "POST",
      body: JSON.stringify({ url }),
    }),
};

// ─────────────────────────────────────────────
// Admin
// ─────────────────────────────────────────────
export const adminApi = {
  getDashboard: () => apiFetch("/admin/dashboard"),

  getBlacklist: () => apiFetch("/admin/blacklist"),

  createBlacklistEntry: (domain, reason, source) =>
    apiFetch("/admin/blacklist", {
      method: "POST",
      body: JSON.stringify({ domain, reason, source }),
    }),

  updateBlacklistEntry: (id, updates) =>
    apiFetch(`/admin/blacklist/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  deleteBlacklistEntry: (id) =>
    apiFetch(`/admin/blacklist/${id}`, { method: "DELETE" }),

  getReports: (status) =>
    apiFetch(`/admin/reports${status ? `?status=${status}` : ""}`),

  updateReport: (id, status, adminRemark) =>
    apiFetch(`/admin/reports/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status, adminRemark }),
    }),
};

export default apiFetch;
