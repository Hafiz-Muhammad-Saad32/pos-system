import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import type { ReactNode } from "react";

import { ListSkeleton } from "@/components/common/LoadingSkeleton";
import { useAuth } from "@/context/AuthContext";

/**
 * Client-side auth gate for customer routes. Keeps the attempted path so the
 * login screen can send the guest straight back after signing in.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useRouterState({ select: (state) => state.location });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({
        to: "/login",
        search: { redirect: location.pathname },
        replace: true,
      });
    }
  }, [isLoading, isAuthenticated, navigate, location.pathname]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="container-page py-16">
        <ListSkeleton rows={3} />
      </div>
    );
  }

  return <>{children}</>;
}
