import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search["token"] === "string" ? (search["token"] as string) : "",
  }),
  head: () => ({
    meta: [{ title: "Verify your email — Meridian" }],
  }),
  component: VerifyEmailPage,
});

type Status = "verifying" | "success" | "error";

function VerifyEmailPage() {
  const { verifyEmail } = useAuth();
  const { token } = Route.useSearch();
  const [status, setStatus] = useState<Status>("verifying");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token, verifyEmail]);

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-soft"
      >
        <Logo size="sm" />

        {status === "verifying" ? (
          <p className="mt-8 text-sm text-muted-foreground">Verifying your email…</p>
        ) : null}

        {status === "success" ? (
          <div className="mt-8">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <h1 className="display-lg mt-6 text-foreground">Email verified</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your account is confirmed. You can log in now.
            </p>
            <Button asChild className="mt-8 h-11 w-full rounded-full">
              <Link to="/login">Go to log in</Link>
            </Button>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="mt-8">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
              <XCircle className="h-5 w-5" />
            </span>
            <h1 className="display-lg mt-6 text-foreground">Link invalid or expired</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Try signing up again or request a new verification email.
            </p>
            <Button asChild variant="outline" className="mt-8 h-11 w-full rounded-full">
              <Link to="/login">Back to log in</Link>
            </Button>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}