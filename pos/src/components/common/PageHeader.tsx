import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-semibold text-foreground sm:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid size-12 place-items-center rounded-xl border border-border bg-surface-2 text-muted-foreground">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <h3 className="text-base font-semibold text-destructive">
        Couldn&apos;t load this data
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        The request failed. Check your connection and try again.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="focus-ring mt-5 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          Retry
        </button>
      )}
    </div>
  );
}
