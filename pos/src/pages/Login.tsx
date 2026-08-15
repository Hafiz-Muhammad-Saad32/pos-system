import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { ChefHat, Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";
import { AmbientCanvas } from "@/components/common/AmbientCanvas";
import { usePageMeta } from "@/hooks/use-page-meta";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  usePageMeta({
    title: "Sign in — Meridian POS",
    description: "Secure staff sign-in for the Meridian restaurant point-of-sale console.",
  });

  const { login, user, ready } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  useEffect(() => {
    if (ready && user) navigate("/dashboard", { replace: true });
  }, [ready, user, navigate]);

  const onSubmit = async (values: FormValues) => {
    try {
      const signedIn = await login(values.email, values.password);
      toast.success(`Welcome back, ${signedIn.name.split(" ")[0]}`);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message = (error as Error).message ?? "Sign in failed";
      setError("password", { message });
      toast.error(message);
    }
  };

  return (
    <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden border-r border-border bg-surface lg:block">
        <AmbientCanvas className="absolute inset-0 size-full" />
        <div className="grid-backdrop absolute inset-0 opacity-70" />
        <div className="absolute -left-24 top-1/3 size-[420px] rounded-full bg-primary/12 blur-[120px]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ChefHat className="size-6" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold">Meridian POS</p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Kitchen Operations
              </p>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-semibold leading-[1.1]">
              Every order, every station, one console.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Counter, phone and WhatsApp tickets land in a single queue. Track preparation,
              availability and revenue without leaving the pass.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6">
              {[
                { k: "Avg. ticket", v: "$32.40" },
                { k: "Prep time", v: "11m" },
                { k: "Uptime", v: "99.9%" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {s.k}
                  </dt>
                  <dd className="numeric mt-1 text-lg font-semibold">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="text-xs text-muted-foreground">© 2026 Meridian Hospitality Systems</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[400px]"
        >
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ChefHat className="size-5" />
            </span>
            <p className="font-display text-base font-semibold">Meridian POS</p>
          </div>

          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Use your staff credentials to open the console.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
            <Field label="Email" error={errors.email?.message} icon={<Mail className="size-4" />}>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="you@restaurant.com"
                aria-invalid={Boolean(errors.email)}
                className="h-11 w-full bg-transparent pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground"
              />
            </Field>

            <Field
              label="Password"
              error={errors.password?.message}
              icon={<LockKeyhole className="size-4" />}
            >
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
                className="h-11 w-full bg-transparent pl-10 pr-11 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="focus-ring absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </Field>

            <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-muted-foreground">
              <input
                {...register("remember")}
                type="checkbox"
                className="focus-ring size-4 rounded border-border accent-[var(--color-primary)]"
              />
              Remember me on this device
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="focus-ring flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  icon,
  children,
}: {
  label: string;
  error?: string | undefined;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </label>
      <div
        className={cn(
          "relative rounded-xl border bg-surface-2 transition-colors focus-within:border-primary/50",
          error ? "border-destructive/60" : "border-border",
        )}
      >
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        {children}
      </div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
