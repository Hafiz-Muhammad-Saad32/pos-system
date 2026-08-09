import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

export function Forbidden() {
  return (
    <div className="panel grid-backdrop flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="grid size-14 place-items-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
        <ShieldAlert className="size-6" />
      </div>
      <p className="numeric mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-destructive">
        403
      </p>
      <h1 className="mt-2 text-2xl font-semibold">Unauthorized</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Your role doesn&apos;t have permission to view this section. Contact an
        administrator if you believe this is a mistake.
      </p>
      <Link
        to="/dashboard"
        className="focus-ring mt-6 inline-flex items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
