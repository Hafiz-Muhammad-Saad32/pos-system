import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/store/auth";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function Index() {
  usePageMeta({
    title: "Meridian POS — Restaurant Operations Console",
    description:
      "Sign in to Meridian POS to manage live orders, menu availability and customers.",
  });

  const { ready, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    navigate(user ? "/dashboard" : "/login", { replace: true });
  }, [ready, user, navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  );
}
