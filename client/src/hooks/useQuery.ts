import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal drop-in replacement for @tanstack/react-query's useQuery.
 * Re-runs queryFn whenever queryKey changes (deep-compared via JSON.stringify)
 * or when `enabled` flips to true. Preserves the loading/error/refetch shape
 * every page in this app was already built against.
 */
export interface UseQueryOptions<T> {
  queryKey: readonly unknown[];
  queryFn: () => Promise<T>;
  enabled?: boolean;
}

export interface UseQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

export function useQuery<T>({
  queryKey,
  queryFn,
  enabled = true,
}: UseQueryOptions<T>): UseQueryResult<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<unknown>(undefined);
  const [reloadIndex, setReloadIndex] = useState(0);

  const queryFnRef = useRef(queryFn);
  queryFnRef.current = queryFn;

  const key = JSON.stringify(queryKey);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);
    setIsError(false);
    setError(undefined);

    queryFnRef
      .current()
      .then((result) => {
        if (!active) return;
        setData(result);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setIsError(true);
        setError(err);
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [key, enabled, reloadIndex]);

  const refetch = useCallback(() => setReloadIndex((current) => current + 1), []);

  return { data, isLoading, isError, error, refetch };
}
