/**
 * Minimal client-side query cache that stands in for TanStack Query's
 * QueryClient. It only implements the subset of behavior this app relies on:
 * - keyed data storage (setQueryData / getQueryData)
 * - prefix-based invalidation (invalidateQueries({ queryKey }))
 * - subscriptions so `useQuery` instances can react to invalidation/updates
 *
 * Query keys are arbitrary arrays (e.g. ["orders", { page: 1 }]) and are
 * serialized with JSON.stringify for storage/comparison, mirroring how
 * TanStack Query hashes query keys.
 */

export type QueryKey = readonly unknown[];

/**
 * "data" — the cached value for this key changed (e.g. via setQueryData);
 * subscribers should just read the new value, no network request needed.
 * "invalidate" — the cached value is considered stale; subscribers should
 * refetch from the network (mirrors TanStack Query's invalidateQueries).
 */
export type QueryEvent = "data" | "invalidate";
type Listener = (event: QueryEvent) => void;

function serializeKey(key: QueryKey): string {
  return JSON.stringify(key);
}

/**
 * Returns true when `key` belongs to the `prefix` query key, i.e. every
 * element of `prefix` matches the corresponding element of `key`. This
 * mirrors TanStack Query's default partial-matching invalidation behavior
 * (invalidating ["orders"] also invalidates ["orders", { page: 1 }]).
 */
function keyMatchesPrefix(key: QueryKey, prefix: QueryKey): boolean {
  if (prefix.length > key.length) return false;
  for (let i = 0; i < prefix.length; i++) {
    if (serializeKey([key[i]]) !== serializeKey([prefix[i]])) return false;
  }
  return true;
}

class QueryClient {
  private cache = new Map<string, unknown>();
  private listeners = new Map<string, Set<Listener>>();
  private knownKeys = new Map<string, QueryKey>();

  getQueryData<T>(key: QueryKey): T | undefined {
    return this.cache.get(serializeKey(key)) as T | undefined;
  }

  hasQueryData(key: QueryKey): boolean {
    return this.cache.has(serializeKey(key));
  }

  setQueryData<T>(key: QueryKey, data: T): void {
    const serialized = serializeKey(key);
    this.cache.set(serialized, data);
    this.knownKeys.set(serialized, key);
    this.notify(serialized, "data");
  }

  /** Notifies subscribers of every cached key that matches the given prefix. */
  invalidateQueries(options: { queryKey: QueryKey }): void {
    for (const [serialized, key] of this.knownKeys.entries()) {
      if (keyMatchesPrefix(key, options.queryKey)) {
        this.notify(serialized, "invalidate");
      }
    }
  }

  subscribe(key: QueryKey, listener: Listener): () => void {
    const serialized = serializeKey(key);
    this.knownKeys.set(serialized, key);
    if (!this.listeners.has(serialized)) this.listeners.set(serialized, new Set());
    this.listeners.get(serialized)!.add(listener);
    return () => {
      this.listeners.get(serialized)?.delete(listener);
    };
  }

  private notify(serialized: string, event: QueryEvent): void {
    this.listeners.get(serialized)?.forEach((listener) => listener(event));
  }
}

/** App-wide singleton, analogous to the single QueryClient instance TanStack Query used. */
export const queryClient = new QueryClient();
export { QueryClient };
