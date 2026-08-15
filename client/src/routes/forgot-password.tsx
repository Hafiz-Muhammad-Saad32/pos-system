import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MailCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Meridian" },
      {
        name: "description",
        content: "Request a password reset link for your Meridian account.",
      },
      { property: "og:title", content: "Reset your password — Meridian" },
      { property: "og:description", content: "Request a reset link for your account." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Enter a valid email address");
      return;
    }
    setPending(true);
    try {
      const result = await forgotPassword(email);
      setSent(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-soft"
      >
        <Logo size="sm" />
        {sent ? (
          <div className="mt-8">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-primary">
              <MailCheck className="h-5 w-5" />
            </span>
            <h1 className="display-lg mt-6 text-foreground">Check your inbox</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{sent}</p>
            <Button asChild className="mt-8 h-11 w-full rounded-full">
              <Link to="/login">Back to log in</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="display-lg mt-8 text-foreground">Reset your password</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Enter the email on your account and we'll send a reset link.
            </p>
            <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
              <div>
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  maxLength={255}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 h-11"
                />
              </div>
              <Button type="submit" className="h-11 w-full rounded-full" disabled={pending}>
                {pending ? "Sending…" : "Send reset link"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Remembered it?{" "}
              <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                Log in
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
