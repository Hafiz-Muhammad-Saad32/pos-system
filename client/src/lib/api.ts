import axios, { type InternalAxiosRequestConfig } from "axios";
import { removeStorage, STORAGE_KEYS } from "@/utils/storage";

const api = axios.create({
  baseURL: import.meta.env["VITE_API_URL"] ?? "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

function flushQueue(error: unknown) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  pendingQueue = [];
}

function logoutAndRedirect() {
  removeStorage(STORAGE_KEYS.auth);
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    // No request config (e.g. network error) — nothing we can retry
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? "";
    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh");

    // Login/register/refresh failing with 401 is a real auth failure —
    // don't try to "refresh" our way out of it.
    if (isAuthEndpoint || originalRequest._retry) {
      if (isAuthEndpoint && url.includes("/auth/refresh")) {
        logoutAndRedirect();
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // A refresh is already in flight — wait for it, then retry
      return new Promise<void>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post("/auth/refresh");
      flushQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError);
      logoutAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
