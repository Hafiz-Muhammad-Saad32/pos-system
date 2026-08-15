import { queryClient } from "./queryClient";

/** Returns the shared query cache, mirroring TanStack Query's `useQueryClient`. */
export function useQueryClient() {
  return queryClient;
}
