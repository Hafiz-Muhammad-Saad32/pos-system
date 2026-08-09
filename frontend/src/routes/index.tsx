import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meridian POS — Restaurant Operations Console" },
      {
        name: "description",
        content:
          "Sign in to Meridian POS to manage live orders, menu availability and customers.",
      },
      { property: "og:title", content: "Meridian POS — Restaurant Operations Console" },
      {
        property: "og:description",
        content: "Internal restaurant POS for orders, menu and customer operations.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { ready, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    navigate({ to: user ? "/dashboard" : "/login", replace: true });
  }, [ready, user, navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  );
}
