import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";

import { PageMeta } from "@/components/common/PageMeta";
import { ErrorState } from "@/components/common/ErrorState";
import { CategoryFilter } from "@/components/food/CategoryFilter";
import { FoodGrid } from "@/components/food/FoodGrid";
import { SearchBar } from "@/components/food/SearchBar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@/hooks/useQuery";
import { filterFoods, getFoods, getMaxPrice, type FoodQuery } from "@/services/foodService";
import { buildMenuSearch, readMenuSearch } from "@/utils/searchParams";
import { formatPrice } from "@/utils/format";

type SortOption = NonNullable<FoodQuery["sort"]>;

export function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { q, category } = readMenuSearch(searchParams);
  const maxPriceQuery = useQuery({ queryKey: ["foods", "maxPrice"], queryFn: getMaxPrice });
  const maxPrice = maxPriceQuery.data ?? 30;

  const [priceCap, setPriceCap] = useState(30);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("recommended");

  const query = useQuery({ queryKey: ["foods", "all"], queryFn: () => getFoods() });

  const foods = useMemo(
    () =>
      filterFoods(query.data ?? [], {
        search: q,
        category,
        maxPrice: priceCap,
        availableOnly,
        sort,
      }),
    [query.data, q, category, priceCap, availableOnly, sort],
  );

  function reset() {
    setSearchParams(buildMenuSearch({ q: "", category: "All" }));
    setPriceCap(maxPrice);
    setAvailableOnly(false);
    setSort("recommended");
  }

  return (
    <>
      <PageMeta
        title="Menu — Meridian Kitchen & Bar"
        description="The full Meridian menu: dry-aged burgers, wood-fired pizza, fire-grilled chicken, sides, drinks and desserts. Search, filter and order in minutes."
        ogDescription="Search and filter the full Meridian menu, then order in minutes."
      />
      <PageHeader
        eyebrow="The menu"
        title="Everything from the pass"
        description="Twelve dishes, cooked to order. Filter by category, price or availability — the kitchen updates stock through the day."
      />

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-8 lg:sticky lg:top-23 lg:h-fit">
          <SearchBar
            value={q}
            onChange={(value) => setSearchParams(buildMenuSearch({ q: value, category }))}
          />

          <div>
            <Label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Category
            </Label>
            <CategoryFilter
              className="mt-3 lg:flex-wrap"
              value={category}
              onChange={(next) => setSearchParams(buildMenuSearch({ q, category: next }))}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Max price
              </Label>
              <span className="text-sm tabular-nums text-foreground">{formatPrice(priceCap)}</span>
            </div>
            <Slider
              className="mt-4"
              min={5}
              max={maxPrice}
              step={1}
              value={[priceCap]}
              onValueChange={([value]) => setPriceCap(value ?? maxPrice)}
              aria-label="Maximum price"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
            <Label htmlFor="available-only" className="text-sm text-foreground">
              Available now only
            </Label>
            <Switch
              id="available-only"
              checked={availableOnly}
              onCheckedChange={setAvailableOnly}
            />
          </div>

          <div>
            <Label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Sort by
            </Label>
            <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
              <SelectTrigger className="mt-3 h-11 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="rating">Highest rated</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="ghost" className="w-full rounded-full" onClick={reset}>
            Clear all filters
          </Button>
        </aside>

        <section aria-label="Menu results">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {query.isLoading ? "Loading dishes…" : `${foods.length} dishes`}
            </p>
          </div>
          {query.isError ? (
            <ErrorState onRetry={() => query.refetch()} />
          ) : (
            <FoodGrid
              foods={foods}
              isLoading={query.isLoading}
              emptyAction={
                <Button className="rounded-full" onClick={reset}>
                  Clear filters
                </Button>
              }
            />
          )}
        </section>
      </div>
    </>
  );
}
