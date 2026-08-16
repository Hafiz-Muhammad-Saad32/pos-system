import type { FoodCategory } from "@/types";

export interface MenuSearch {
  q: string;
  category: FoodCategory | "All";
}

/** Builds a "?q=...&category=..." string, omitting empty/default values. */
export function buildMenuSearch({ q, category }: { q: string; category: string }): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category && category !== "All") params.set("category", category);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/** Reads {q, category} out of a URLSearchParams instance with the same
 * defaults the old `validateSearch` on the /menu route used. */
export function readMenuSearch(searchParams: URLSearchParams): MenuSearch {
  return {
    q: searchParams.get("q") ?? "",
    category: (searchParams.get("category") as FoodCategory | "All" | null) ?? "All",
  };
}
