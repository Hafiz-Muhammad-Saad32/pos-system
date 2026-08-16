import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageMeta } from "@/components/common/PageMeta";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

const schema = z
  .object({
    password: z.string().min(8, { message: "Use at least 8 characters" }).max(72),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [values, setValues] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!token) {
      toast.error("This reset link is invalid or has expired.");
      return;
    }

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        next[String(issue.path[0])] = issue.message;
      });
      setErrors(next);
      return;
    }

    setErrors({});
    setPending(true);
    try {
      await resetPassword(token, values.password);
      setDone(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-16">
      <PageMeta title="Reset your password — Meridian" />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-soft"
      >
        <Logo size="sm" />

        {done ? (
          <div className="mt-8">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <h1 className="display-lg mt-6 text-foreground">Password updated</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Your password has been changed. You can log in now.
            </p>
            <Button asChild className="mt-8 h-11 w-full rounded-full">
              <Link to="/login">Back to log in</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="display-lg mt-8 text-foreground">Set a new password</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Choose a new password for your Meridian account.
            </p>
            <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
              <div>
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  maxLength={72}
                  value={values.password}
                  onChange={(event) => setValues({ ...values, password: event.target.value })}
                  className="mt-2 h-11"
                />
                {errors["password"] ? (
                  <p className="mt-2 text-xs text-destructive">{errors["password"]}</p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  maxLength={72}
                  value={values.confirmPassword}
                  onChange={(event) =>
                    setValues({ ...values, confirmPassword: event.target.value })
                  }
                  className="mt-2 h-11"
                />
                {errors["confirmPassword"] ? (
                  <p className="mt-2 text-xs text-destructive">{errors["confirmPassword"]}</p>
                ) : null}
              </div>
              <Button type="submit" className="h-11 w-full rounded-full" disabled={pending}>
                {pending ? "Updating…" : "Update password"}
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
