import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageMeta } from "@/components/common/PageMeta";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export function LoginPage() {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "";
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
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
      await login(parsed.data);
      navigate(redirect || "/", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign you in");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-16">
      <PageMeta
        title="Log in — Meridian"
        description="Sign in to your Meridian account to order, track deliveries and manage favourites."
        ogDescription="Sign in to order and track deliveries."
      />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-soft"
      >
        <Logo size="sm" />
        <h1 className="display-lg mt-8 text-foreground">Welcome back</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign in to order, track deliveries and keep your favourites in one place.
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              maxLength={255}
              value={values.email}
              onChange={(event) => setValues({ ...values, email: event.target.value })}
              className="mt-2 h-11"
            />
            {errors["email"] ? (
              <p className="mt-2 text-xs text-destructive">{errors["email"]}</p>
            ) : null}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={values.password}
              onChange={(event) => setValues({ ...values, password: event.target.value })}
              className="mt-2 h-11"
            />
            {errors["password"] ? (
              <p className="mt-2 text-xs text-destructive">{errors["password"]}</p>
            ) : null}
          </div>
          <Button type="submit" className="h-11 w-full rounded-full" disabled={pending}>
            {pending ? "Signing in…" : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to Meridian?{" "}
          <Link to="/signup" className="text-primary underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
