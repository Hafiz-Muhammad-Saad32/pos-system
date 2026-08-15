import api from "@/lib/api";

/**
 * Favorites service — all calls go to the real backend.
 * GET    /api/favorites
 * POST   /api/favorites/:foodId
 * DELETE /api/favorites/:foodId
 */

export async function getFavorites(): Promise<string[]> {
  const { data } = await api.get<{ favorites: string[] }>("/favorites");
  return data.favorites;
}

export async function addFavorite(foodId: string): Promise<string[]> {
  const { data } = await api.post<{ favorites: string[] }>(`/favorites/${foodId}`);
  return data.favorites;
}

export async function removeFavorite(foodId: string): Promise<string[]> {
  const { data } = await api.delete<{ favorites: string[] }>(`/favorites/${foodId}`);
  return data.favorites;
}
