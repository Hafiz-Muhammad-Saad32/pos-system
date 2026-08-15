import api from "@/lib/api";
import { writeStorage, STORAGE_KEYS } from "@/utils/storage";
import type { Address, User } from "@/types";

/**
 * Customer service — all calls go to the real backend.
 * PATCH /api/customers/me
 * PATCH /api/customers/me/password
 */

export async function updateProfile(
  patch: Partial<Pick<User, "name" | "email" | "phone">> & { address?: Address },
): Promise<User> {
  const { data } = await api.patch<{ user: User }>("/customers/me", patch);
  writeStorage(STORAGE_KEYS.auth, data.user);
  return data.user;
}

export async function changePassword(
  currentPassword: string,
  nextPassword: string,
): Promise<{ message: string }> {
  const { data } = await api.patch<{ message: string }>("/customers/me/password", {
    currentPassword,
    nextPassword,
  });
  return data;
}
