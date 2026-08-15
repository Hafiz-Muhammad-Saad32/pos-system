import api from "@/lib/api";
import type { Food, FoodCategory } from "@/types";

/**
 * Food service — all calls go to the real backend.
 * GET /api/foods
 * GET /api/foods/:id
 * GET /api/foods/:id/related
 */

export interface FoodQuery {
  search?: string;
  category?: FoodCategory | "All";
  maxPrice?: number;
  availableOnly?: boolean;
  sort?: "recommended" | "price-asc" | "price-desc" | "rating" | "name";
}

export async function getFoods(query: FoodQuery = {}): Promise<Food[]> {
  const params: Record<string, string> = {};
  if (query.search)           params["search"]        = query.search;
  if (query.category && query.category !== "All") params["category"] = query.category;
  if (query.maxPrice)         params["maxPrice"]      = String(query.maxPrice);
  if (query.availableOnly)    params["availableOnly"] = "true";
  if (query.sort)             params["sort"]          = query.sort;

  const { data } = await api.get<{ foods: Food[] }>("/foods", { params });
  return data.foods;
}

/**
 * Client-side filter — used on the menu page so the user can filter
 * instantly without hitting the server on every keystroke.
 */
export function filterFoods(source: Food[], query: FoodQuery): Food[] {
  const {
    search = "",
    category = "All",
    maxPrice,
    availableOnly = false,
    sort = "recommended",
  } = query;
  const term = search.trim().toLowerCase();

  const result = source.filter((food) => {
    if (category !== "All" && food.category !== category) return false;
    if (availableOnly && !food.available) return false;
    if (typeof maxPrice === "number" && food.price > maxPrice) return false;
    if (!term) return true;
    return (
      food.name.toLowerCase().includes(term) ||
      food.description.toLowerCase().includes(term) ||
      food.category.toLowerCase().includes(term)
    );
  });

  switch (sort) {
    case "price-asc":
      return result.sort((a, b) => a.price - b.price);
    case "price-desc":
      return result.sort((a, b) => b.price - a.price);
    case "rating":
      return result.sort((a, b) => b.rating - a.rating);
    case "name":
      return result.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return result.sort(
        (a, b) => Number(b.available) - Number(a.available) || b.rating - a.rating,
      );
  }
}

export async function getFoodById(id: string): Promise<Food> {
  const { data } = await api.get<{ food: Food }>(`/foods/${id}`);
  return data.food;
}

export async function getFeaturedFoods(): Promise<Food[]> {
  const { data } = await api.get<{ foods: Food[] }>("/foods", {
    params: { featured: "true" },
  });
  return data.foods;
}

export async function getPopularFoods(): Promise<Food[]> {
  const { data } = await api.get<{ foods: Food[] }>("/foods", {
    params: { popular: "true" },
  });
  return data.foods;
}

export async function getRelatedFoods(id: string): Promise<Food[]> {
  const { data } = await api.get<{ foods: Food[] }>(`/foods/${id}/related`);
  return data.foods;
}

export async function searchFoods(term: string): Promise<Food[]> {
  const { data } = await api.get<{ foods: Food[] }>("/foods", {
    params: { search: term },
  });
  return data.foods;
}

/** Used to initialise the price slider on menu page. */
export async function getMaxPrice(): Promise<number> {
  const { data } = await api.get<{ maxPrice: number }>("/foods/max-price");
  return data.maxPrice;
}
