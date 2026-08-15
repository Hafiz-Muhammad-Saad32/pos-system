import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  name: z.string().trim().min(2, { message: "Enter your full name" }).max(100),
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  phone: z.string().trim().min(7, { message: "Enter a contact number" }).max(24),
  password: z.string().min(8, { message: "Use at least 8 characters" }).max(72),
});

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create an account — Meridian" },
      {
        name: "description",
        content: "Create a Meridian account to order faster, save favourites and track deliveries.",
      },
      { property: "og:title", content: "Create an account — Meridian" },
      { property: "og:description", content: "Order faster and track every delivery." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", phone: "", password: "" });
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
      await register(parsed.data);
      navigate({ to: "/menu", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create your account");
    } finally {
      setPending(false);
    }
  }

  const fields = [
    { id: "name", label: "Full name", type: "text", autoComplete: "name" },
    { id: "email", label: "Email", type: "email", autoComplete: "email" },
    { id: "phone", label: "Phone number", type: "tel", autoComplete: "tel" },
    { id: "password", label: "Password", type: "password", autoComplete: "new-password" },
  ] as const;

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-soft"
      >
        <Logo size="sm" />
        <h1 className="display-lg mt-8 text-foreground">Join the table</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          One account for ordering, favourites and live delivery tracking.
        </p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
          {fields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.type}
                autoComplete={field.autoComplete}
                maxLength={255}
                value={values[field.id]}
                onChange={(event) =>
                  setValues({ ...values, [field.id]: event.target.value })
                }
                className="mt-2 h-11"
              />
              {errors[field.id] ? (
                <p className="mt-2 text-xs text-destructive">{errors[field.id]}</p>
              ) : null}
            </div>
          ))}
          <Button type="submit" className="h-11 w-full rounded-full" disabled={pending}>
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
