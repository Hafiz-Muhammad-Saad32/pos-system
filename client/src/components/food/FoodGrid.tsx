import { UtensilsCrossed } from "lucide-react";
import type { ReactNode } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { FoodGridSkeleton } from "@/components/common/LoadingSkeleton";
import { FoodCard } from "@/components/food/FoodCard";
import type { Food } from "@/types";

interface FoodGridProps {
  foods: Food[];
  isLoading?: boolean;
  skeletonCount?: number;
  emptyAction?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function FoodGrid({
  foods,
  isLoading = false,
  skeletonCount = 6,
  emptyAction,
  emptyTitle = "No dishes found",
  emptyDescription = "Try a different search term, category or price range.",
}: FoodGridProps) {
  if (isLoading) return <FoodGridSkeleton count={skeletonCount} />;

  if (!foods.length) {
    return (
      <EmptyState
        icon={UtensilsCrossed}
        title={emptyTitle}
        description={emptyDescription}
        {...(emptyAction ? { action: emptyAction } : {})}
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {foods.map((food, index) => (
        <FoodCard key={food.id} food={food} index={index} />
      ))}
    </div>
  );
}
