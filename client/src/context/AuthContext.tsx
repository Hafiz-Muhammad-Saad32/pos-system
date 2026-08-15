import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import * as authService from "@/services/authService";
import type { AuthCredentials, RegisterInput, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  /** True until the persisted session has been restored on the client. */
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (token: string, password: string) => Promise<{ message: string }>;
  verifyEmail: (token: string) => Promise<{ message: string }>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    authService
      .getCurrentUser()
      .then((current) => {
        if (active) setUserState(current);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials: AuthCredentials) => {
    const next = await authService.login(credentials);
    setUserState(next);
    toast.success(`Welcome back, ${next.name.split(" ")[0]}`);
    return next;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const next = await authService.register(input);
    setUserState(next);
    toast.success("Your Meridian account is ready");
    return next;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUserState(null);
    toast.success("Signed out");
  }, []);

  const setUser = useCallback((next: User) => {
    setUserState(next);
    authService.persistUser(next);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      forgotPassword: authService.forgotPassword,
      resetPassword: authService.resetPassword,
      verifyEmail: authService.verifyEmail,
      logout,
      setUser,
    }),
    [user, isLoading, login, register, logout, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
