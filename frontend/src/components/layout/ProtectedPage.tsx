import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/store/auth";
import { DashboardLayout } from "./DashboardLayout";
import { Forbidden } from "@/components/common/Forbidden";
import type { Role } from "@/types";

/**
 * Client-side role protection. Mock auth lives in localStorage, so the gate
 * waits for hydration (`ready`) before deciding anything.
 */
export function ProtectedPage({
  roles = ["admin", "cashier"],
  children,
}: {
  roles?: Role[];
  children: ReactNode;
}) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login", replace: true });
  }, [ready, user, navigate]);

  if (!ready || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!roles.includes(user.role)) {
    return (
      <DashboardLayout>
        <Forbidden />
      </DashboardLayout>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
