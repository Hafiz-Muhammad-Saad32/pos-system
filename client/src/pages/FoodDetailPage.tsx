import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Heart, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

import { PageMeta } from "@/components/common/PageMeta";
import { DetailSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { QuantityStepper } from "@/components/common/QuantityStepper";
import { StarRating } from "@/components/common/StarRating";
import { FoodGrid } from "@/components/food/FoodGrid";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useQuery } from "@/hooks/useQuery";
import { cn } from "@/lib/utils";
import { getFoodById, getRelatedFoods } from "@/services/foodService";
import { formatPrice } from "@/utils/format";

export function FoodDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);

  const food = useQuery({ queryKey: ["food", id], queryFn: () => getFoodById(id) });
  const related = useQuery({
    queryKey: ["food", id, "related"],
    queryFn: () => getRelatedFoods(id),
  });

  if (food.isLoading) {
    return (
      <div className="container-page py-16">
        <DetailSkeleton />
      </div>
    );
  }

  if (food.isError || !food.data) {
    return (
      <div className="container-page py-20">
        <EmptyState
          icon={UtensilsCrossed}
          title="We couldn't find that dish"
          description="It may have been retired from the menu. Browse what's cooking today instead."
          action={
            <Button asChild className="rounded-full">
              <Link to="/menu">Back to menu</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const item = food.data;
  const saved = isFavorite(item.id);

  return (
    <>
      <PageMeta
        title="Dish details — Meridian Kitchen & Bar"
        description="Full details for this Meridian dish: ingredients, price, rating, availability and related plates from the same section of the menu."
        ogTitle="Dish details — Meridian"
        ogDescription="Ingredients, price, rating and availability for this Meridian dish."
      />
      <div className="container-page pt-10">
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to menu
        </Link>
      </div>

      <article className="container-page grid gap-12 py-10 lg:grid-cols-2 lg:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-border"
        >
          <img
            src={item.image}
            alt={item.name}
            width={1000}
            height={1000}
            className={cn("aspect-square w-full object-cover", !item.available && "grayscale")}
          />
        </motion.div>

        <div className="min-w-0">
          <p className="eyebrow">{item.category}</p>
          <h1 className="display-lg mt-3 text-foreground">{item.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <StarRating value={item.rating} />
            {item.prepTime ? (
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> {item.prepTime} min
              </span>
            ) : null}
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em]",
                item.available
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-destructive/40 bg-destructive/10 text-destructive",
              )}
            >
              {item.available ? "Available now" : "Unavailable"}
            </span>
          </div>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground">{item.description}</p>

          <p className="mt-8 font-display text-4xl text-foreground">{formatPrice(item.price)}</p>

          {!item.available ? (
            <div className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">This dish is off the menu right now</p>
              <p className="mt-2">
                The kitchen has run out of a key ingredient today, so ordering is disabled. Save it
                to your favourites and we'll keep it handy for your next order.
              </p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QuantityStepper value={quantity} onChange={setQuantity} disabled={!item.available} />
            <Button
              size="lg"
              className="rounded-full px-7"
              disabled={!item.available}
              onClick={() => addItem(item, quantity)}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {item.available
                ? `Add ${quantity} to cart · ${formatPrice(item.price * quantity)}`
                : "Unavailable"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              onClick={() => toggleFavorite(item)}
              aria-pressed={saved}
            >
              <Heart className={cn("mr-2 h-4 w-4", saved && "fill-primary text-primary")} />
              {saved ? "Saved" : "Favourite"}
            </Button>
          </div>
        </div>
      </article>

      <section className="border-t border-border py-16">
        <div className="container-page">
          <h2 className="display-lg mb-10 text-foreground">You might also like</h2>
          <FoodGrid foods={related.data ?? []} isLoading={related.isLoading} skeletonCount={3} />
        </div>
      </section>
    </>
  );
}
