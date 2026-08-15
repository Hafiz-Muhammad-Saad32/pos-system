import { Outlet, createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const Route = createFileRoute("/_authenticated")({
  component: () => (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  ),
});
