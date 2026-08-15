import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Plus, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { ListSkeleton } from "@/components/common/LoadingSkeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { getFoodsByIdsSync } from "@/services/foodService";
import { formatPrice } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/favorites")({
  head: () => ({
    meta: [
      { title: "Favourites — Meridian" },
      { name: "description", content: "The Meridian dishes you've saved for next time." },
      { property: "og:title", content: "Favourites — Meridian" },
      { property: "og:description", content: "The dishes you've saved for next time." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { user } = useAuth();
  const { ids, isLoading, removeFavorite } = useFavorites();
  const { addItem } = useCart();

  const query = useQuery({
    queryKey: ["favorites", user?.id, ids],
    queryFn: () => getFoodsByIdsSync(ids),
    enabled: Boolean(user),
  });

  const foods = query.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Saved"
        title="Favourites"
        description="Dishes you've kept for later. Add straight to the cart, or clear them out."
      />

      <div className="container-page py-12">
        {isLoading || query.isLoading ? (
          <ListSkeleton rows={3} />
        ) : !foods.length ? (
          <EmptyState
            icon={Heart}
            title="No favourites yet"
            description="Tap the heart on any dish and it'll wait for you here."
            action={
              <Button asChild className="rounded-full">
                <Link to="/menu">Browse the menu</Link>
              </Button>
            }
          />
        ) : (
          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {foods.map((food) => (
                <motion.li
                  key={food.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-xl border border-border bg-card p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <img
                      src={food.image}
                      alt=""
                      loading="lazy"
                      width={160}
                      height={160}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        to="/menu/$id"
                        params={{ id: food.id }}
                        className="block truncate text-base text-foreground hover:text-primary"
                      >
                        {food.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {food.category} · {formatPrice(food.price)}
                      </p>
                      {!food.available ? (
                        <p className="mt-1 text-xs text-destructive">
                          Currently unavailable
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        className="rounded-full"
                        disabled={!food.available}
                        onClick={() => addItem(food)}
                      >
                        <Plus className="mr-1.5 h-4 w-4" /> Add to cart
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-full text-muted-foreground hover:text-destructive"
                        onClick={() => removeFavorite(food.id)}
                        aria-label={`Remove ${food.name} from favourites`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </>
  );
}
