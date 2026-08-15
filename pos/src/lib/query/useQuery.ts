import { useCallback, useEffect, useRef, useState } from "react";
import { queryClient, type QueryKey } from "./queryClient";

export interface UseQueryOptions<T> {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
  /** Skip fetching while false, mirroring TanStack Query's `enabled` option. */
  enabled?: boolean;
  /**
   * When true, the previously loaded data is kept on screen while a new
   * query key is loading (equivalent to `placeholderData: keepPreviousData`).
   */
  keepPreviousData?: boolean;
}

export interface UseQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => Promise<void>;
}

/**
 * Plain fetch + useState/useEffect replacement for TanStack Query's
 * `useQuery`. Re-fetches whenever `queryKey` changes and subscribes to the
 * shared `queryClient` so mutation-driven invalidation triggers a refetch.
 */
export function useQuery<T>({
  queryKey,
  queryFn,
  enabled = true,
  keepPreviousData = false,
}: UseQueryOptions<T>): UseQueryResult<T> {
  const serializedKey = JSON.stringify(queryKey);

  const [data, setData] = useState<T | undefined>(() => queryClient.getQueryData<T>(queryKey));
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchIdRef = useRef(0);
  const queryFnRef = useRef(queryFn);
  queryFnRef.current = queryFn;

  const fetchData = useCallback(async () => {
    const id = ++fetchIdRef.current;
    setIsFetching(true);
    setIsError(false);
    try {
      const result = await queryFnRef.current();
      if (id !== fetchIdRef.current) return;
      queryClient.setQueryData(queryKey, result);
      setData(result);
      setIsFetching(false);
    } catch (err) {
      if (id !== fetchIdRef.current) return;
      setIsFetching(false);
      setIsError(true);
      setError(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedKey]);

  useEffect(() => {
    if (!enabled) return;
    if (!keepPreviousData) setData(queryClient.getQueryData<T>(queryKey));
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedKey, enabled]);

  useEffect(() => {
    return queryClient.subscribe(queryKey, (event) => {
      if (event === "invalidate") {
        void fetchData();
      } else {
        setData(queryClient.getQueryData<T>(queryKey));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedKey, fetchData]);

  const isLoading = isFetching && data === undefined;

  return { data, isLoading, isFetching, isError, error, refetch: fetchData };
}
