import { useLocation, useNavigate } from "react-router-dom";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import * as favoriteService from "@/services/favoriteService";
import type { Food } from "@/types";

interface FavoritesContextValue {
  ids: string[];
  isLoading: boolean;
  isFavorite: (foodId: string) => boolean;
  toggleFavorite: (food: Food) => void;
  removeFavorite: (foodId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [ids, setIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites from backend whenever the user changes
  useEffect(() => {
    if (!user) {
      setIds([]);
      return;
    }
    let active = true;
    setIsLoading(true);
    favoriteService
      .getFavorites() // no userId needed — JWT tells backend who you are
      .then((next) => active && setIds(next))
      .catch(() => active && setIds([]))
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, [user]);

  const isFavorite = useCallback((foodId: string) => ids.includes(foodId), [ids]);

  const toggleFavorite = useCallback(
    (food: Food) => {
      if (!isAuthenticated || !user) {
        toast.info("Sign in to save favourites");
        navigate({ pathname: "/login", search: `?redirect=${encodeURIComponent(pathname)}` });
        return;
      }
      if (ids.includes(food.id)) {
        favoriteService
          .removeFavorite(food.id)
          .then(setIds)
          .catch(() => {
            toast.error("Could not remove favourite — try again");
          });
        toast.success(`${food.name} removed from favourites`);
      } else {
        favoriteService
          .addFavorite(food.id)
          .then(setIds)
          .catch(() => {
            toast.error("Could not save favourite — try again");
          });
        toast.success(`${food.name} saved to favourites`);
      }
    },
    [ids, isAuthenticated, user, navigate, pathname],
  );

  const removeFavorite = useCallback(
    (foodId: string) => {
      if (!user) return;
      favoriteService
        .removeFavorite(foodId)
        .then(setIds)
        .catch(() => {
          toast.error("Could not remove favourite — try again");
        });
      toast.success("Removed from favourites");
    },
    [user],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({ ids, isLoading, isFavorite, toggleFavorite, removeFavorite }),
    [ids, isLoading, isFavorite, toggleFavorite, removeFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return context;
}
