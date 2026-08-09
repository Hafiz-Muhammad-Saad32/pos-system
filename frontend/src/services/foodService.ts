import type { Food, FoodCategory, Paginated } from "@/types";
import { request } from "./apiClient";

export const FOOD_CATEGORIES: FoodCategory[] = [
  "Starters",
  "Mains",
  "Grill",
  "Desserts",
  "Beverages",
];

export interface FoodQuery {
  search?: string;
  category?: FoodCategory | "all";
  availability?: "all" | "available" | "unavailable";
  page?: number;
  pageSize?: number;
}

export interface FoodPayload {
  name: string;
  description: string;
  category: FoodCategory;
  price: number;
  imageUrl: string;
  available: boolean;
}

const LIST_ALL_PAGE_SIZE = 1000;

export const foodService = {
  /** GET /api/foods */
  list(query: FoodQuery = {}): Promise<Paginated<Food>> {
    return request<Paginated<Food>>({
      method: "GET",
      url: "/foods",
      params: {
        search: query.search,
        category: query.category === "all" ? undefined : query.category,
        availability: query.availability === "all" ? undefined : query.availability,
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 12,
      },
    });
  },

  listAll(): Promise<Food[]> {
    return request<Paginated<Food>>({
      method: "GET",
      url: "/foods",
      params: {
        page: 1,
        pageSize: LIST_ALL_PAGE_SIZE,
      },
    }).then((response) => response.data);
  },

  /** POST /api/foods */
  create(payload: FoodPayload): Promise<Food> {
    return request<Food>({
      method: "POST",
      url: "/foods",
      data: payload,
    });
  },

  /** PATCH /api/foods/:id */
  update(id: string, payload: Partial<FoodPayload>): Promise<Food> {
    return request<Food>({
      method: "PATCH",
      url: `/foods/${id}`,
      data: payload,
    });
  },

  /** DELETE /api/foods/:id */
  remove(id: string): Promise<void> {
    return request<void>({
      method: "DELETE",
      url: `/foods/${id}`,
    });
  },

  toggleAvailability(id: string, currentlyAvailable: boolean): Promise<Food> {
    return foodService.update(id, { available: !currentlyAvailable });
  },
};
