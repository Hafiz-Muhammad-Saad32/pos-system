import axios, { AxiosHeaders } from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const STORAGE_KEY = "meridian.pos.session";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

function readToken() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: string };
    return typeof parsed.token === "string" && parsed.token.length > 0 ? parsed.token : null;
  } catch {
    return null;
  }
}

function attachAuthorizationHeader(config: InternalAxiosRequestConfig) {
  const token = readToken();
  if (!token) return config;

  config.headers = AxiosHeaders.from(config.headers);
  config.headers.set("Authorization", `Bearer ${token}`);

  return config;
}

function extractErrorMessage(data: unknown) {
  if (!data) return null;
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (typeof record["message"] === "string" && record["message"]) return record["message"];
    if (typeof record["error"] === "string" && record["error"]) return record["error"];
  }
  return null;
}

apiClient.interceptors.request.use(attachAuthorizationHeader);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message =
        extractErrorMessage(error.response?.data) ?? error.message ?? "Request failed.";
      return Promise.reject(new ApiError(message, status));
    }

    if (error instanceof Error) {
      return Promise.reject(new ApiError(error.message, 500));
    }

    return Promise.reject(new ApiError("Unexpected error", 500));
  },
);

export async function request<T>(config: AxiosRequestConfig) {
  const response = await apiClient.request<T>(config);
  return response.data;
}
