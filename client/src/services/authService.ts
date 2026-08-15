import api from "@/lib/api";
import type { AuthCredentials, RegisterInput, User } from "@/types";
import { removeStorage, STORAGE_KEYS, writeStorage } from "@/utils/storage.ts";

/**
 * Auth service — all calls go to the real backend.
 * Access token lives in an httpOnly cookie set by the backend on
 * login/register/refresh — this file never reads or stores it.
 * Only the (non-sensitive) user object is cached, to avoid a UI flicker.
 *
 * POST /api/auth/login
 * POST /api/auth/register
 * POST /api/auth/forgot-password
 * GET  /api/auth/me
 * POST /api/auth/logout
 */

export async function login({ email, password }: AuthCredentials): Promise<User> {
  const { data } = await api.post<{ user: User }>("/auth/login", {
    email,
    password,
  });
  writeStorage(STORAGE_KEYS.auth, data.user);
  return data.user;
}

export async function register(input: RegisterInput): Promise<User> {
  const { data } = await api.post<{ user: User }>("/auth/register", input);
  writeStorage(STORAGE_KEYS.auth, data.user);
  return data.user;
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/auth/reset-password", {
    token,
    password,
  });
  return data;
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/auth/verify-email", { token });
  return data;
}

export async function getCurrentUser(): Promise<User | null> {
  // No token to check client-side anymore — the httpOnly cookie is sent
  // automatically. We just ask the backend and trust its answer.
  try {
    const { data } = await api.get<{ user: User }>("/auth/me");
    writeStorage(STORAGE_KEYS.auth, data.user);
    return data.user;
  } catch {
    // No valid session — clear any stale cached user
    removeStorage(STORAGE_KEYS.auth);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } finally {
    removeStorage(STORAGE_KEYS.auth);
  }
}

export function persistUser(user: User) {
  writeStorage(STORAGE_KEYS.auth, user);
}