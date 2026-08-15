import { Search, X } from "lucide-react";
import type { ChangeEvent } from "react";

import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  id?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search dishes, categories…",
  className,
  autoFocus = false,
  id = "food-search",
}: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <label className="sr-only" htmlFor={id}>
        Search the menu
      </label>
      <input
        id={id}
        type="search"
        autoFocus={autoFocus}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-full border border-border bg-surface pl-11 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
