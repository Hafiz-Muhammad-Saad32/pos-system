import type { User } from "@/types";
import { request } from "./apiClient";

export const authService = {
  login(email: string, password: string): Promise<{ user: User; token: string }> {
    return request<{ user: User; token: string }>({
      method: "POST",
      url: "/auth/login",
      data: {
        email,
        password,
      },
    });
  },

  logout(): Promise<void> {
    return Promise.resolve();
  },
};
