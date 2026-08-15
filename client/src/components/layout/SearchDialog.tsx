import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { StarRating } from "@/components/common/StarRating";
import { formatPrice } from "@/utils/format";
import { readStorage, STORAGE_KEYS, writeStorage } from "@/utils/storage";
import { searchFoods } from "@/services/foodService";

const SUGGESTIONS = ["Truffle", "Burger", "Pizza", "Fries", "Dessert", "Cold brew"];

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(readStorage<string[]>(STORAGE_KEYS.recentSearches, []));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const searchQuery = useQuery({
    queryKey: ["foods", "search", term],
    queryFn: () => searchFoods(term),
    enabled: term.trim().length > 1,
    staleTime: 30_000,
  });
  const results = useMemo(
    () => (term.trim().length > 1 ? (searchQuery.data ?? []).slice(0, 6) : []),
    [term, searchQuery.data],
  );

  function commit(value: string) {
    const cleaned = value.trim();
    if (!cleaned) return;
    const next = [cleaned, ...recent.filter((item) => item !== cleaned)].slice(0, 5);
    setRecent(next);
    writeStorage(STORAGE_KEYS.recentSearches, next);
  }

  function goToMenu(value: string) {
    commit(value);
    onClose();
    setTerm("");
    navigate({ to: "/menu", search: { q: value.trim(), category: "All" } });
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-70 flex items-start justify-center px-4 pt-20 sm:pt-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search the menu"
            initial={{ opacity: 0, y: -14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-elevated"
          >
            <div className="flex items-center gap-3 border-b border-border px-5">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
              <input
                autoFocus
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") goToMenu(term);
                }}
                placeholder="Search dishes, categories, ingredients…"
                className="h-16 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                aria-label="Search dishes"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-5">
              {!term.trim() ? (
                <div className="space-y-6">
                  {recent.length ? (
                    <div>
                      <p className="eyebrow mb-3">Recent searches</p>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setTerm(item)}
                            className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div>
                    <p className="eyebrow mb-3">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTIONS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setTerm(item)}
                          className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : results.length ? (
                <ul className="space-y-1">
                  {results.map((food) => (
                    <li key={food.id}>
                      <Link
                        to="/menu/$id"
                        params={{ id: food.id }}
                        onClick={() => {
                          commit(term);
                          onClose();
                          setTerm("");
                        }}
                        className="flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-accent"
                      >
                        <img
                          src={food.image}
                          alt=""
                          loading="lazy"
                          width={80}
                          height={80}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-foreground">
                            {food.name}
                          </span>
                          <span className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                            {food.category}
                            <StarRating value={food.rating} />
                            {!food.available ? (
                              <span className="text-destructive">Unavailable</span>
                            ) : null}
                          </span>
                        </span>
                        <span className="font-display text-lg text-foreground">
                          {formatPrice(food.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-sm text-foreground">
                    Nothing on the menu matches “{term}”.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try “burger”, “pizza” or browse the full menu.
                  </p>
                  <button
                    type="button"
                    onClick={() => goToMenu("")}
                    className="mt-5 rounded-full border border-primary/40 px-4 py-2 text-sm text-primary hover:bg-primary/10"
                  >
                    Browse the full menu
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
