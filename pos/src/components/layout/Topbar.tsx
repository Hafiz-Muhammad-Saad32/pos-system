import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useAuth } from "@/store/auth";
import { useTheme } from "@/store/theme";
import { cn } from "@/lib/utils";

export function Topbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onOpenMobile}
        aria-label="Open navigation"
        className="focus-ring grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-accent lg:hidden"
      >
        <Menu className="size-4" />
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ pathname: "/orders", search: `?q=${encodeURIComponent(query)}` });
        }}
        className="relative min-w-0 flex-1 sm:max-w-md"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search orders, customers…"
          aria-label="Search orders and customers"
          className="focus-ring h-10 w-full rounded-xl border border-border bg-surface-2 pl-9 pr-14 text-sm outline-none transition-colors placeholder:text-muted-foreground hover:border-border-strong"
        />
        <kbd className="numeric pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
          ⌘K
        </kbd>
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          onClick={toggle}
          aria-label="Toggle color theme"
          className="focus-ring grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
        <button
          aria-label="Notifications"
          className="focus-ring relative grid size-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
        </button>
        <div className="hidden items-center gap-2.5 rounded-xl border border-border bg-surface-2 py-1.5 pl-2.5 pr-3 sm:flex">
          <span className="numeric grid size-7 place-items-center rounded-lg bg-primary/15 text-[11px] font-semibold text-primary">
            {user?.avatarInitials}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-medium">{user?.name}</p>
            <p
              className={cn(
                "truncate text-[10px] font-semibold uppercase tracking-wider",
                user?.role === "admin" ? "text-primary" : "text-info",
              )}
            >
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
