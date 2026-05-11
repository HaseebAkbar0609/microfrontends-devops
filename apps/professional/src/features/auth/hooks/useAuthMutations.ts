/**
 * Auth mutations using TanStack Query (useMutation).
 * Hooks specific to Auth.
 */
import { useMutation } from "@tanstack/react-query";
import { loginAPIAction, type LoginAPIPayload, type LoginPayloadData } from "@/api-actions";

/**
 * Hook for login. Returns mutation with mutate({ email, password }), isPending, isError, data, etc.
 */
export function useLoginMutation() {
  return useMutation<LoginPayloadData, Error, LoginAPIPayload>({
    mutationFn: async (payload) => {
      const result = await loginAPIAction(payload);
      if (!result.success || !result.data) {
        throw new Error(result.error ?? "Login failed");
      }
      return result.data;
    },
  });
}
