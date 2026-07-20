import type { ApiError, ActionResult } from "@/types/api";

/**
 * Extracts a human-readable error message from an unknown error object,
 * prioritizing Axios error responses, standard Error instances, string errors, or fallback text.
 */
export function extractErrorMessage(error: unknown, fallbackMessage = "An unexpected error occurred"): string {
  if (!error) return fallbackMessage;

  const apiError = error as ApiError;
  if (apiError.response?.data?.message && typeof apiError.response.data.message === "string") {
    return apiError.response.data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return fallbackMessage;
}

/**
 * Utility helper to construct a failed ActionResult with a standardized error message.
 */
export function handleApiError<T = null>(
  error: unknown,
  fallbackMessage = "An unexpected error occurred"
): ActionResult<T> {
  return {
    success: false,
    data: null,
    error: extractErrorMessage(error, fallbackMessage),
  };
}
