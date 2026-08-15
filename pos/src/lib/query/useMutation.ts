import { useCallback, useRef, useState } from "react";

export interface UseMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: unknown, variables: TVariables) => void;
}

export interface UseMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  isPending: boolean;
}

/** Plain async-state replacement for TanStack Query's `useMutation`. */
export function useMutation<TData, TVariables = void>({
  mutationFn,
  onSuccess,
  onError,
}: UseMutationOptions<TData, TVariables>): UseMutationResult<TData, TVariables> {
  const [isPending, setIsPending] = useState(false);
  const optionsRef = useRef({ mutationFn, onSuccess, onError });
  optionsRef.current = { mutationFn, onSuccess, onError };

  const mutateAsync = useCallback(async (variables: TVariables) => {
    setIsPending(true);
    try {
      const data = await optionsRef.current.mutationFn(variables);
      optionsRef.current.onSuccess?.(data, variables);
      return data;
    } catch (error) {
      optionsRef.current.onError?.(error, variables);
      throw error;
    } finally {
      setIsPending(false);
    }
  }, []);

  const mutate = useCallback(
    (variables: TVariables) => {
      void mutateAsync(variables);
    },
    [mutateAsync],
  );

  return { mutate, mutateAsync, isPending };
}
