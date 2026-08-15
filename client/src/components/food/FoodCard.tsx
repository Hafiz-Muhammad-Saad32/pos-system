import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, Plus } from "lucide-react";

import { StarRating } from "@/components/common/StarRating";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { cn } from "@/lib/utils";
import type { Food } from "@/types";
import { formatPrice } from "@/utils/format";

interface FoodCardProps {
  food: Food;
  index?: number;
}

export function FoodCard({ food, index = 0 }: FoodCardProps) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const reduced = useReducedMotion();
  const saved = isFavorite(food.id);

  return (
    <motion.article
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3) }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 hover:border-primary/40",
        !food.available && "opacity-75",
      )}
    >
      <Link
        to="/menu/$id"
        params={{ id: food.id }}
        className="relative block aspect-[4/3] overflow-hidden bg-surface"
      >
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          width={800}
          height={600}
          className={cn(
            "h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-[1.04]",
            !food.available && "grayscale",
          )}
        />
        <span className="absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-foreground backdrop-blur">
          {food.category}
        </span>
        {!food.available ? (
          <span className="absolute inset-x-0 bottom-0 bg-background/85 py-2 text-center text-xs font-medium uppercase tracking-[0.2em] text-destructive backdrop-blur">
            Unavailable
          </span>
        ) : null}
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(food)}
        aria-label={saved ? `Remove ${food.name} from favourites` : `Save ${food.name} to favourites`}
        aria-pressed={saved}
        className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition-transform duration-200 hover:scale-105"
      >
        <Heart
          className={cn("h-4 w-4 transition-colors", saved && "fill-primary text-primary")}
        />
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-lg leading-snug text-foreground">
            <Link to="/menu/$id" params={{ id: food.id }} className="hover:text-primary">
              {food.name}
            </Link>
          </h3>
          <StarRating value={food.rating} />
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {food.description}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3 pt-1">
          <span className="font-display text-2xl text-foreground">
            {formatPrice(food.price)}
          </span>
          <Button
            size="sm"
            className="rounded-full"
            disabled={!food.available}
            onClick={() => addItem(food)}
          >
            {food.available ? (
              <>
                <Plus className="mr-1 h-4 w-4" /> Add
              </>
            ) : (
              "Sold out"
            )}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
